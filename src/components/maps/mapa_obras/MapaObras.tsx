'use client'
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige o ícone padrão do marker do Leaflet para funcionar no Next.js/React
if (typeof window !== "undefined" && L && L.Icon && L.Icon.Default) {
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
}

// Ícone personalizado para obras (verde)
const obraIcon = typeof window !== "undefined" ? new L.Icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiMyMjc3M0QiLz4KPHBhdGggZD0iTTEyLjUgNEM5LjE4NjI5IDQgNi41IDYuNjg2MjkgNi41IDEwQzYuNSAxMy4zMTM3IDkuMTg2MjkgMTYgMTIuNSAxNkMxNS44MTM3IDE2IDE4LjUgMTMuMzEzNyAxOC41IDEwQzE4LjUgNi42ODYyOSAxNS44MTM3IDQgMTIuNSA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyLjUgMjVMMjAuNSA0MUg0LjVMMTIuNSAyNVoiIGZpbGw9IiMyMjc3M0QiLz4KPC9zdmc+",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}) : null;

interface Obra {
    id: number;
    nome: string;
    endereco: string;
    numero?: string;
    cidade: string;
    estado: string;
    cep?: string;
    latitude?: number;
    longitude?: number;
}

interface MapaObrasProps {
    refreshTrigger?: number;
}

// Coordenadas padrão de Brasília
const BRASILIA_COORDS = { lat: -15.7801, lng: -47.9292 };

const MapaObras: React.FC<MapaObrasProps> = ({ refreshTrigger }) => {
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchObras() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/obras/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                
                if (res.ok) {
                    const data = await res.json();
                    // Filtra apenas obras que têm coordenadas válidas
                    const obrasComCoordenadas = data.filter((obra: Obra) => 
                        obra.latitude && 
                        obra.longitude && 
                        !isNaN(Number(obra.latitude)) && 
                        !isNaN(Number(obra.longitude))
                    );
                    setObras(obrasComCoordenadas);
                } else {
                    setError('Erro ao carregar obras');
                }
            } catch (err) {
                setError('Erro de conexão');
                console.error('Erro ao buscar obras:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchObras();
    }, [refreshTrigger]);

    // Calcula o centro do mapa baseado nas obras ou usa Brasília como padrão
    const calculateMapCenter = () => {
        if (obras.length === 0) return BRASILIA_COORDS;
        
        const lats = obras.map(obra => Number(obra.latitude));
        const lngs = obras.map(obra => Number(obra.longitude));
        
        const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
        const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
        
        return { lat: avgLat, lng: avgLng };
    };

    // Calcula o zoom baseado na dispersão das obras
    const calculateZoom = () => {
        if (obras.length <= 1) return 10;
        
        const lats = obras.map(obra => Number(obra.latitude));
        const lngs = obras.map(obra => Number(obra.longitude));
        
        const latRange = Math.max(...lats) - Math.min(...lats);
        const lngRange = Math.max(...lngs) - Math.min(...lngs);
        const maxRange = Math.max(latRange, lngRange);
        
        if (maxRange > 10) return 6;
        if (maxRange > 5) return 7;
        if (maxRange > 2) return 8;
        if (maxRange > 1) return 9;
        if (maxRange > 0.5) return 10;
        return 11;
    };

    const mapCenter = calculateMapCenter();
    const zoom = calculateZoom();

    if (loading) {
        return (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary mx-auto mb-2"></div>
                    <p className="text-gray-600">Carregando mapa das obras...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>❌ {error}</p>
                    <p className="text-sm text-gray-500 mt-2">Verifique sua conexão e tente novamente</p>
                </div>
            </div>
        );
    }

    if (obras.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                    <p>📍 Nenhuma obra com localização encontrada</p>
                    <p className="text-sm text-gray-500 mt-2">Cadastre obras com endereço para visualizá-las no mapa</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-200">
            <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {obras.map((obra) => (
                    <Marker
                        key={obra.id}
                        position={[Number(obra.latitude), Number(obra.longitude)]}
                        icon={obraIcon || undefined}
                    >
                        <Popup>
                            <div className="max-w-xs">
                                <h3 className="font-bold text-lg text-blue-primary mb-2">
                                    🏗️ {obra.nome}
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><strong>📍 Endereço:</strong> {obra.endereco}{obra.numero ? `, ${obra.numero}` : ''}</p>
                                    <p><strong>🏙️ Cidade:</strong> {obra.cidade}/{obra.estado}</p>
                                    {obra.cep && (
                                        <p><strong>📮 CEP:</strong> {obra.cep}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        📐 Coordenadas: {Number(obra.latitude).toFixed(4)}, {Number(obra.longitude).toFixed(4)}
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapaObras;
