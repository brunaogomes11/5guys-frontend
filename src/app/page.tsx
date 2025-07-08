"use client";

import Menu from "@/components/menu";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/loading";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-full min-h-screen bg-gray-50">
      <Menu />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Sistema de Gestão 5Guys
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Plataforma completa para gerenciamento de obras, funcionários, veículos e transportes
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-black">✨ Gestão Integrada</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-black">🗺️ Mapas Interativos</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-black">🚛 Otimização de Rotas</span>
          </div>
        </div>
      </div>

      {/* Funcionalidades Principais */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Funcionalidades do Sistema
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Obras */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="icons/house_icon.svg" alt="Obras" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Gestão de Obras</h3>
            </div>
            <ul className="text-gray-600 space-y-2">
              <li>• Cadastro com busca automática por CEP</li>
              <li>• Seleção de localização no mapa</li>
              <li>• Coordenadas geográficas automáticas</li>
              <li>• Visualização em mapa interativo</li>
              <li>• Controle completo de endereços</li>
            </ul>
          </div>

          {/* Funcionários */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="icons/users_icon.svg" alt="Funcionários" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Funcionários</h3>
            </div>
            <ul className="text-gray-600 space-y-2">
              <li>• Cadastro completo de pessoal</li>
              <li>• Controle de informações pessoais</li>
              <li>• Gestão de documentos</li>
              <li>• Histórico profissional</li>
              <li>• Relatórios de equipe</li>
            </ul>
          </div>

          {/* Veículos */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="icons/truck_icon.svg" alt="Veículos" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Frota de Veículos</h3>
            </div>
            <ul className="text-gray-600 space-y-2">
              <li>• Cadastro com localização automática</li>
              <li>• Vinculação obrigatória com obras</li>
              <li>• Busca de endereço por CEP</li>
              <li>• Coordenadas geográficas</li>
              <li>• Controle da frota</li>
            </ul>
          </div>

          {/* Transportes */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="icons/map_icon.svg" alt="Transportes" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Gestão de Rotas</h3>
            </div>
            <ul className="text-gray-600 space-y-2">
              <li>• Criação de rotas otimizadas</li>
              <li>• Visualização em mapa interativo</li>
              <li>• Modo fullscreen para análise</li>
              <li>• Cálculo de distâncias e tempos</li>
              <li>• Gestão completa de transportes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recursos Especiais */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Recursos Especiais
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mapas Interativos */}
            <div className="bg-white rounded-lg p-8 text-center shadow-lg">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Mapas Interativos</h3>
              <p className="text-gray-600">
                Visualização de obras, veículos e rotas em mapas interativos com tecnologia Leaflet. 
                Suporte a modo fullscreen para análise detalhada.
              </p>
            </div>

            {/* Busca Automática */}
            <div className="bg-white rounded-lg p-8 text-center shadow-lg">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Busca Automática por CEP</h3>
              <p className="text-gray-600">
                Integração com ViaCEP e Nominatim para busca automática de endereços, 
                com geocodificação e seleção de localização no mapa.
              </p>
            </div>

            {/* Gestão Integrada */}
            <div className="bg-white rounded-lg p-8 text-center shadow-lg">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Gestão Integrada</h3>
              <p className="text-gray-600">
                Sistema completo com vinculação entre obras, funcionários, veículos e rotas. 
                Interface responsiva e moderna com validações em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Como Usar */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Como Usar o Sistema
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cadastros */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-600">1. Cadastros Básicos</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Cadastre obras usando busca automática por CEP</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Adicione funcionários ao sistema</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Cadastre veículos vinculando a obras específicas</span>
                </div>
              </div>
            </div>

            {/* Gestão Avançada */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-green-600">2. Gestão Avançada</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Visualize obras no mapa interativo</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Crie e gerencie rotas de transporte</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Use o modo fullscreen para análise detalhada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-4">Sistema de Gestão 5Guys</p>
          <p className="text-gray-400">
            Plataforma completa para gestão de obras, funcionários, veículos e transportes com mapas interativos
          </p>
        </div>
      </div>
    </div>
  );
}
