"use client";
import React, { useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  DirectionsService,
} from "@react-google-maps/api";

// ⚠️ Substitua pelos seus pontos reais
const pontos = [
  { lat: -19.9227, lng: -43.9451 }, // Ponto A
  { lat: -19.918, lng: -43.9378 },  // Ponto B
  { lat: -19.9205, lng: -43.951 },  // Ponto C
];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapaRotaOtimizada = () => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null); // ✅ Corrigido com tipo explícito

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const origin = pontos[0];
  const destination = pontos[pontos.length - 1];
  const waypoints = pontos.slice(1, -1).map((ponto) => ({
    location: ponto,
    stopover: true,
  }));

  const handleDirectionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === "OK" && result) {
      setDirections(result);
    } else {
      console.error("Erro ao buscar rota:", status);
    }
  };

  return (
    <LoadScript googleMapsApiKey="SUA_API_KEY_AQUI">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={origin}
        zoom={14}
        onLoad={onLoad}
      >
        {!directions && (
          <DirectionsService
            options={{
              origin,
              destination,
              waypoints,
              optimizeWaypoints: true,
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={handleDirectionsCallback}
          />
        )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapaRotaOtimizada;
