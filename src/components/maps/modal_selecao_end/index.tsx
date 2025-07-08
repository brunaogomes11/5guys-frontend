'use cliente'

import React, { useState } from "react";
import dynamic from "next/dynamic";

interface ModalSelecaoEndProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number, cep: string, endereco: string, cidade: string, uf: string) => void;
}

const MapWithNoSSR = dynamic(() => import("./MapLeaflet"), { ssr: false });

const ModalSelecaoEnd: React.FC<ModalSelecaoEndProps> = ({ isOpen, onClose, onSelect }) => {
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buscarCepEndereco(lat: number, lng: number) {
    setLoading(true);
    setError("");
    try {
      // Busca o endereço reverso via Nominatim (OpenStreetMap) com mais detalhes
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`);
      const data = await res.json();
      
      // Extrai informações mais precisas do endereço
      const address = data.address || {};
      let cep = address.postcode || "";
      let logradouro = address.road || address.pedestrian || address.path || "";
      let numero = address.house_number || "";
      let cidade = address.city || address.town || address.village || address.municipality || "";
      let uf = address.state || "";

      // Se encontrou CEP, valida e busca detalhes via ViaCEP
      if (cep && cep.length === 8) {
        try {
          const viaCepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const viaCepData = await viaCepRes.json();
          
          if (!viaCepData.erro) {
            // Prioriza dados do ViaCEP para maior precisão
            logradouro = viaCepData.logradouro || logradouro;
            cidade = viaCepData.localidade || cidade;
            uf = viaCepData.uf || uf;
            cep = viaCepData.cep || cep;
          }
        } catch (viaCepError) {
          console.log('Erro no ViaCEP, usando dados do Nominatim');
        }
      }

      // Se não encontrou CEP válido, tenta buscar por proximidade
      if (!cep || cep.length !== 8) {
        try {
          // Busca CEPs próximos usando uma área um pouco maior
          const proximityRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&lat=${lat}&lon=${lng}&addressdetails=1&limit=5&zoom=16`);
          const proximityData = await proximityRes.json();
          
          for (const result of proximityData) {
            const proxCep = result.address?.postcode;
            if (proxCep && proxCep.length === 8) {
              cep = proxCep;
              break;
            }
          }
        } catch (proximityError) {
          console.log('Erro na busca por proximidade');
        }
      }

      // Monta endereço completo
      const enderecoCompleto = `${logradouro}${numero ? ', ' + numero : ''}`;
      
      onSelect(lat, lng, cep, enderecoCompleto, cidade, uf);
      onClose();
    } catch (e) {
      setError("Erro ao buscar endereço. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }


  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[50vw] min-h-[400px] relative flex flex-col">
        <h2 className="text-blue-primary mb-2 text-center">Selecione no mapa</h2>
        <p className="text-xs text-gray-600 mb-3 text-center">
          📍 Clique no mapa para selecionar um endereço.
          <br />
          💡 <strong>Dica:</strong> Para maior precisão, use o CEP no formulário principal!
        </p>
        <div className="flex-1 min-h-[300px] w-[100%] h-[300px] mb-4">
          <MapWithNoSSR onSelect={setSelected} />
        </div>
        {selected && (
          <div className="mb-2 text-sm text-center">
            Local selecionado: <b>{selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}</b>
          </div>
        )}
        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose} disabled={loading}>Cancelar</button>
          <button
            className="px-3 py-1 rounded bg-blue-primary text-white disabled:opacity-50"
            disabled={!selected || loading}
            onClick={() => selected && buscarCepEndereco(selected.lat, selected.lng)}
          >
            {loading ? "Buscando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSelecaoEnd;
