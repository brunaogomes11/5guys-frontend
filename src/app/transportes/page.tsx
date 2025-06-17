"use client";

import React, { useEffect, useState } from 'react';
import Menu from '@/components/menu';
import TransporteTable from '@/components/tables/transporte/transporte';
import PrimaryButton from '@/components/buttons/primary_button';
import ModalCadastrarTransporte from '@/components/modals/cadastrar_transporte';
import ModalMapaTransporte from '@/components/maps/modal_mapa_transporte';
import VisualizarTransporteModal from '@/components/modals/VisualizarTransporteModal'; // ✅ novo import

type Rota = {
  id: string;
  origem: string;
  destino: string;
  status: string;
  data: string;
};

const TransportePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emAndamento' | 'concluidos' | 'emEspera'>('emAndamento');
  const [isCadastroModalOpen, setCadastroModalOpen] = useState(false);
  const [isMapaModalOpen, setMapaModalOpen] = useState(false);
  const [rotaSelecionada, setRotaSelecionada] = useState<Rota | null>(null); // ✅ estado para visualizar
  const [rotas, setRotas] = useState<Rota[]>([]);

  useEffect(() => {
    const fetchRotas = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/rotas");
        const data = await res.json();
        setRotas(data);
      } catch (error) {
        console.error("Erro ao buscar rotas:", error);
      }
    };

    fetchRotas();
  }, []);

  const handleTabChange = (tab: 'emAndamento' | 'concluidos' | 'emEspera') => {
    setActiveTab(tab);
  };

  const rotasFiltradas = rotas.filter((rota) => rota.status === activeTab);

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

        {/* ✅ Passa função de visualização para o componente */}
        <TransporteTable
          status={activeTab}
          rotas={rotasFiltradas}
          onVisualizar={(rota) => setRotaSelecionada(rota)}
        />
      </div>

      {/* ✅ Modal de visualização */}
      <VisualizarTransporteModal
        rota={rotaSelecionada}
        onClose={() => setRotaSelecionada(null)}
      />

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
