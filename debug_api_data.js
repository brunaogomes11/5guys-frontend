// Script para debug dos dados da API
// Execute este arquivo para ver a estrutura completa dos dados

// Exemplo de estrutura que deveria estar vindo da API
const exemploRotaAPI = {
    "id_rota": 123,
    "descricao_transporte": "Transporte Funcionários - Obra XYZ",
    "distancia_total_operacao_km": 45.7,
    "resumo_por_veiculo": [
        {
            "veiculo_label": "Ônibus 001",
            "duracao_total_segundos": 3600,
            "distancia_total_km": 45.7,
            "trechos_detalhados": [
                {
                    "id": 1,
                    "descricao_transporte": "IDA - Buscar funcionários",
                    "tipo_trecho": "IDA",
                    "veiculo_label": "Ônibus 001",
                    "obra_destino": 1,
                    "polyline": "exemplo_polyline_ida",
                    "ordem_paradas": [
                        {
                            "detour": "0,0",
                            "isPickup": true,
                            "startTime": "06:00:00",
                            "shipmentLabel": "Casa João Silva",
                            "loadDemands": {
                                "funcionarios": {
                                    "amount": "1"
                                }
                            }
                        },
                        {
                            "detour": "0,0",
                            "isPickup": true,
                            "startTime": "06:15:00",
                            "shipmentLabel": "Casa Maria Santos",
                            "loadDemands": {
                                "funcionarios": {
                                    "amount": "1"
                                }
                            }
                        }
                    ],
                    "distancia_total_metros": 25000,
                    "duracao_total_segundos": 1800
                },
                {
                    "id": 2,
                    "descricao_transporte": "VOLTA - Levar funcionários",
                    "tipo_trecho": "VOLTA",
                    "veiculo_label": "Ônibus 001",
                    "obra_destino": 1,
                    "polyline": "exemplo_polyline_volta",
                    "ordem_paradas": [
                        {
                            "detour": "0,0",
                            "isPickup": false,
                            "startTime": "17:00:00",
                            "shipmentLabel": "Casa João Silva",
                            "loadDemands": {
                                "funcionarios": {
                                    "amount": "1"
                                }
                            }
                        },
                        {
                            "detour": "0,0",
                            "isPickup": false,
                            "startTime": "17:15:00",
                            "shipmentLabel": "Casa Maria Santos",
                            "loadDemands": {
                                "funcionarios": {
                                    "amount": "1"
                                }
                            }
                        }
                    ],
                    "distancia_total_metros": 20700,
                    "duracao_total_segundos": 1800
                }
            ]
        }
    ]
};

// Problemas identificados:
console.log("PROBLEMAS IDENTIFICADOS NO PROCESSAMENTO:");
console.log("1. Coordenadas lat/lng não estão sendo extraídas corretamente");
console.log("2. Paradas sendo posicionadas usando proporção no polyline, não coordenadas reais");
console.log("3. Origem e destino sendo inferidos dos pontos do polyline, não da API");
console.log("4. Campo 'detour' pode conter coordenadas mas não está sendo usado");
console.log("5. Marcadores 'fantasmas' podem estar sendo criados sem dados reais");

// Solução proposta:
console.log("\nSOLUÇÃO PROPOSTA:");
console.log("1. Verificar se 'detour' contém coordenadas reais");
console.log("2. Buscar campos de lat/lng nas paradas da API");
console.log("3. Não inferir origem/destino do polyline, usar dados específicos da API");
console.log("4. Validar se todas as paradas têm coordenadas antes de criar marcadores");
console.log("5. Logar dados reais da API para debug");

module.exports = { exemploRotaAPI };
