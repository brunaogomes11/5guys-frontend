import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import DeleteButton from "@/components/buttons/delete_button";
import ModalConfirmacaoExclusao from "@/components/modals/confirmacao_exclusao";

interface TabelaFuncionariosProps {
    refreshTrigger?: number;
}

export function TabelaFuncionarios({ refreshTrigger }: TabelaFuncionariosProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [obras, setObras] = useState<any[]>([]);
    const [alojamentos, setAlojamentos] = useState<any[]>([]);
    const itemsPerPage = 10;

    const columns = [
        { key: 'nome', label: 'Nome', className: 'w-[200px] text-white' },
        { key: 'cpf', label: 'CPF', className: 'w-[300px] text-white' },
        { key: 'alojamento', label: 'Alojamento', className: 'w-[200px] text-white' },
        { key: 'obra', label: 'Obra', className: 'w-[200px] text-white' },
        { key: 'actions', label: 'Ações', className: 'w-[100px] text-white text-center' },
    ];

    
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const [resFuncionarios, resObras, resAlojamentos] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/funcionarios/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/obras/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/alojamentos/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (resFuncionarios.ok) {
                    const json = await resFuncionarios.json();
                    setData(json);
                } else {
                    setData([]);
                }

                if (resObras.ok) {
                    const obrasData = await resObras.json();
                    setObras(obrasData);
                }

                if (resAlojamentos.ok) {
                    const alojamentosData = await resAlojamentos.json();
                    setAlojamentos(alojamentosData);
                }
            } catch {
                setError('Erro ao carregar dados');
                setData([]);
            }
            setLoading(false);
        }
        fetchData();
    }, [refreshTrigger]);

    // Função para excluir funcionário
    const handleDelete = async () => {
        if (!selectedItem) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/funcionarios/${selectedItem.id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            
            if (res.ok) {
                setData(prevData => prevData.filter(item => item.id !== selectedItem.id));
                setShowDeleteModal(false);
                setSelectedItem(null);
            } else {
                alert('Erro ao excluir funcionário');
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir funcionário');
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = (item: any) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    // Função para buscar nome da obra pelo ID
    const getNomeObra = (obraId: string | number) => {
        if (!obraId) return 'N/A';
        const obra = obras.find(o => o.id == obraId);
        return obra ? obra.nome : `ID: ${obraId}`;
    };

    // Função para buscar nome do alojamento pelo ID
    const getNomeAlojamento = (alojamentoId: string | number) => {
        if (!alojamentoId) return 'N/A';
        const alojamento = alojamentos.find(a => a.id == alojamentoId);
        return alojamento ? alojamento.nome : `ID: ${alojamentoId}`;
    };

    function sortData(data: any[]) {
        if (!sortConfig) return data;
        const sorted = [...data].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof typeof a];
            const bValue = b[sortConfig.key as keyof typeof b];
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }

    function handleSort(key: string) {
        if (key === 'actions') return;
        setSortConfig((prev) => {
            if (prev && prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    }

    const filtered = data.filter((item: any) => {
        const search = filter.toLowerCase();
        const nomeObra = getNomeObra(item.obra).toLowerCase();
        const nomeAlojamento = getNomeAlojamento(item.alojamento).toLowerCase();
        
        return (
            (item.nome_completo || "").toLowerCase().includes(search) ||
            (item.cpf || "").toLowerCase().includes(search) ||
            nomeAlojamento.includes(search) ||
            nomeObra.includes(search)
        );
    });
    const sorted = sortData(filtered);
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
                <div className="p-8 text-center text-gray-500">
                    Carregando funcionários...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
                <div className="p-8 text-center text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
            <div className="p-2 bg-[#f5f7fa]">
                <input
                    type="text"
                    placeholder="Filtrar por nome, CPF, alojamento ou obra"
                    value={filter}
                    onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 rounded border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <Table className="w-full">
                <TableHeader className="bg-blue-primary text-white">
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead
                                key={col.key}
                                className={col.className + ' cursor-pointer select-none'}
                                onClick={() => handleSort(col.key)}
                            >
                                <span className="flex items-center gap-1">
                                    {col.label}
                                    {sortConfig?.key === col.key && (
                                        <span>
                                            {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                        </span>
                                    )}
                                </span>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginated.map((item: any) => (
                        <TableRow key={item.id} className="text-black bg-white">
                            <TableCell className="font-medium">{item.nome_completo}</TableCell>
                            <TableCell className="text-center">{item.cpf}</TableCell>
                            <TableCell className="text-center">{getNomeAlojamento(item.alojamento)}</TableCell>
                            <TableCell className="text-center">{getNomeObra(item.obra)}</TableCell>
                            <TableCell className="text-center">
                                <DeleteButton onClick={() => openDeleteModal(item)} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {paginated.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-400 py-8">Nenhum resultado encontrado.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-center items-center gap-2 py-4 bg-[#f5f7fa]">
                <button
                    className="px-3 py-1 rounded bg-blue-primary text-white disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span className="text-black text-sm">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    className="px-3 py-1 rounded bg-blue-primary text-white disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    Próxima
                </button>
            </div>
            
            {/* Modal de confirmação de exclusão */}
            <ModalConfirmacaoExclusao
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                }}
                onConfirm={handleDelete}
                titulo="Excluir Funcionário"
                mensagem="Tem certeza que deseja excluir o funcionário"
                nomeItem={selectedItem?.nome_completo || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}
