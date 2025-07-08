'use client'
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
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

// Ícone personalizado para a localização do usuário (azul)
const userLocationIcon = typeof window !== "undefined" ? new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'user-location-marker'
}) : null;

// Ícone personalizado para seleção (vermelho)
const selectionIcon = typeof window !== "undefined" ? new L.Icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNEQzI2MjYiLz4KPHBhdGggZD0iTTEyLjUgNEM5LjE4NjI5IDQgNi41IDYuNjg2MjkgNi41IDEwQzYuNSAxMy4zMTM3IDkuMTg2MjkgMTYgMTIuNSAxNkMxNS44MTM3IDE2IDE4LjUgMTMuMzEzNyAxOC41IDEwQzE4LjUgNi42ODYyOSAxNS44MTM3IDQgMTIuNSA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyLjUgMjVMMjAuNSA0MUg0LjVMMTIuNSAyNVoiIGZpbGw9IiNEQzI2MjYiLz4KPC9zdmc+",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}) : null;

interface MapLeafletProps {
    onSelect: (pos: { lat: number; lng: number }) => void;
}

// Coordenadas padrão de Brasília
const BRASILIA_COORDS = { lat: -15.7801, lng: -47.9292 };

const MapLeaflet: React.FC<MapLeafletProps> = ({ onSelect }) => {
    const [position, setPosition] = React.useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = React.useState<{ lat: number; lng: number }>(BRASILIA_COORDS);
    const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = React.useState(true);
    const [locationError, setLocationError] = React.useState<string | null>(null);

    // Hook para detectar geolocalização automaticamente
    React.useEffect(() => {
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(coords);
                    setMapCenter(coords);
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.log("Erro ao obter localização:", error.message);
                    let errorMessage = "";
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "Permissão de localização negada. Usando Brasília como padrão.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Localização indisponível. Usando Brasília como padrão.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "Tempo limite excedido. Usando Brasília como padrão.";
                            break;
                        default:
                            errorMessage = "Erro desconhecido. Usando Brasília como padrão.";
                            break;
                    }
                    setLocationError(errorMessage);
                    // Se o usuário negar ou houver erro, usa Brasília como padrão
                    setMapCenter(BRASILIA_COORDS);
                    setIsLoadingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            // Se geolocalização não está disponível, usa Brasília
            setLocationError("Geolocalização não suportada pelo navegador. Usando Brasília como padrão.");
            setMapCenter(BRASILIA_COORDS);
            setIsLoadingLocation(false);
        }
    }, []);

    function LocationMarker() {
        useMapEvents({
            click(e: any) {
                setPosition(e.latlng);
                onSelect(e.latlng);
            },
        });
        return position ? (
            <Marker position={position} icon={selectionIcon || undefined}>
                <Popup>
                    <div className="text-center">
                        <strong>🎯 Local selecionado</strong>
                        <br />
                        <small>Lat: {position.lat.toFixed(5)}</small>
                        <br />
                        <small>Lng: {position.lng.toFixed(5)}</small>
                    </div>
                </Popup>
            </Marker>
        ) : null;
    }

    // Mostra um loading enquanto tenta obter a localização
    if (isLoadingLocation) {
        return (
            <div style={{ 
                height: "20vw", 
                width: "20vw", 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "8px",
                border: "2px dashed #dee2e6",
                color: "#6c757d"
            }}>
                <div className="animate-pulse">🌍</div>
                <div className="mt-2 text-sm">Detectando localização...</div>
                <div className="text-xs mt-1">Aguarde um momento</div>
            </div>
        );
    }

    return (
        <div>
            {locationError && (
                <div className="mb-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-xs">
                    ⚠️ {locationError}
                </div>
            )}
            <MapContainer 
                center={[mapCenter.lat, mapCenter.lng]} 
                zoom={userLocation ? 13 : 10} 
                style={{ height: "20vw", width: "100%" }} 
                scrollWheelZoom={true as any}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* Marker da localização do usuário (se disponível) */}
                {userLocation && (
                    <Marker 
                        position={[userLocation.lat, userLocation.lng]}
                        icon={userLocationIcon || undefined}
                    >
                        <Popup>
                            <div className="text-center">
                                <strong>📍 Sua localização atual</strong>
                                <br />
                                <small>Detectada automaticamente</small>
                            </div>
                        </Popup>
                    </Marker>
                )}
                
                {/* Marker clicável */}
                <LocationMarker />
            </MapContainer>
        </div>
    );
};

export default MapLeaflet;
