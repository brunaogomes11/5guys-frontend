// Teste básico da biblioteca polyline
import * as polyline from 'polyline';

// Exemplo de polyline do Google Maps (codificado)
const exemploPolyline = "u{~vFvyys@fS]";

// Teste de decodificação
try {
    const pontosDecodificados = polyline.decode(exemploPolyline);
    console.log("Pontos decodificados:", pontosDecodificados);
    
    // Teste de codificação
    const polylineCodificado = polyline.encode(pontosDecodificados);
    console.log("Polyline recodificado:", polylineCodificado);
    
    // Verifica se são iguais
    console.log("Codificações são iguais:", polylineCodificado === exemploPolyline);
} catch (error) {
    console.error("Erro no teste:", error);
}

export { exemploPolyline };
