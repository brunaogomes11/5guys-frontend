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
      // Busca o endereço reverso via Nominatim (OpenStreetMap)
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const cep = data.address?.postcode;
      let logradouro = data.address?.road || "";
      let cidade = data.address?.city || data.address?.town || data.address?.village || "";
      let uf = data.address?.state || "";

      // Busca detalhes do CEP via ViaCEP
      let viaCepData = null;
      if (cep) {
        const viaCepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        viaCepData = await viaCepRes.json();
        // Se ViaCEP retornar dados, sobrescreve logradouro, cidade e uf se disponíveis
        if (!viaCepData.erro) {
          if (viaCepData.logradouro) logradouro = viaCepData.logradouro;
          if (viaCepData.localidade) cidade = viaCepData.localidade;
          if (viaCepData.uf) uf = viaCepData.uf;
        }
      }
      onSelect(lat, lng, cep, logradouro, cidade, uf);
      onClose();
    } catch (e) {
      setError("Erro ao buscar endereço. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }


  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[1100]">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] min-h-[400px] relative flex flex-col">
        <h2 className="text-blue-primary mb-2 text-center">Selecione no mapa</h2>
        <div className="flex-1 min-h-[300px] w-[400px] h-[300px] mb-4">
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
