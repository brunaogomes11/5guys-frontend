import React from "react";
import MapaRotaOtimizada from "@/components/maps/modal_mapa_transporte/MapaRotaOtimizada";

interface ModalMapaTransporteProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalMapaTransporte: React.FC<ModalMapaTransporteProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[80vw] h-[80vh]">
        <h2 className="text-lg font-bold mb-4">Rota Otimizada</h2>
        <div className="w-full h-full">
          <MapaRotaOtimizada />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMapaTransporte;
