import React from "react";
import PrimaryButton from "@/components/buttons/primary_button";
import CancelButton from "@/components/buttons/cancel_button";

interface ModalConfirmacaoExclusaoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    titulo?: string;
    mensagem?: string;
    nomeItem?: string;
    isDeleting?: boolean;
}

const ModalConfirmacaoExclusao: React.FC<ModalConfirmacaoExclusaoProps> = ({
    isOpen,
    onClose,
    onConfirm,
    titulo = "Confirmar Exclusão",
    mensagem = "Tem certeza que deseja excluir",
    nomeItem = "este item",
    isDeleting = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[9999]">
            <div className="bg-blue-primary py-[3.25rem] px-[5.5rem] rounded-lg min-w-[350px] shadow-lg relative">
                <h2 className="text-[#FFFFFF] mb-4 text-center text-xl font-semibold">
                    {titulo}
                </h2>
                
                <div className="text-center mb-6">
                    <div className="text-red-400 text-4xl mb-3">⚠️</div>
                    <p className="text-[#FFFFFF] mb-2">
                        {mensagem}
                    </p>
                    <p className="text-yellow-300 font-semibold">
                        "{nomeItem}"?
                    </p>
                    <p className="text-red-300 text-sm mt-3">
                        Esta ação não pode ser desfeita.
                    </p>
                </div>

                <div className="flex flex-row gap-3 justify-center">
                    <PrimaryButton
                        onClick={isDeleting ? undefined : onConfirm}
                        className={`bg-red-600 hover:bg-red-700 min-w-[120px] ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isDeleting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">🔄</span>
                                Excluindo...
                            </span>
                        ) : (
                            "Sim, Excluir"
                        )}
                    </PrimaryButton>
                    <CancelButton 
                        onClick={isDeleting ? undefined : onClose}
                        className={`min-w-[120px] ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cancelar
                    </CancelButton>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacaoExclusao;
