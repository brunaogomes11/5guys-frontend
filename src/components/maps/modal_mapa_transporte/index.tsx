import React from "react";
import MapLeaflet from "@/components/maps/modal_selecao_end/MapLeaflet";

interface ModalMapaTransporteProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalMapaTransporte: React.FC<ModalMapaTransporteProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[80vw] h-[80vh]">
                <h2 className="text-lg font-bold mb-4">Mapa de Transporte</h2>
                <MapLeaflet onSelect={() => {}} />
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
