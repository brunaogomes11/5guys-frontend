import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import DeleteButton from "@/components/buttons/delete_button";
import ModalConfirmacaoExclusao from "@/components/modals/confirmacao_exclusao";

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
    origem_veiculo_coords: { // Renomeado
        latitude: number;
        longitude: number;
    };
}

interface Rota {
    id_rota?: number;
    descricao_transporte: string;
    distancia_total_operacao_km: number;
    resumo_por_veiculo: ResumoVeiculo[];
    destino_obra_coords: { // Adicionado
        latitude: number;
        longitude: number;
    };
}

interface RotasTableProps {
    refreshTrigger?: number;
    onVisualizarRota?: (rota: Rota) => void;
}

const RotasTable: React.FC<RotasTableProps> = ({ refreshTrigger, onVisualizarRota }) => {
    const [filter, setFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Rota | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [data, setData] = useState<Rota[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Função para buscar rotas da API
    useEffect(() => {
        const fetchRotas = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/rotas/rotas/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (res.ok) {
                    const rotasData = await res.json();
                    
                    // Verifica se os dados têm a estrutura esperada
                    if (Array.isArray(rotasData)) {
                        setData(rotasData);
                        
                        // Log detalhado da estrutura para identificar campos disponíveis
                        if (rotasData.length > 0) {
                        }
                    } else {
                        console.error('Formato inesperado da resposta:', rotasData);
                        setError('Formato inesperado dos dados da API');
                        setData([]);
                    }
                } else {
                    console.error('Erro HTTP:', res.status, res.statusText);
                    setError(`Erro ao carregar rotas: ${res.status}`);
                    setData([]);
                }
            } catch (err) {
                console.error('Erro ao buscar rotas:', err);
                setError('Erro ao carregar rotas');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRotas();
    }, [refreshTrigger]);

    // Função para excluir rota
    const handleDelete = async () => {
        if (!selectedItem) return;
        
        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            
            // Estratégia de identificação da rota para exclusão:
            // 1. Usar o id_rota se disponível
            // 2. Usar o ID do primeiro trecho se não houver id_rota (fallback)
            let rotaId = selectedItem.id_rota;
            let idSource = 'rota';
            
            if (!rotaId && selectedItem.resumo_por_veiculo.length > 0 && 
                selectedItem.resumo_por_veiculo[0].trechos_detalhados.length > 0) {
                // Pega o primeiro ID de trecho disponível como referência da rota
                rotaId = selectedItem.resumo_por_veiculo[0].trechos_detalhados[0].id;
                idSource = 'trecho';
            }
            
            if (!rotaId) {
                setIsDeleting(false);
                return;
            }
            
            // Removidos logs de debug
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/rotas/rotas/${rotaId}/`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            
            // Removido log de resposta
            
            if (res.ok) {
                // Remove o item da lista local
                setData(prevData => prevData.filter(item => {
                    // Se ambos têm id_rota, compara por id_rota
                    if (item.id_rota && selectedItem.id_rota) {
                        return item.id_rota !== selectedItem.id_rota;
                    }
                    // Senão, compara por descrição (fallback)
                    return item.descricao_transporte !== selectedItem.descricao_transporte;
                }));
                setShowDeleteModal(false);
                setSelectedItem(null);
                // Exclusão bem-sucedida
            } else {
                const errorData = await res.text();
                console.error('Erro na resposta:', errorData);
                console.error('Status:', res.status);
                console.error('StatusText:', res.statusText);
                
                // Tenta extrair mensagem de erro mais específica
                let errorMessage = 'Erro ao excluir rota.';
                try {
                    const errorJson = JSON.parse(errorData);
                    if (errorJson.detail) {
                        errorMessage = errorJson.detail;
                    } else if (errorJson.error) {
                        errorMessage = errorJson.error;
                    }
                } catch {
                    // Se não conseguir parsear, usa a mensagem padrão
                    errorMessage = `Erro ao excluir rota. Status: ${res.status}`;
                }
                
                // Erro específico retornado da API
            }
            } catch (error) {
            // Erro de conexão ao excluir rota
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = (item: Rota) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
        
        // Debug: verificar estrutura da rota selecionada
        console.log('Rota selecionada para exclusão:', {
            id_rota: item.id_rota,
            descricao: item.descricao_transporte,
            primeiroTrechoId: item.resumo_por_veiculo[0]?.trechos_detalhados[0]?.id
        });
    };

    // Função para converter segundos em formato legível
    const formatarTempo = (segundos: number) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        return `${horas}h ${minutos}m`;
    };

    // Função para obter veículos únicos de uma rota
    const obterVeiculos = (rota: Rota) => {
        return rota.resumo_por_veiculo.map(v => v.veiculo_label).join(', ');
    };

    // Função para obter tempo total de uma rota
    const obterTempoTotal = (rota: Rota) => {
        const tempoTotal = rota.resumo_por_veiculo.reduce((total, veiculo) => total + veiculo.duracao_total_segundos, 0);
        return formatarTempo(tempoTotal);
    };

    const filteredRows = data.filter((row) => {
        const search = filter.toLowerCase();
        const veiculos = obterVeiculos(row);
        return (
            (row.descricao_transporte || '').toLowerCase().includes(search) ||
            veiculos.toLowerCase().includes(search)
        );
    });

    if (loading) {
        return (
            <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5] w-full mt-8">
                <div className="p-8 text-center text-gray-500">
                    Carregando rotas...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5] w-full mt-8">
                <div className="p-8 text-center text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5] w-full mt-8">
            <div className="p-2 bg-[#f5f7fa]">
                <input
                    type="text"
                    placeholder="Filtrar por descrição de transporte ou veículo"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <Table className="w-full">
                <TableHeader className="bg-blue-primary text-white">
                    <TableRow>
                        <TableHead className='text-white'>Descrição</TableHead>
                        <TableHead className='text-white'>Veículos</TableHead>
                        <TableHead className='text-white'>Distância Total</TableHead>
                        <TableHead className='text-white'>Tempo Total</TableHead>
                        <TableHead className='text-white'>Nº Trechos</TableHead>
                        <TableHead className='text-white text-center'>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredRows.map((row, index) => (
                        <TableRow key={row.id_rota || index} className="text-black bg-white">
                            <TableCell className="font-medium">{row.descricao_transporte || '-'}</TableCell>
                            <TableCell>{obterVeiculos(row)}</TableCell>
                            <TableCell>{row.distancia_total_operacao_km.toFixed(2)}km</TableCell>
                            <TableCell>{obterTempoTotal(row)}</TableCell>
                            <TableCell>{row.resumo_por_veiculo.reduce((total, veiculo) => total + veiculo.trechos_detalhados.length, 0)} trechos</TableCell>
                            <TableCell className="text-center">
                                <div className="flex gap-2 justify-center">
                                    {onVisualizarRota && (
                                        <button
                                            onClick={() => onVisualizarRota(row)}
                                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                            title="Visualizar Rota no Mapa"
                                        >
                                            Mapa
                                        </button>
                                    )}
                                    <DeleteButton onClick={() => openDeleteModal(row)} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredRows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                                Nenhum resultado encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            
            {/* Modal de confirmação de exclusão */}
            <ModalConfirmacaoExclusao
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                }}
                onConfirm={handleDelete}
                titulo="Excluir Rota"
                mensagem="Tem certeza que deseja excluir a rota"
                nomeItem={selectedItem?.descricao_transporte || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default RotasTable;
