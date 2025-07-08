"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as polyline from "polyline";

// Corrige o ícone padrão do marker do Leaflet para funcionar no Next.js/React
if (typeof window !== "undefined" && L && L.Icon && L.Icon.Default) {
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
}

const defaultIcon = new L.Icon.Default();

// Ícones personalizados para diferentes tipos de pontos
const createCustomIcon = (color: string) => {
    if (typeof window === "undefined") {
        return defaultIcon;
    }
    
    const svgIcon = `
        <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C19.4036 0 25 5.59644 25 12.5C25 19.4036 19.4036 25 12.5 25C5.59644 25 0 19.4036 0 12.5C0 5.59644 5.59644 0 12.5 0Z" fill="${color}"/>
            <path d="M12.5 4C9.18629 4 6.5 6.68629 6.5 10C6.5 13.3137 9.18629 16 12.5 16C15.8137 16 18.5 13.3137 18.5 10C18.5 6.68629 15.8137 4 12.5 4Z" fill="white"/>
            <path d="M12.5 25L20.5 41H4.5L12.5 25Z" fill="${color}"/>
        </svg>
    `;
    
    return new L.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
        iconSize: [25, 41],
        iconAnchor: [12, 12],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const originIcon = createCustomIcon("#16a34a");
const destinationIcon = createCustomIcon("#dc2626");
const waypointIcon = createCustomIcon("#2563eb");
const pickupIcon = createCustomIcon("#f59e0b");
const deliveryIcon = createCustomIcon("#8b5cf6");

interface PontoRota {
    lat: number;
    lng: number;
    nome?: string;
    tipo: "origem" | "destino" | "waypoint" | "pickup" | "delivery";
    detalhes?: string;
    horario?: string;
}

interface ParadaInfo {
    nome: string;
    tipo: "pickup" | "delivery";
    detalhes: string;
    horario: string;
    lat: number;
    lng: number;
    detour: string;
}

interface RotaPolyline {
    polyline?: string;
    pontos?: PontoRota[];
    paradas?: ParadaInfo[];
    tipo_trecho?: string;
    veiculo_label?: string;
    distancia?: number;
    tempo?: number;
    trechos?: {
        polyline: string;
        distancia: number;
        tempo: number;
        paradas: ParadaInfo[];
        tipo_trecho: string;
        veiculo_label: string;
        obra_destino: number;
        ponto_origem?: PontoRota;
        ponto_destino?: PontoRota;
    }[];
}

interface MapaRotaRealProps {
    rota?: RotaPolyline;
    pontos?: PontoRota[];
    onRotaCalculada?: (resultado: { distancia: string; tempo: string }) => void;
}

const FitBounds: React.FC<{ pontos: PontoRota[] }> = ({ pontos }) => {
    const map = useMap();
    
    useEffect(() => {
        if (pontos && pontos.length > 0) {
            const bounds = L.latLngBounds(pontos.map(p => [p.lat, p.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [pontos, map]);
    
    return null;
};

// Novo componente para a legenda do mapa
const LegendaMapa = () => {
    return (
        <div className="leaflet-bottom leaflet-right" style={{ pointerEvents: 'auto' }}>
            <div className="leaflet-control leaflet-bar bg-white p-2 rounded-md shadow-lg">
                <h4 className="font-bold text-sm mb-2">Legenda</h4>
                <ul className="list-none p-0 m-0 text-xs">
                    <li className="flex items-center mb-1">
                        <span className="w-4 h-1 bg-green-500 inline-block mr-2"></span> Rota de Ida
                    </li>
                    <li className="flex items-center mb-1">
                        <span className="w-4 h-1 bg-red-500 inline-block mr-2"></span> Rota de Volta
                    </li>
                    <li className="flex items-center mt-2">
                        <img src={originIcon.options.iconUrl} alt="Origem" className="w-4 h-4 mr-2" /> Origem
                    </li>
                    <li className="flex items-center">
                        <img src={destinationIcon.options.iconUrl} alt="Destino" className="w-4 h-4 mr-2" /> Destino
                    </li>
                    <li className="flex items-center">
                        <img src={pickupIcon.options.iconUrl} alt="Coleta" className="w-4 h-4 mr-2" /> Ponto de Coleta
                    </li>
                    <li className="flex items-center">
                        <img src={deliveryIcon.options.iconUrl} alt="Entrega" className="w-4 h-4 mr-2" /> Ponto de Entrega
                    </li>
                </ul>
            </div>
        </div>
    );
};

const MapaRotaReal: React.FC<MapaRotaRealProps> = ({ 
    rota, 
    pontos = [], 
    onRotaCalculada 
}) => {
    const [pontosDecodificados, setPontosDecodificados] = useState<[number, number][]>([]);
    const [pontosVisiveis, setPontosVisiveis] = useState<PontoRota[]>([]);
    const [center, setCenter] = useState<[number, number]>([-15.7801, -47.9292]);
    const [rotaProcessada, setRotaProcessada] = useState<string | null>(null);

    const onRotaCalculadaRef = useRef(onRotaCalculada);
    useEffect(() => {
        onRotaCalculadaRef.current = onRotaCalculada;
    }, [onRotaCalculada]);

    const rotaKey = useMemo(() => {
        if (rota?.trechos && rota.trechos.length > 0) {
            return `trechos-${rota.trechos.length}-${rota.trechos.map(t => t.polyline.substring(0, 10)).join('-')}`;
        }
        if (rota?.polyline) {
            return `single-${rota.polyline.substring(0, 10)}`;
        }
        return 'pontos-manuais';
    }, [rota?.trechos, rota?.polyline]);

    useEffect(() => {
        if (rotaKey === rotaProcessada) {
            return;
        }
        
        if (rota?.trechos && rota.trechos.length > 0) {
            console.log('🔄 Processando múltiplos trechos:', rota.trechos.length);
            
            const todosPontos: PontoRota[] = [];
            const todosTrechosDecodificados: { points: [number, number][]; color: string }[] = [];
            let distanciaTotal = 0;
            let tempoTotal = 0;
            
            rota.trechos.forEach((trecho, indexTrecho) => {
                console.log(`📍 Processando trecho ${indexTrecho + 1}:`, trecho.tipo_trecho);
                
                if (trecho.polyline) {
                    try {
                        const decoded = polyline.decode(trecho.polyline) as [number, number][];
                        todosTrechosDecodificados.push({ 
                            points: decoded, 
                            color: trecho.tipo_trecho.toLowerCase().includes('ida') ? '#16a34a' : '#dc2626' 
                        });

                        if (decoded.length > 0) {
                            // Adiciona ponto de origem da API APENAS se disponível
                            if (indexTrecho === 0 && trecho.ponto_origem) {
                                console.log(`🚀 Usando origem da API:`, trecho.ponto_origem);
                                todosPontos.push({
                                    lat: trecho.ponto_origem.lat,
                                    lng: trecho.ponto_origem.lng,
                                    nome: trecho.ponto_origem.nome,
                                    tipo: "origem",
                                    detalhes: trecho.ponto_origem.detalhes
                                });
                            }
                            
                            // Adiciona paradas reais do trecho
                            if (trecho.paradas && trecho.paradas.length > 0) {
                                console.log(`✅ Adicionando ${trecho.paradas.length} paradas com coordenadas reais`);
                                
                                trecho.paradas.forEach((parada) => {
                                    todosPontos.push({
                                        lat: parada.lat,
                                        lng: parada.lng,
                                        nome: parada.nome,
                                        tipo: parada.tipo,
                                        detalhes: `${parada.detalhes} - ${trecho.tipo_trecho}`,
                                        horario: parada.horario
                                    });
                                });
                            }
                            
                            // Adiciona ponto de destino da API APENAS se disponível
                            if (indexTrecho === (rota.trechos?.length || 0) - 1 && trecho.ponto_destino) {
                                console.log(`🎯 Usando destino da API:`, trecho.ponto_destino);
                                todosPontos.push({
                                    lat: trecho.ponto_destino.lat,
                                    lng: trecho.ponto_destino.lng,
                                    nome: trecho.ponto_destino.nome,
                                    tipo: "destino",
                                    detalhes: trecho.ponto_destino.detalhes
                                });
                            }
                            
                            distanciaTotal += trecho.distancia;
                            tempoTotal += trecho.tempo;
                        }
                    } catch (error) {
                        console.error(`Erro ao decodificar polyline do trecho ${indexTrecho}:`, error);
                    }
                }
            });
            
            console.log(`🎯 Total de pontos processados: ${todosPontos.length}`);
            setPontosVisiveis(todosPontos);
            setPontosDecodificados(todosTrechosDecodificados.flatMap(t => t.points)); // Apenas para ajuste de bounds

            // Atualiza o estado com os trechos coloridos
            // (A lógica de renderização será adaptada para usar isso)

            if (onRotaCalculadaRef.current) {
                const distanciaKm = (distanciaTotal / 1000).toFixed(2);
                const tempoMin = Math.round(tempoTotal / 60);
                
                setTimeout(() => {
                    onRotaCalculadaRef.current?.({
                        distancia: `${distanciaKm} km`,
                        tempo: `${tempoMin} min`,
                    });
                }, 100);
            }
            
            return;
        }
        
        if (rota?.polyline && rota.polyline.trim() !== '') {
            try {
                const decoded = polyline.decode(rota.polyline) as [number, number][];
                
                if (decoded.length === 0) {
                    throw new Error('Polyline não contém pontos');
                }
                
                setPontosDecodificados(decoded);
                
                const pontosDaRota: PontoRota[] = [];
                const isVolta = rota.tipo_trecho === "VOLTA";
                
                if (decoded.length > 0) {
                    pontosDaRota.push({
                        lat: decoded[0][0],
                        lng: decoded[0][1],
                        nome: isVolta ? "Coleta de Funcionários" : "Origem (Garagem/Base)",
                        tipo: "origem",
                        detalhes: isVolta ? "Local onde os funcionários são coletados" : "Início da rota - Local de partida do veículo"
                    });
                }
                
                if (rota.paradas && decoded.length > 2) {
                    const step = Math.floor(decoded.length / (rota.paradas.length + 1));
                    rota.paradas.forEach((parada, index) => {
                        const pointIndex = step * (index + 1);
                        if (pointIndex < decoded.length - 1) {
                            pontosDaRota.push({
                                lat: decoded[pointIndex][0],
                                lng: decoded[pointIndex][1],
                                nome: parada.nome,
                                tipo: parada.tipo,
                                detalhes: parada.detalhes,
                                horario: parada.horario
                            });
                        }
                    });
                }
                
                if (decoded.length > 1) {
                    pontosDaRota.push({
                        lat: decoded[decoded.length - 1][0],
                        lng: decoded[decoded.length - 1][1],
                        nome: isVolta ? "Destino Final (Casa/Origem)" : "Destino (Local de Trabalho)",
                        tipo: "destino",
                        detalhes: isVolta ? "Local onde os funcionários são deixados - fim da rota" : "Local de trabalho - destino final"
                    });
                }
                
                setPontosVisiveis(pontosDaRota);
                setRotaProcessada(rotaKey);

                if (onRotaCalculadaRef.current) {
                    const distanciaKm = rota.distancia ? (rota.distancia / 1000).toFixed(2) : "0";
                    const tempoMin = rota.tempo ? Math.round(rota.tempo / 60) : 0;
                    
                    setTimeout(() => {
                        onRotaCalculadaRef.current?.({
                            distancia: `${distanciaKm} km`,
                            tempo: `${tempoMin} min`,
                        });
                    }, 100);
                }

            } catch (error) {
                console.error("Erro ao decodificar polyline:", error);
                setPontosVisiveis(pontos);
                setPontosDecodificados([]);
                setRotaProcessada(rotaKey);
            }
        } else if (!rota?.polyline && !rota?.trechos) {
            setPontosVisiveis(pontos);
            setPontosDecodificados([]);
            setRotaProcessada(rotaKey);
        }
    }, [rotaKey, rotaProcessada, rota, pontos]);

    useEffect(() => {
        if (pontosVisiveis.length > 0) {
            const centerLat = pontosVisiveis.reduce((sum, point) => sum + point.lat, 0) / pontosVisiveis.length;
            const centerLng = pontosVisiveis.reduce((sum, point) => sum + point.lng, 0) / pontosVisiveis.length;
            setCenter([centerLat, centerLng]);
        }
    }, [pontosVisiveis]);

    return (
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Componente da Legenda */}
                <LegendaMapa />

                {/* Renderiza múltiplos trechos com cores diferentes */}
                {rota?.trechos && rota.trechos.map((trecho, index) => {
                    if (!trecho.polyline) return null;
                    try {
                        const decoded = polyline.decode(trecho.polyline) as [number, number][];
                        const color = trecho.tipo_trecho.toLowerCase().includes('ida') ? '#16a34a' : '#dc2626';
                        return <Polyline key={index} positions={decoded} color={color} weight={5} />;
                    } catch (error) {
                        console.error("Erro ao decodificar polyline para renderização:", error);
                        return null;
                    }
                })}

                {/* Renderiza um único polyline (fallback) */}
                {rota?.polyline && (!rota.trechos || rota.trechos.length === 0) && (
                    <Polyline positions={pontosDecodificados} color="#0ea5e9" weight={5} />
                )}

                {pontosVisiveis.map((ponto, index) => (
                    <Marker 
                        key={`${ponto.tipo}-${index}`} 
                        position={[ponto.lat, ponto.lng]}
                        icon={
                            ponto.tipo === "origem" ? originIcon :
                            ponto.tipo === "destino" ? destinationIcon :
                            ponto.tipo === "pickup" ? pickupIcon :
                            ponto.tipo === "delivery" ? deliveryIcon :
                            waypointIcon
                        }
                    >
                        <Popup>
                            <div className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    {ponto.tipo === "origem" && "🚌 "}
                                    {ponto.tipo === "destino" && "🎯 "}
                                    <strong>{ponto.nome}</strong>
                                </div>
                                {ponto.detalhes && (
                                    <div className="text-gray-600 text-xs mb-1">
                                        {ponto.detalhes}
                                    </div>
                                )}
                                {ponto.horario && (
                                    <div className="text-blue-600 text-xs">
                                        ⏰ {new Date(ponto.horario).toLocaleTimeString('pt-BR', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
                
                <FitBounds pontos={pontosVisiveis} />
            </MapContainer>
        </div>
    );
};

export default MapaRotaReal;
