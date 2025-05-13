"use client";
import PrimaryButton from "@/components/buttons/primary_button";
import Menu from "@/components/menu";
import { useState } from "react";
import { TabelaVeiculos } from "@/components/tables/veiculos";
import ModalCadastrarVeiculos from "@/components/modals/cadastrar_veiculos";

export default function ObrasPage() {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <Menu />
            <div className="w-[100%] h-[100%] p-[32px] border-box flex flex-row gap-[32px] justify-start items-start">
                <div className="w-[300px] flex justify-center items-center">
                    {showModal && (
                        <ModalCadastrarVeiculos isOpen={true} onClose={() => setShowModal(false)} />
                    )}

                    <PrimaryButton onClick={() => setShowModal(true)}>
                        <img src="icons/plus_icon.svg" alt="Plus Icon"/>
                        Cadastrar novos veículos
                    </PrimaryButton>
                </div>
                <div className="w-full">
                    <TabelaVeiculos />
                </div>
            </div>
        </div>
    );
}