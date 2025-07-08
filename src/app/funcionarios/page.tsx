"use client";
import PrimaryButton from "@/components/buttons/primary_button";
import Menu from "@/components/menu";
import { useState } from "react";
import ModalCadastrarFuncionarios from "@/components/modals/cadastrar_funcionarios";
import { TabelaFuncionarios } from "@/components/tables/funcionarios";

export default function FuncionariosPage() {
    const [showModal, setShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div>
            <Menu />
            <div className="w-[100%] h-[100%] p-[32px] border-box flex flex-row gap-[32px] justify-start items-start">
                <div className="w-[300px] flex justify-center items-center">
                    {showModal && (
                        <ModalCadastrarFuncionarios 
                            isOpen={true} 
                            onClose={() => setShowModal(false)}
                            onSuccess={handleSuccess}
                        />
                    )}

                    <PrimaryButton onClick={() => setShowModal(true)}>
                        <img src="icons/plus_icon.svg" alt="Plus Icon"/>
                        Cadastrar novos Funcionarios
                    </PrimaryButton>
                </div>
                <div className="w-full">
                    <TabelaFuncionarios refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
    );
}