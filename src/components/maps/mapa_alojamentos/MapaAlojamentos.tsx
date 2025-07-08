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

// Ícone personalizado para alojamentos (roxo)
const alojamentoIcon = typeof window !== "undefined" ? new L.Icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiM4YjVjZjYiLz4KPHBhdGggZD0iTTEyLjUgNEM5LjE4NjI5IDQgNi41IDYuNjg2MjkgNi41IDEwQzYuNSAxMy4zMTM3IDkuMTg2MjkgMTYgMTIuNSAxNkMxNS44MTM3IDE2IDE4LjUgMTMuMzEzNyAxOC41IDEwQzE4LjUgNi42ODYyOSAxNS44MTM3IDQgMTIuNSA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyLjUgMjVMMjAuNSA0MUg0LjVMMTIuNSAyNVoiIGZpbGw9IiM4YjVjZjYiLz4KPC9zdmc+",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}) : null;

interface Alojamento {
    id: number;
    nome: string;
    endereco: string;
    numero?: string;
    cidade: string;
    estado: string;
    cep?: string;
    latitude?: number;
    longitude?: number;
    capacidade?: number;
    tipo?: string;
}

interface MapaAlojamentosProps {
    refreshTrigger?: number;
}

// Coordenadas padrão de Brasília
const BRASILIA_COORDS = { lat: -15.7801, lng: -47.9292 };

const MapaAlojamentos: React.FC<MapaAlojamentosProps> = ({ refreshTrigger }) => {
    const [alojamentos, setAlojamentos] = useState<Alojamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAlojamentos() {
            try {
                setLoading(true);
                setError(null);
                
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/alojamentos/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Dados dos alojamentos carregados:', data);
                
                // Filtra apenas alojamentos com coordenadas válidas
                const alojamentosComCoordenadas = data.filter((alojamento: Alojamento) => {
                    const lat = parseFloat(String(alojamento.latitude));
                    const lng = parseFloat(String(alojamento.longitude));
                    
                    return alojamento.latitude && 
                           alojamento.longitude && 
                           !isNaN(lat) && 
                           !isNaN(lng) &&
                           lat >= -90 && lat <= 90 &&
                           lng >= -180 && lng <= 180;
                });

                // Converte as coordenadas para números
                const alojamentosProcessados = alojamentosComCoordenadas.map((alojamento: Alojamento) => ({
                    ...alojamento,
                    latitude: parseFloat(String(alojamento.latitude)),
                    longitude: parseFloat(String(alojamento.longitude))
                }));

                setAlojamentos(alojamentosProcessados);
                console.log(`${alojamentosProcessados.length} alojamentos com coordenadas válidas`);
                
            } catch (err) {
                console.error('Erro ao carregar alojamentos:', err);
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        }

        fetchAlojamentos();
    }, [refreshTrigger]);

    // Calcula o centro do mapa baseado nos alojamentos
    const getMapCenter = (): [number, number] => {
        if (alojamentos.length === 0) {
            return [BRASILIA_COORDS.lat, BRASILIA_COORDS.lng];
        }

        const avgLat = alojamentos.reduce((sum, alojamento) => sum + (alojamento.latitude || 0), 0) / alojamentos.length;
        const avgLng = alojamentos.reduce((sum, alojamento) => sum + (alojamento.longitude || 0), 0) / alojamentos.length;

        // Verifica se as coordenadas calculadas são válidas
        if (isNaN(avgLat) || isNaN(avgLng)) {
            return [BRASILIA_COORDS.lat, BRASILIA_COORDS.lng];
        }

        return [avgLat, avgLng];
    };

    // Calcula os bounds para ajustar o zoom
    const getBounds = () => {
        if (alojamentos.length === 0) return null;

        try {
            const validCoords = alojamentos
                .filter(alojamento => 
                    alojamento.latitude && 
                    alojamento.longitude && 
                    !isNaN(alojamento.latitude) && 
                    !isNaN(alojamento.longitude)
                )
                .map(alojamento => [alojamento.latitude!, alojamento.longitude!] as [number, number]);

            if (validCoords.length === 0) return null;

            const bounds = L.latLngBounds(validCoords);
            return bounds;
        } catch (error) {
            console.error('Erro ao calcular bounds:', error);
            return null;
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Carregando alojamentos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center text-red-600">
                    <p className="font-semibold">Erro ao carregar alojamentos</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={getMapCenter()}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
                bounds={getBounds() || undefined}
                boundsOptions={{ padding: [20, 20] }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {alojamentos.map((alojamento) => (
                    <Marker 
                        key={alojamento.id} 
                        position={[alojamento.latitude!, alojamento.longitude!]}
                        icon={alojamentoIcon || undefined}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg mb-2 text-purple-800">
                                    🏠 {alojamento.nome}
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><strong>📍 Endereço:</strong> {alojamento.endereco}{alojamento.numero ? `, ${alojamento.numero}` : ''}</p>
                                    <p><strong>🏙️ Cidade:</strong> {alojamento.cidade} - {alojamento.estado}</p>
                                    {alojamento.cep && (
                                        <p><strong>📮 CEP:</strong> {alojamento.cep}</p>
                                    )}
                                    {alojamento.capacidade && (
                                        <p><strong>👥 Capacidade:</strong> {alojamento.capacidade} pessoas</p>
                                    )}
                                    {alojamento.tipo && (
                                        <p><strong>🏷️ Tipo:</strong> {alojamento.tipo}</p>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* Indicador de quantidade de alojamentos */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg z-[1000]">
                <div className="text-sm font-semibold text-gray-700">
                    📊 {alojamentos.length} alojamento{alojamentos.length !== 1 ? 's' : ''} encontrado{alojamentos.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
};

export default MapaAlojamentos;
