"use client";

import React, { useState } from 'react';
import Menu from '@/components/menu';
import TransporteTable from '@/components/tables/transporte';
import PrimaryButton from '@/components/buttons/primary_button';
import ModalCadastrarTransporte from '@/components/modals/cadastrar_transporte';
import ModalMapaTransporte from '@/components/maps/modal_mapa_transporte';

const TransportePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'emAndamento' | 'concluidos' | 'emEspera'>('emAndamento');
    const [isCadastroModalOpen, setCadastroModalOpen] = useState(false);
    const [isMapaModalOpen, setMapaModalOpen] = useState(false);

    const handleTabChange = (tab: 'emAndamento' | 'concluidos' | 'emEspera') => {
        setActiveTab(tab);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Menu />
            <div className="w-[80vw] flex flex-col items-center mx-auto">
                <div className="flex justify-between mt-8 px-4 w-[80vw]">
                    <div className="flex space-x-4">
                        <button
                            className={`px-4 py-2 rounded ${activeTab === 'emAndamento' ? 'bg-[#ff6530] text-white' : 'bg-gray-200'}`}
                            onClick={() => handleTabChange('emAndamento')}
                        >
                            Em Andamento
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${activeTab === 'concluidos' ? 'bg-[#ff6530] text-white' : 'bg-gray-200'}`}
                            onClick={() => handleTabChange('concluidos')}
                        >
                            Concluídos
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${activeTab === 'emEspera' ? 'bg-[#ff6530] text-white' : 'bg-gray-200'}`}
                            onClick={() => handleTabChange('emEspera')}
                        >
                            Em Espera
                        </button>
                    </div>
                    <PrimaryButton onClick={() => setCadastroModalOpen(true)}>
                        Criar Requisição de Transporte
                    </PrimaryButton>
                </div>

                {activeTab === 'emAndamento' && <TransporteTable status="emAndamento" />}
                {activeTab === 'concluidos' && <TransporteTable status="concluidos" />}
                {activeTab === 'emEspera' && <TransporteTable status="emEspera" />}

            </div>
            <ModalCadastrarTransporte
                isOpen={isCadastroModalOpen}
                onClose={() => setCadastroModalOpen(false)}
                onSuccess={() => {
                    setCadastroModalOpen(false);
                    setMapaModalOpen(true);
                }}
            />

            <ModalMapaTransporte
                isOpen={isMapaModalOpen}
                onClose={() => setMapaModalOpen(false)}
            />
        </div>
    );
};

export default TransportePage;
