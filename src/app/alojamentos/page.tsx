"use client";
import PrimaryButton from "@/components/buttons/primary_button";
import Menu from "@/components/menu";
import { useState } from "react";
import ModalCadastrarAlojamento from "@/components/modals/cadastrar_alojamentos";
import { TabelaAlojamentos } from "@/components/tables/alojamentos";

export default function AlojamentosPage() {
    const [showModal, setShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1); // Incrementa para trigger refresh
    };

    return (
        <div>
            <Menu />
            <div className="w-[100%] h-[100%] p-[32px] border-box flex flex-row gap-[32px] justify-start items-start">
                <div className="w-[300px] flex justify-center items-center">
                    {showModal && (
                        <ModalCadastrarAlojamento 
                            isOpen={true} 
                            onClose={() => setShowModal(false)}
                            onSuccess={handleSuccess}
                        />
                    )}

                    <PrimaryButton onClick={() => setShowModal(true)}>
                        <img src="icons/plus_icon.svg" alt="Plus Icon"/>
                        Cadastrar novos alojamentos
                    </PrimaryButton>
                </div>
                <div className="w-full">
                    <TabelaAlojamentos refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
    );
}