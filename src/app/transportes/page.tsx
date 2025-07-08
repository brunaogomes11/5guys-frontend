"use client";

import React, { useState, useEffect } from 'react';
import Menu from '@/components/menu';
import RotasTable from '@/components/tables/rotas';
import PrimaryButton from '@/components/buttons/primary_button';
import ModalCadastrarRotas from '@/components/modals/cadastrar_rotas';
import ModalMapaRotas from '@/components/maps/modal_mapa_transporte';

interface ParadaRota {
    detour: string;
    isPickup?: boolean;
    startTime: string;
    loadDemands: {
        funcionarios: {
            amount?: string;
        };
    };
    shipmentLabel: string;
}

interface TrechoDetalhado {
    id: number;
    descricao_transporte: string;
    data_geracao: string;
    tipo_trecho: string;
    veiculo_label: string;
    ordem_paradas: ParadaRota[];
    distancia_total_metros: number | null;
    duracao_total_segundos: number;
    obra_destino: number;
    veiculo: number;
}

interface ResumoVeiculo {
    veiculo_label: string;
    duracao_total_segundos: number;
    trechos_detalhados: TrechoDetalhado[];
    distancia_total_km: number;
    origem_veiculo_coords: {
        latitude: number;
        longitude: number;
    };
}

interface Rota {
    id_rota?: number;
    descricao_transporte: string;
    distancia_total_operacao_km: number;
    resumo_por_veiculo: ResumoVeiculo[];
    destino_obra_coords: {
        latitude: number;
        longitude: number;
    };
}

const RotasPage: React.FC = () => {
    const [isCadastroModalOpen, setCadastroModalOpen] = useState(false);
    const [isMapaModalOpen, setMapaModalOpen] = useState(false);
    const [rotaSelecionada, setRotaSelecionada] = useState<Rota | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccessCadastro = () => {
        setCadastroModalOpen(false);
        setRefreshTrigger(prev => prev + 1); // Atualiza a tabela
        // Aqui poderia abrir o modal do mapa se necessário
        // setMapaModalOpen(true);
    };

    const handleVisualizarRota = (rota: Rota) => {
        setRotaSelecionada(rota);
        setMapaModalOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Menu />
            <div className="w-[80vw] flex flex-col items-center mx-auto">
                <div className="flex justify-between mt-8 px-4 w-[80vw]">
                    <PrimaryButton onClick={() => setCadastroModalOpen(true)}>
                        Criar Nova Rota
                    </PrimaryButton>
                </div>

                <div className="w-full">
                    <RotasTable 
                        refreshTrigger={refreshTrigger}
                        onVisualizarRota={handleVisualizarRota}
                    />
                </div>
            </div>

            <ModalCadastrarRotas
                isOpen={isCadastroModalOpen}
                onClose={() => setCadastroModalOpen(false)}
                onSuccess={handleSuccessCadastro}
            />

            <ModalMapaRotas
                isOpen={isMapaModalOpen}
                onClose={() => {
                    setMapaModalOpen(false);
                    setRotaSelecionada(null);
                }}
                rota={rotaSelecionada}
            />
        </div>
    );
};

export default RotasPage;
