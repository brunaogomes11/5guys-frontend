"use client";
import PrimaryButton from "@/components/buttons/primary_button";
import Menu from "@/components/menu";
import { useState } from "react";
import ModalCadastrarAlojamento from "@/components/modals/cadastrar_alojamentos";
import { TabelaAlojamentos } from "@/components/tables/alojamentos";
import MapaAlojamentos from "@/components/maps/mapa_alojamentos/MapaAlojamentos";

export default function AlojamentosPage() {
    const [showModal, setShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setShowModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div>
            <Menu />
            <div className="w-[100%] h-[100%] p-[32px] border-box flex flex-col gap-[24px]">
                {/* Seção de cadastro */}
                <div className="flex justify-center">
                    {showModal && (
                        <ModalCadastrarAlojamento 
                            isOpen={true} 
                            onClose={() => setShowModal(false)}
                            onSuccess={handleSuccess}
                            isEdit={false}
                        />
                    )}

                    <PrimaryButton onClick={() => setShowModal(true)}>
                        <img src="icons/plus_icon.svg" alt="Plus Icon"/>
                        Cadastrar novos alojamentos
                    </PrimaryButton>
                </div>

                {/* Seção principal com tabela e mapa */}
                <div className="flex flex-col lg:flex-row gap-[24px] h-[calc(100vh-200px)]">
                    {/* Tabela de alojamentos */}
                    <div className="w-full lg:w-[50%] h-full overflow-auto">
                        <TabelaAlojamentos refreshTrigger={refreshTrigger} />
                    </div>

                    {/* Mapa de alojamentos */}
                    <div className="w-full lg:w-[50%] h-full">
                        <div className="h-[calc(100%-40px)] border border-gray-200 rounded-lg overflow-hidden">
                            <MapaAlojamentos refreshTrigger={refreshTrigger} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}