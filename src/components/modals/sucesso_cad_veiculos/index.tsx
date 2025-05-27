import React from "react";
import Link from "next/link";
import PrimaryButton from "@/components/buttons/primary_button";
import SuccessButton from "@/components/buttons/success_button";

interface ModalSucessoCadVeiculosProps {
    isOpen: boolean;
    onClose?: () => void;
}

const ModalSucessoCadAlojamento: React.FC<ModalSucessoCadVeiculosProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#000000AA]">
            <div className="bg-blue-primary rounded-2xl p-10 flex flex-col items-center w-[400px] max-w-[90vw] shadow-2xl relative">
                {/* Ícone de sucesso (banco de dados com check) */}
                <div className="mb-6">
                    <img src="icons/database_icon.svg" alt="Data Icon" className=" w-[7rem] h-[7rem]" />

                </div>
                <div className="text-white text-2xl text-center mb-8 font-normal">
                    O cadastro do veiculo foi<br />feito com sucesso
                </div>
                <SuccessButton className="mt-2 mx-auto relative"
                onClick={onClose}
                >
                    <img src="icons/truck_icon.svg" alt="Tool Icon" className="w-[1rem] absolute right-3 top-1/2 -translate-y-1/2" />
                    Ir para Veiculos
                </SuccessButton>
                {onClose && (
                    <button onClick={onClose} className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-gray-300">×</button>
                )}
            </div>
        </div>
    );
};

export default ModalSucessoCadAlojamento;
