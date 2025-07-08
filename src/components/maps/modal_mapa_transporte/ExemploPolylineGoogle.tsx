"use client";
import React, { useState, useEffect } from "react";
import * as polyline from "polyline";

const ExemploPolylineGoogle: React.FC = () => {
    const [exemploPolyline] = useState("u{~vFvyys@fS]"); // Exemplo simples do Google
    const [pontosDecodificados, setPontosDecodificados] = useState<[number, number][]>([]);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        try {
            const decoded = polyline.decode(exemploPolyline) as [number, number][];
            setPontosDecodificados(decoded);
            setErro(null);
        } catch (error) {
            setErro(`Erro ao decodificar: ${error}`);
        }
    }, [exemploPolyline]);

    const testarPolylinePersonalizado = (customPolyline: string) => {
        try {
            const decoded = polyline.decode(customPolyline) as [number, number][];
            setPontosDecodificados(decoded);
            setErro(null);
        } catch (error) {
            setErro(`Erro ao decodificar polyline personalizado: ${error}`);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Teste da Biblioteca Polyline do Google</h1>
            
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Exemplo Automático</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p><strong>Polyline Original:</strong> <code>{exemploPolyline}</code></p>
                    
                    {erro && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {erro}
                        </div>
                    )}
                    
                    {pontosDecodificados.length > 0 && (
                        <div className="mt-3">
                            <p><strong>Pontos Decodificados:</strong></p>
                            <div className="bg-white p-3 rounded border mt-2">
                                <p className="text-sm text-gray-600 mb-2">
                                    {pontosDecodificados.length} pontos encontrados
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {pontosDecodificados.map((ponto, index) => (
                                        <div key={index} className="p-2 bg-gray-50 rounded">
                                            <strong>Ponto {index + 1}:</strong><br />
                                            Lat: {ponto[0].toFixed(6)}<br />
                                            Lng: {ponto[1].toFixed(6)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Teste com Polyline Personalizado</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="mb-3 text-sm text-gray-600">
                        Cole um polyline do Google Maps para testar:
                    </p>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Cole aqui o polyline do Google..."
                            className="flex-1 p-2 border border-gray-300 rounded"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    testarPolylinePersonalizado(e.currentTarget.value);
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                const input = document.querySelector('input') as HTMLInputElement;
                                if (input?.value) {
                                    testarPolylinePersonalizado(input.value);
                                }
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Testar
                        </button>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                        <p><strong>Exemplos de polylines válidos:</strong></p>
                        <ul className="list-disc ml-5 mt-1">
                            <li><code>u{`{~vFvyys@fS]`}</code> - Exemplo simples</li>
                            <li><code>_p~iF~ps|U_ulLnnqC_mqNvxq`@</code> - Exemplo mais complexo</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Como Funciona</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <ol className="list-decimal ml-5 space-y-2 text-sm">
                        <li>A API retorna um polyline codificado do Google Maps</li>
                        <li>A biblioteca <code>polyline</code> decodifica a string</li>
                        <li>O resultado é um array de coordenadas [lat, lng]</li>
                        <li>O componente MapaRotaReal usa essas coordenadas para desenhar a rota</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ExemploPolylineGoogle;
