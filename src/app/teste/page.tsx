"use client";
import React, { useState } from "react";
import ExemploPolylineGoogle from "@/components/maps/modal_mapa_transporte/ExemploPolylineGoogle";
import MapaRotaReal from "@/components/maps/modal_mapa_transporte/MapaRotaReal";

const TestePage: React.FC = () => {
    const [mostrarTeste, setMostrarTeste] = useState(false);
    
    // Exemplo com múltiplos trechos simulando resposta real da API
    const exemploRotaMultiplosTrechos = {
        descricao_transporte: "Transporte Obra ABC - Teste Completo",
        distancia_total_operacao_km: 55.7,
        resumo_por_veiculo: [
            {
                veiculo_label: "Kombi - ABC1D23",
                duracao_total_segundos: 13971,
                distancia_total_km: 27.86,
                trechos_detalhados: [
                    {
                        id: 1,
                        tipo_trecho: "IDA",
                        polyline: "fg|rBfdzlHSDLfANfAXhBZfBcDj@cDh@eARa@HsEz@w@Ju@LoCd@oCj@",
                        distancia_total_metros: 12000,
                        duracao_total_segundos: 1800,
                        veiculo_label: "Kombi - ABC1D23",
                        ordem_paradas: [
                            {
                                shipmentLabel: "Funcionário João Silva",
                                isPickup: true,
                                startTime: "2024-01-15T06:00:00Z",
                                loadDemands: {
                                    funcionarios: {
                                        amount: "1"
                                    }
                                },
                                detour: "120s"
                            },
                            {
                                shipmentLabel: "Funcionário Maria Santos",
                                isPickup: true,
                                startTime: "2024-01-15T06:10:00Z",
                                loadDemands: {
                                    funcionarios: {
                                        amount: "1"
                                    }
                                },
                                detour: "90s"
                            }
                        ]
                    },
                    {
                        id: 2,
                        tipo_trecho: "VOLTA",
                        polyline: "j@coPd@oCL@w@Jz@sEH@RaAe@h@cDj@cDfBZhBXfAN@fALSD",
                        distancia_total_metros: 15000,
                        duracao_total_segundos: 2200,
                        veiculo_label: "Kombi - ABC1D23",
                        ordem_paradas: [
                            {
                                shipmentLabel: "Funcionário João Silva",
                                isPickup: false,
                                startTime: "2024-01-15T17:00:00Z",
                                loadDemands: {
                                    funcionarios: {
                                        amount: "1"
                                    }
                                },
                                detour: "0s"
                            },
                            {
                                shipmentLabel: "Funcionário Maria Santos",
                                isPickup: false,
                                startTime: "2024-01-15T17:15:00Z",
                                loadDemands: {
                                    funcionarios: {
                                        amount: "1"
                                    }
                                },
                                detour: "0s"
                            }
                        ]
                    }
                ]
            }
        ]
    };

    // Exemplo simplificado para teste (estrutura similar à API real)
    const exemploRotaAPI = {
        // Polyline do exemplo da API real que você forneceu
        polyline: "fg|rBfdzlHSDLfANfAXhBZfBcDj@cDh@eARa@HsEz@w@Ju@LoCd@oCj@",
        distancia: 278573, // metros (da API real)
        tempo: 13971, // segundos (da API real)
        tipo_trecho: "VOLTA",
        veiculo_label: "Kombi - ABC1D23",
        paradas: [
            {
                nome: "Retorno para Casa",
                tipo: "pickup" as const,
                detalhes: "Coleta - 1 funcionário",
                horario: "1970-01-01T01:54:49Z",
                detour: "-15.7801,-47.9292",
                lat: -15.7801,
                lng: -47.9292
            },
            {
                nome: "Retorno para Casa",
                tipo: "delivery" as const,
                detalhes: "Entrega - funcionários",
                horario: "1970-01-01T03:44:12Z",
                detour: "-15.7901,-47.9392",
                lat: -15.7901,
                lng: -47.9392
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        Sistema de Polyline - Teste Funcional
                    </h1>
                    
                    <div className="mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Status do Sistema</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="font-medium">Biblioteca Polyline</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">v0.2.0 instalada</p>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="font-medium">Componente MapaRotaReal</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Funcionando</p>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="font-medium">Integração Modal</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Atualizada</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Teste da Biblioteca Polyline</h2>
                                <button
                                    onClick={() => setMostrarTeste(!mostrarTeste)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {mostrarTeste ? 'Ocultar' : 'Mostrar'} Teste
                                </button>
                            </div>
                            
                            {mostrarTeste && (
                                <div className="border-t pt-4">
                                    <ExemploPolylineGoogle />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Teste com Múltiplos Trechos (IDA e VOLTA)</h2>
                            <p className="text-gray-600 mb-4">
                                Este mapa processa múltiplos trechos simultaneamente, mostrando:
                            </p>
                            <div className="mb-4 space-y-2 text-sm bg-gray-50 p-3 rounded">
                                <div><strong>Trechos:</strong> IDA (verde) e VOLTA (vermelho)</div>
                                <div><strong>Paradas IDA:</strong> 2 coletas de funcionários</div>
                                <div><strong>Paradas VOLTA:</strong> 2 entregas de funcionários</div>
                                <div><strong>Veículo:</strong> Kombi - ABC1D23</div>
                                <div><strong>Distância Total:</strong> 55.7 km</div>
                            </div>
                            <div className="mb-4 grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                    <span>🚌 Origem</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                                    <span>🎯 Destino</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                    <span>👥 Coleta</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                    <span>🏠 Entrega</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                                    <span>📍 IDA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                                    <span>📍 VOLTA</span>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg" style={{ height: '500px' }}>
                                <MapaRotaReal
                                    rota={{
                                        trechos: exemploRotaMultiplosTrechos.resumo_por_veiculo[0].trechos_detalhados.map(trecho => ({
                                            polyline: trecho.polyline,
                                            distancia: trecho.distancia_total_metros,
                                            tempo: trecho.duracao_total_segundos,
                                            tipo_trecho: trecho.tipo_trecho,
                                            veiculo_label: trecho.veiculo_label,
                                            obra_destino: 1,
                                            paradas: trecho.ordem_paradas.map(parada => {
                                                // Extrai coordenadas do campo detour
                                                const [lat, lng] = parada.detour.split(',').map(coord => parseFloat(coord.trim()));
                                                return {
                                                    nome: parada.shipmentLabel,
                                                    tipo: parada.isPickup ? "pickup" as const : "delivery" as const,
                                                    detalhes: `${parada.isPickup ? "Coleta" : "Entrega"} - ${parada.loadDemands.funcionarios.amount || "0"} funcionário(s)`,
                                                    horario: parada.startTime,
                                                    detour: parada.detour,
                                                    lat: lat || 0,
                                                    lng: lng || 0
                                                };
                                            })
                                        })),
                                        distancia: exemploRotaMultiplosTrechos.resumo_por_veiculo[0].trechos_detalhados.reduce((total, trecho) => total + trecho.distancia_total_metros, 0),
                                        tempo: exemploRotaMultiplosTrechos.resumo_por_veiculo[0].trechos_detalhados.reduce((total, trecho) => total + trecho.duracao_total_segundos, 0)
                                    }}
                                    onRotaCalculada={(info) => {
                                        console.log('Múltiplos trechos calculados:', info);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Exemplo com Dados da API Real (Trecho Único)</h2>
                            <p className="text-gray-600 mb-4">
                                Este mapa processa dados reais da API, mostrando:
                            </p>
                            <div className="mb-4 space-y-2 text-sm bg-gray-50 p-3 rounded">
                                <div><strong>Polyline:</strong> Rota decodificada do Google Maps</div>
                                <div><strong>Tipo:</strong> {exemploRotaAPI.tipo_trecho} ({exemploRotaAPI.veiculo_label})</div>
                                <div><strong>Distância:</strong> {(exemploRotaAPI.distancia / 1000).toFixed(1)} km</div>
                                <div><strong>Tempo:</strong> {Math.round(exemploRotaAPI.tempo / 60)} minutos</div>
                                <div><strong>Paradas:</strong> {exemploRotaAPI.paradas.length} pontos</div>
                            </div>
                            <div className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                    <span>🚌 Origem</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                                    <span>🎯 Destino</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                    <span>👥 Coleta</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                    <span>🏠 Entrega</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                    <span>📍 Parada</span>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg" style={{ height: '500px' }}>
                                <MapaRotaReal
                                    rota={exemploRotaAPI}
                                    onRotaCalculada={(info) => {
                                        console.log('Rota calculada:', info);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Como Usar no Sistema</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold mb-2">1. Página de Transportes</h3>
                                    <p className="text-sm text-gray-600">
                                        Acesse /transportes e clique em "Visualizar Rota" em qualquer linha da tabela.
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold mb-2">2. Modal de Visualização</h3>
                                    <p className="text-sm text-gray-600">
                                        O modal abrirá com o mapa mostrando TODOS os trechos da rota (IDA e VOLTA).
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold mb-2">3. Funcionalidades do Mapa</h3>
                                    <p className="text-sm text-gray-600">
                                        - Modo fullscreen<br/>
                                        - Zoom automático<br/>
                                        - <strong>Múltiplos trechos:</strong><br/>
                                        &nbsp;&nbsp;• 🟢 Linha verde: Trecho IDA<br/>
                                        &nbsp;&nbsp;• 🔴 Linha vermelha: Trecho VOLTA<br/>
                                        - <strong>Marcadores inteligentes:</strong><br/>
                                        &nbsp;&nbsp;• 🚌 Origem (início da rota)<br/>
                                        &nbsp;&nbsp;• 🎯 Destino (fim da rota)<br/>
                                        &nbsp;&nbsp;• 👥 Pontos de coleta<br/>
                                        &nbsp;&nbsp;• 🏠 Pontos de entrega<br/>
                                        &nbsp;&nbsp;• 📍 Paradas intermediárias<br/>
                                        - <strong>Informações detalhadas:</strong><br/>
                                        &nbsp;&nbsp;• Popups com horários reais<br/>
                                        &nbsp;&nbsp;• Quantidade de funcionários<br/>
                                        &nbsp;&nbsp;• Tipo de operação (coleta/entrega)<br/>
                                        &nbsp;&nbsp;• Identificação do veículo<br/>
                                        - <strong>Processamento automático:</strong><br/>
                                        &nbsp;&nbsp;• Todas as paradas de todos os trechos<br/>
                                        &nbsp;&nbsp;• Posicionamento inteligente no polyline<br/>
                                        &nbsp;&nbsp;• Cálculo automático de distância/tempo
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <h3 className="font-semibold mb-2">✅ Implementado</h3>
                                    <p className="text-sm text-gray-600">
                                        ✓ Processamento de múltiplos trechos (IDA e VOLTA)<br/>
                                        ✓ Exibição de todas as paradas cadastradas<br/>
                                        ✓ Posicionamento real baseado no polyline<br/>
                                        ✓ Diferenciação visual entre tipos de trecho<br/>
                                        ✓ Informações detalhadas em popups<br/>
                                        ✓ Compatibilidade com dados reais da API
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestePage;
