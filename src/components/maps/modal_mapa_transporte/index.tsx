import React, { useState, useCallback, useMemo, useEffect } from "react";
import MapaRotaReal from "./MapaRotaReal";

interface PontoGeografico {
    lat: number;
    lng: number;
    nome?: string;
    detalhes?: string;
}

interface ParadaRota {
    detour: string;
    isPickup?: boolean;
    startTime: string;
    loadDemands: {
        funcionarios: {
            amount?: string;
        };
    };
    shipmentLabel: string;
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

interface PontoRota {
    nome: string;
    tipo: "origem" | "destino" | "pickup" | "delivery";
    detalhes: string;
    horario: string;
    lat: number;
    lng: number;
    detour: string;
}

interface TrechoDetalhado {
    id: number;
    descricao_transporte: string;
    data_geracao: string;
    tipo_trecho: string;
    veiculo_label: string;
    ordem_paradas: ParadaRota[];
    distancia_total_metros: number | null;
    duracao_total_segundos: number;
    obra_destino: number;
    veiculo: number;
    polyline?: string; // Adicionado polyline do Google
}

interface ResumoVeiculo {
    veiculo_label: string;
    duracao_total_segundos: number;
    trechos_detalhados: TrechoDetalhado[];
    distancia_total_km: number;
    origem_veiculo_coords: { // Renomeado de start_location
        latitude: number;
        longitude: number;
    };
}

interface Rota {
    id_rota?: number;
    descricao_transporte: string;
    distancia_total_operacao_km: number;
    resumo_por_veiculo: ResumoVeiculo[];
    destino_obra_coords: { // Adicionado campo de destino
        latitude: number;
        longitude: number;
    };
    polyline?: string; // Polyline geral da rota
    pontos_geograficos?: PontoGeografico[]; // Pontos específicos da rota
}

interface ModalMapaRotasProps {
    isOpen: boolean;
    onClose: () => void;
    rota?: Rota | null;
}

const ModalMapaRotas: React.FC<ModalMapaRotasProps> = ({ isOpen, onClose, rota }) => {
    const [rotaCalculada, setRotaCalculada] = useState<{distancia: string; tempo: string} | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Todos os hooks devem estar antes de qualquer return condicional
    const handleRotaCalculada = useCallback((resultado: {distancia: string; tempo: string}) => {
        setRotaCalculada(resultado);
    }, []);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    const handleFullscreenClose = useCallback(() => {
        setIsFullscreen(false);
        onClose();
    }, [onClose]);

    // Função para converter segundos em formato legível
    const formatarTempo = useCallback((segundos: number) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        return `${horas}h ${minutos}m`;
    }, []);

    // Função para extrair coordenadas do campo detour
    const extrairCoordenadas = useCallback((detour: string) => {
        try {
            // Formato esperado: "lat,lng" ou "{lat},{lng}"
            const coordStr = detour.replace(/[{}]/g, '').trim();
            const [lat, lng] = coordStr.split(',').map(coord => parseFloat(coord.trim()));
            
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                return { lat, lng };
            }
        } catch (error) {
            console.warn('Erro ao extrair coordenadas do detour:', detour, error);
        }
        return null;
    }, []);

    // Função para extrair dados para o mapa real (memoizada)
    const extrairDadosRota = useCallback((rota: Rota) => {
        console.log('🔍 Extraindo dados da rota:', rota);

        // Se há polyline geral da rota, usa ela
        if (rota.polyline) {
            return {
                polyline: rota.polyline,
                pontos: rota.pontos_geograficos?.map((p, index) => ({
                    lat: p.lat,
                    lng: p.lng,
                    nome: p.nome || `Ponto ${index + 1}`,
                    tipo: (index === 0 ? "origem" : 
                          index === rota.pontos_geograficos!.length - 1 ? "destino" : "waypoint") as "origem" | "destino" | "waypoint"
                })) || [],
                distancia: rota.distancia_total_operacao_km * 1000,
                tempo: rota.resumo_por_veiculo.reduce((total, veiculo) => total + veiculo.duracao_total_segundos, 0)
            };
        }

        // Processa TODOS os trechos para criar uma visualização completa
        const todosTrechos = [];
        let distanciaTotal = 0;
        let tempoTotal = 0;
        
        for (const veiculo of rota.resumo_por_veiculo) {
            console.log(`🚗 Processando veículo: ${veiculo.veiculo_label}`, veiculo);
            
            // Verifica se os campos obrigatórios da API estão presentes
            if (!veiculo.origem_veiculo_coords || !rota.destino_obra_coords) {
                console.warn(`⚠️ Veículo ${veiculo.veiculo_label} ou rota não possui coordenadas de início/fim da API`);
                continue;
            }
            
            // Adiciona ponto de origem real da API
            const pontoOrigem: PontoRota = {
                nome: `Origem - ${veiculo.veiculo_label}`,
                tipo: "origem" as const,
                detalhes: `Ponto de partida do veículo ${veiculo.veiculo_label}`,
                horario: "",
                lat: veiculo.origem_veiculo_coords.latitude,
                lng: veiculo.origem_veiculo_coords.longitude,
                detour: `${veiculo.origem_veiculo_coords.latitude},${veiculo.origem_veiculo_coords.longitude}`
            };
            console.log(`📍 Origem da API:`, pontoOrigem);

            // Adiciona ponto de destino real da API
            const pontoDestino: PontoRota = {
                nome: `Destino - ${rota.descricao_transporte}`,
                tipo: "destino" as const,
                detalhes: `Ponto de chegada final da operação`,
                horario: "",
                lat: rota.destino_obra_coords.latitude,
                lng: rota.destino_obra_coords.longitude,
                detour: `${rota.destino_obra_coords.latitude},${rota.destino_obra_coords.longitude}`
            };
            console.log(`🎯 Destino da API:`, pontoDestino);

            for (const trecho of veiculo.trechos_detalhados) {
                if (trecho.polyline) {
                    console.log(`📍 Processando trecho ${trecho.tipo_trecho}:`, trecho);
                    
                    // Extrai APENAS as paradas que têm coordenadas válidas
                    const paradasComCoordenadas = trecho.ordem_paradas
                        .map((parada) => {
                            const coordenadas = extrairCoordenadas(parada.detour);
                            if (coordenadas) {
                                return {
                                    nome: parada.shipmentLabel,
                                    tipo: parada.isPickup ? "pickup" as const : "delivery" as const,
                                    detalhes: `${parada.isPickup ? "Coleta" : "Entrega"} - ${parada.loadDemands.funcionarios.amount || "0"} funcionário(s)`,
                                    horario: parada.startTime,
                                    lat: coordenadas.lat,
                                    lng: coordenadas.lng,
                                    detour: parada.detour
                                };
                            }
                            return null;
                        })
                        .filter(parada => parada !== null);

                    console.log(`✅ Paradas válidas encontradas: ${paradasComCoordenadas.length}`);
                    
                    todosTrechos.push({
                        polyline: trecho.polyline,
                        distancia: trecho.distancia_total_metros || 0,
                        tempo: trecho.duracao_total_segundos,
                        paradas: paradasComCoordenadas,
                        tipo_trecho: trecho.tipo_trecho,
                        veiculo_label: trecho.veiculo_label,
                        obra_destino: trecho.obra_destino,
                        // Inclui pontos de origem e destino reais da API
                        ponto_origem: pontoOrigem,
                        ponto_destino: pontoDestino
                    });
                    
                    distanciaTotal += (trecho.distancia_total_metros || 0);
                    tempoTotal += trecho.duracao_total_segundos;
                }
            }
        }

        console.log(`🚀 Total de trechos processados: ${todosTrechos.length}`);
        
        // Retorna TODOS os trechos processados para renderização múltipla
        if (todosTrechos.length > 0) {
            return {
                trechos: todosTrechos, // Array com todos os trechos
                distancia: distanciaTotal,
                tempo: tempoTotal
            };
        }

        // Fallback se não há dados válidos
        return {
            polyline: "",
            pontos: []
        };
    }, [extrairCoordenadas]);

    const dadosRota = useMemo(() => rota ? extrairDadosRota(rota) : undefined, [rota, extrairDadosRota]);

    // Obter tempo total da rota (memoizada)
    const obterTempoTotal = useCallback((rota: Rota) => {
        const tempoTotal = rota.resumo_por_veiculo.reduce((total, veiculo) => total + veiculo.duracao_total_segundos, 0);
        return formatarTempo(tempoTotal);
    }, [formatarTempo]);

    // Limpa o estado quando o modal fecha
    useEffect(() => {
        if (!isOpen) {
            setRotaCalculada(null);
            setIsFullscreen(false);
        }
    }, [isOpen]);

    // Early return DEPOIS de todos os hooks
    if (!isOpen) return null;

    // Renderização do modal fullscreen
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 bg-black z-[9999]">
                <div className="absolute top-4 right-4 z-[10000] flex gap-2">
                    <button
                        onClick={toggleFullscreen}
                        className="bg-white hover:bg-gray-100 text-gray-800 px-3 py-2 rounded-lg shadow-lg transition-colors"
                        title="Sair do Fullscreen"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={handleFullscreenClose}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg transition-colors"
                        title="Fechar"
                    >
                        ×
                    </button>
                </div>
                <div className="w-full h-full">
                    <MapaRotaReal 
                        rota={dadosRota}
                        onRotaCalculada={handleRotaCalculada}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#000000AA] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[90vw] h-[90vh] max-w-6xl max-h-[800px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-lg font-bold">
                        {rota ? `Rota: ${rota.descricao_transporte}` : 'Visualizar Rota Otimizada'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleFullscreen}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
                            title="Modo Fullscreen"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 01-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl font-bold p-1 rounded transition-colors"
                            title="Fechar"
                        >
                            ×
                        </button>
                    </div>
                </div>
                
                {/* Informações da rota */}
                {rota && (
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">Descrição:</span>
                                <p className="truncate">{rota.descricao_transporte}</p>
                            </div>
                            <div>
                                <span className="font-semibold">Veículos:</span>
                                <p className="truncate">{rota.resumo_por_veiculo.map(v => v.veiculo_label).join(', ')}</p>
                            </div>
                            <div>
                                <span className="font-semibold">Distância Total:</span>
                                <p>{rotaCalculada?.distancia || rota.distancia_total_operacao_km.toFixed(2) + 'km'}</p>
                            </div>
                            <div>
                                <span className="font-semibold">Tempo Total:</span>
                                <p>{rotaCalculada?.tempo || obterTempoTotal(rota)}</p>
                            </div>
                        </div>
                        
                        {/* Detalhes dos trechos - Compacto */}
                        <div className="mt-3">
                            <span className="font-semibold text-sm">Detalhes dos Trechos:</span>
                            <div className="mt-2 max-h-24 overflow-y-auto">
                                {rota.resumo_por_veiculo.map((veiculo, vIndex) => (
                                    <div key={vIndex} className="mb-2 p-2 bg-white rounded border text-xs">
                                        <div className="font-medium text-blue-600 mb-1">
                                            {veiculo.veiculo_label} - {veiculo.distancia_total_km.toFixed(2)}km
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {veiculo.trechos_detalhados.map((trecho, tIndex) => (
                                                <span key={tIndex} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                    {trecho.tipo_trecho}: {trecho.ordem_paradas.length} paradas
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mapa - Área flexível */}
                <div className="flex-1 min-h-0 p-4">
                    <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
                        <MapaRotaReal 
                            rota={dadosRota}
                            onRotaCalculada={handleRotaCalculada}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalMapaRotas;
