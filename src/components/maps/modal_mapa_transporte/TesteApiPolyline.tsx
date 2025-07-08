"use client";
import React, { useState, useEffect } from "react";
import * as polyline from "polyline";

interface TesteApiPolylineProps {
    rotaId?: number;
}

const TesteApiPolyline: React.FC<TesteApiPolylineProps> = ({ rotaId }) => {
    const [dadosAPI, setDadosAPI] = useState<any>(null);
    const [polylineDecodificado, setPolylineDecodificado] = useState<[number, number][]>([]);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!rotaId) return;

        const testarAPI = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/rotas/rotas/${rotaId}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro na API: ${response.status}`);
                }

                const dados = await response.json();
                setDadosAPI(dados);

                // Buscar polyline nos dados
                let polylineEncontrado = null;
                
                // Verifica se há polyline geral
                if (dados.polyline) {
                    polylineEncontrado = dados.polyline;
                } else if (dados.resumo_por_veiculo) {
                    // Busca polyline nos trechos
                    for (const veiculo of dados.resumo_por_veiculo) {
                        for (const trecho of veiculo.trechos_detalhados) {
                            if (trecho.polyline) {
                                polylineEncontrado = trecho.polyline;
                                break;
                            }
                        }
                        if (polylineEncontrado) break;
                    }
                }

                if (polylineEncontrado) {
                    try {
                        const decoded = polyline.decode(polylineEncontrado) as [number, number][];
                        setPolylineDecodificado(decoded);
                    } catch (decodeError) {
                        setErro(`Erro ao decodificar polyline: ${decodeError}`);
                    }
                } else {
                    setErro("Nenhum polyline encontrado nos dados da API");
                }

            } catch (error) {
                setErro(`Erro ao buscar dados da API: ${error}`);
            }
        };

        testarAPI();
    }, [rotaId]);

    if (!rotaId) {
        return (
            <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-bold mb-2">Teste API Polyline</h3>
                <p className="text-gray-600">Selecione uma rota para testar a API</p>
            </div>
        );
    }

    return (
        <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-bold mb-2">Teste API Polyline - Rota {rotaId}</h3>
            
            {erro && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <strong>Erro:</strong> {erro}
                </div>
            )}

            {dadosAPI && (
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Dados da API:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(dadosAPI, null, 2)}
                    </pre>
                </div>
            )}

            {polylineDecodificado.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Polyline Decodificado:</h4>
                    <p className="text-sm text-gray-600 mb-2">
                        {polylineDecodificado.length} pontos encontrados
                    </p>
                    <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                        <div>Primeiro ponto: [{polylineDecodificado[0]?.[0]}, {polylineDecodificado[0]?.[1]}]</div>
                        <div>Último ponto: [{polylineDecodificado[polylineDecodificado.length - 1]?.[0]}, {polylineDecodificado[polylineDecodificado.length - 1]?.[1]}]</div>
                        <div className="mt-2">
                            <strong>Amostra de pontos:</strong>
                            <pre>{JSON.stringify(polylineDecodificado.slice(0, 5), null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TesteApiPolyline;
