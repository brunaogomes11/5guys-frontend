'use client'
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

interface MapLeafletProps {
    onSelect: (pos: { lat: number; lng: number }) => void;
}

const MapLeaflet: React.FC<MapLeafletProps> = ({ onSelect }) => {
    const [position, setPosition] = React.useState<{ lat: number; lng: number } | null>(null);

    function LocationMarker() {
        useMapEvents({
            click(e: any) {
                setPosition(e.latlng);
                onSelect(e.latlng);
            },
        });
        return position ? <Marker position={position} /> : null;
    }

    return (
        <MapContainer center={[-15.7801, -47.9292]} zoom={10} style={{ height: "20vw", width: "20vw" }} scrollWheelZoom={true as any}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <LocationMarker />
        </MapContainer>
    );
};

export default MapLeaflet;
