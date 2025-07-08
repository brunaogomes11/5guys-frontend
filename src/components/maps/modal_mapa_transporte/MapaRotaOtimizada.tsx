"use client";
import React, { useState, useEffect } from "react";

interface PontoGeografico {
  lat: number;
  lng: number;
  nome?: string;
}

interface MapaRotaOtimizadaProps {
  pontos: PontoGeografico[];
  onRotaCalculada?: (resultado: {
    distancia: string;
    tempo: string;
  }) => void;
}

const MapaRotaOtimizada: React.FC<MapaRotaOtimizadaProps> = ({ 
  pontos, 
  onRotaCalculada 
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [rotaInfo, setRotaInfo] = useState<{distancia: string; tempo: string} | null>(null);

  useEffect(() => {
    if (pontos.length >= 2) {
      setIsCalculating(true);
      
      // Simula cálculo de rota otimizada
      setTimeout(() => {
        // Calcula distância aproximada entre pontos
        let distanciaTotal = 0;
        
        for (let i = 0; i < pontos.length - 1; i++) {
          const lat1 = pontos[i].lat;
          const lng1 = pontos[i].lng;
          const lat2 = pontos[i + 1].lat;
          const lng2 = pontos[i + 1].lng;
          
          // Fórmula de Haversine simplificada para distância
          const R = 6371; // Raio da Terra em km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                   Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distanciaTotal += R * c;
        }
        
        const tempoEstimado = Math.round(distanciaTotal * 1.5); // Aproximação: 1.5 min por km
        
        const resultado = {
          distancia: distanciaTotal.toFixed(2) + " km",
          tempo: tempoEstimado + " min"
        };
        
        setRotaInfo(resultado);
        setIsCalculating(false);
        
        if (onRotaCalculada) {
          onRotaCalculada(resultado);
        }
      }, 2000);
    }
  }, [pontos, onRotaCalculada]);

  return (
    <div className="w-full h-full relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Simulação de mapa com pontos */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
        <div className="h-full w-full relative">
          {/* Grid simulando mapa */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className="border-b border-gray-300" style={{height: '10%'}} />
            ))}
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className="border-r border-gray-300 absolute top-0 h-full" style={{left: `${i * 10}%`, width: '1px'}} />
            ))}
          </div>
          
          {/* Pontos no mapa */}
          {pontos.map((ponto, index) => (
            <div
              key={index}
              className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                index === 0 ? 'bg-green-500' : 
                index === pontos.length - 1 ? 'bg-red-500' : 
                'bg-blue-500'
              }`}
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
              }}
              title={ponto.nome || `Ponto ${index + 1}`}
            >
              {index + 1}
            </div>
          ))}
          
          {/* Linha conectando os pontos */}
          {pontos.length > 1 && !isCalculating && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {pontos.map((_, index) => {
                if (index === pontos.length - 1) return null;
                const x1 = 20 + (index * 15);
                const y1 = 30 + (index * 10);
                const x2 = 20 + ((index + 1) * 15);
                const y2 = 30 + ((index + 1) * 10);
                
                return (
                  <line
                    key={index}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>
          )}
          
          {/* Legenda dos pontos */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-semibold text-sm mb-2">Pontos da Rota:</h3>
            <div className="space-y-1 text-xs">
              {pontos.map((ponto, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-green-500' : 
                    index === pontos.length - 1 ? 'bg-red-500' : 
                    'bg-blue-500'
                  }`} />
                  <span>{ponto.nome || `Ponto ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Status e informações */}
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
            {isCalculating ? (
              <div className="text-sm text-gray-600">
                <div className="animate-pulse">Calculando rota otimizada...</div>
              </div>
            ) : rotaInfo ? (
              <div className="text-sm">
                <div className="font-semibold text-green-600 mb-1">Rota Otimizada:</div>
                <div>Distância: <span className="font-medium">{rotaInfo.distancia}</span></div>
                <div>Tempo Est.: <span className="font-medium">{rotaInfo.tempo}</span></div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Adicione pontos para calcular a rota
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaRotaOtimizada;
