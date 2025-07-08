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


interface TabelaAlojamentosProps {
    refreshTrigger?: number; // Prop para trigger de refresh
}

export function TabelaAlojamentos({ refreshTrigger }: TabelaAlojamentosProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const itemsPerPage = 10;

    const columns = [
        { key: 'invoice', label: 'Nome', className: 'w-[200px] text-white' },
        { key: 'endereco', label: 'Endereço', className: 'w-[300px] text-white' },
        { key: 'cidade', label: 'Cidade/UF', className: 'w-[200px] text-white' },
        { key: 'qntdFuncionarios', label: 'Qtd. Funcionários Alocados', className: 'w-[180px] text-white text-center' },
        { key: 'actions', label: 'Ações', className: 'w-[100px] text-white text-center' },
    ];

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/alojamentos/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    setData([]);
                }
            } catch {
                setError('Erro ao carregar dados');
                setData([]);
            }
            setLoading(false);
        }
        fetchData();
    }, [refreshTrigger]); // Adiciona refreshTrigger como dependência

    // Função para excluir alojamento
    const handleDelete = async () => {
        if (!selectedItem) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/alojamentos/${selectedItem.id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            
            if (res.ok) {
                // Remove o item da lista local
                setData(prevData => prevData.filter(item => item.id !== selectedItem.id));
                // Fecha o modal
                setShowDeleteModal(false);
                setSelectedItem(null);
            } else {
                alert('Erro ao excluir alojamento');
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir alojamento');
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = (item: any) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
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

    // Filtro por todas as colunas principais
    const filteredInvoices = data.filter((invoice: any) => {
        const search = filter.toLowerCase();
        return (
            (invoice.invoice || "").toLowerCase().includes(search) ||
            (invoice.endereco || "").toLowerCase().includes(search) ||
            (invoice.cidade || "").toLowerCase().includes(search) ||
            (invoice.qntdFuncionarios !== undefined && invoice.qntdFuncionarios !== null ? invoice.qntdFuncionarios.toString().toLowerCase() : "").includes(search)
        );
    });
    const sortedInvoices = sortData(filteredInvoices);
    const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
    const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
            <div className="p-2 bg-[#f5f7fa]">
                <input
                    type="text"
                    placeholder="Filtrar por nome, endereço, cidade/UF ou quantidade"
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
                    {paginatedInvoices.map((invoice: any) => (
                        <TableRow key={invoice.id || invoice.invoice || Math.random()} className="text-black bg-white">
                            <TableCell className="font-medium">{invoice.nome}</TableCell>
                            <TableCell>{invoice.endereco}</TableCell>
                            <TableCell>{invoice.cidade}</TableCell>
                            <TableCell className="text-center">{invoice.qntdFuncionarios}</TableCell>
                            <TableCell className="text-center">
                                <DeleteButton onClick={() => openDeleteModal(invoice)} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {paginatedInvoices.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-400 py-8">Nenhum resultado encontrado.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Paginação */}
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
                titulo="Excluir Alojamento"
                mensagem="Tem certeza que deseja excluir o alojamento"
                nomeItem={selectedItem?.nome || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export function TabelaFuncionarios() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: 'nome', label: 'Nome', className: 'w-[200px] text-white' },
        { key: 'cargo', label: 'Cargo', className: 'w-[200px] text-white' },
        { key: 'setor', label: 'Setor', className: 'w-[200px] text-white' },
        { key: 'email', label: 'E-mail', className: 'w-[250px] text-white' },
        { key: 'telefone', label: 'Telefone', className: 'w-[150px] text-white' },
        { key: 'actions', label: 'Ações', className: 'w-[100px] text-white text-center' },
    ];

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/funcionarios/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    setData([]);
                }
            } catch {
                setError('Erro ao carregar dados');
                setData([]);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

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

    // Filtro por todas as colunas principais
    const filteredInvoices = data.filter((invoice: any) => {
        const search = filter.toLowerCase();
        return (
            (invoice.nome || "").toLowerCase().includes(search) ||
            (invoice.cargo || "").toLowerCase().includes(search) ||
            (invoice.setor || "").toLowerCase().includes(search) ||
            (invoice.email || "").toLowerCase().includes(search) ||
            (invoice.telefone || "").toLowerCase().includes(search)
        );
    });
    const sortedInvoices = sortData(filteredInvoices);
    const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
    const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
            <div className="p-2 bg-[#f5f7fa]">
                <input
                    type="text"
                    placeholder="Filtrar por nome, cargo, setor, e-mail ou telefone"
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
                    {paginatedInvoices.map((invoice: any) => (
                        <TableRow key={invoice.id || invoice.nome || Math.random()} className="text-black bg-white">
                            <TableCell className="font-medium">{invoice.nome}</TableCell>
                            <TableCell>{invoice.cargo}</TableCell>
                            <TableCell>{invoice.setor}</TableCell>
                            <TableCell>{invoice.email}</TableCell>
                            <TableCell>{invoice.telefone}</TableCell>
                            <TableCell className="text-center">{/* ações */}</TableCell>
                        </TableRow>
                    ))}
                    {paginatedInvoices.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-400 py-8">Nenhum resultado encontrado.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Paginação */}
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
        </div>
    );
}

export function TabelaObras() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: 'descricao', label: 'Descrição', className: 'w-[300px] text-white' },
        { key: 'localizacao', label: 'Localização', className: 'w-[300px] text-white' },
        { key: 'dataInicio', label: 'Data de Início', className: 'w-[200px] text-white' },
        { key: 'dataFim', label: 'Data de Fim', className: 'w-[200px] text-white' },
        { key: 'status', label: 'Status', className: 'w-[150px] text-white' },
        { key: 'actions', label: 'Ações', className: 'w-[100px] text-white text-center' },
    ];

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/obras/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    setData([]);
                }
            } catch {
                setError('Erro ao carregar dados');
                setData([]);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

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

    // Filtro por todas as colunas principais
    const filteredInvoices = data.filter((invoice: any) => {
        const search = filter.toLowerCase();
        return (
            (invoice.descricao || "").toLowerCase().includes(search) ||
            (invoice.localizacao || "").toLowerCase().includes(search) ||
            (invoice.dataInicio || "").toLowerCase().includes(search) ||
            (invoice.dataFim || "").toLowerCase().includes(search) ||
            (invoice.status || "").toLowerCase().includes(search)
        );
    });
    const sortedInvoices = sortData(filteredInvoices);
    const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
    const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
            <div className="p-2 bg-[#f5f7fa]">
                <input
                    type="text"
                    placeholder="Filtrar por descrição, localização, datas ou status"
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
                    {paginatedInvoices.map((invoice: any) => (
                        <TableRow key={invoice.id || invoice.descricao || Math.random()} className="text-black bg-white">
                            <TableCell className="font-medium">{invoice.descricao}</TableCell>
                            <TableCell>{invoice.localizacao}</TableCell>
                            <TableCell>{invoice.dataInicio}</TableCell>
                            <TableCell>{invoice.dataFim}</TableCell>
                            <TableCell>{invoice.status}</TableCell>
                            <TableCell className="text-center">{/* ações */}</TableCell>
                        </TableRow>
                    ))}
                    {paginatedInvoices.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-400 py-8">Nenhum resultado encontrado.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Paginação */}
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
        </div>
    );
}

export function TabelaVeiculos() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: 'modelo', label: 'Modelo', className: 'w-[200px] text-white' },
        { key: 'marca', label: 'Marca', className: 'w-[200px] text-white' },
        { key: 'ano', label: 'Ano', className: 'w-[100px] text-white' },
        { key: 'placa', label: 'Placa', className: 'w-[150px] text-white' },
        { key: 'status', label: 'Status', className: 'w-[150px] text-white' },
        { key: 'actions', label: 'Ações', className: 'w-[100px] text-white text-center' },
    ];

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/veiculos/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    setData([]);
                }
            } catch {
                setError('Erro ao carregar dados');
                setData([]);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

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

    // Filtro por todas as colunas principais
    const filteredInvoices = data.filter((invoice: any) => {
        const search = filter.toLowerCase();
        return (
            (invoice.modelo || "").toLowerCase().includes(search) ||
            (invoice.marca || "").toLowerCase().includes(search) ||
            (invoice.ano || "").toLowerCase().includes(search) ||
            (invoice.placa || "").toLowerCase().includes(search) ||
            (invoice.status || "").toLowerCase().includes(search)
        );
    });
    const sortedInvoices = sortData(filteredInvoices);
    const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
    const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
            <div className="p-2 bg-[#f5f7fa]">
                <input
                    type="text"
                    placeholder="Filtrar por modelo, marca, ano, placa ou status"
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
                    {paginatedInvoices.map((invoice: any) => (
                        <TableRow key={invoice.id || invoice.modelo || Math.random()} className="text-black bg-white">
                            <TableCell className="font-medium">{invoice.modelo}</TableCell>
                            <TableCell>{invoice.marca}</TableCell>
                            <TableCell>{invoice.ano}</TableCell>
                            <TableCell>{invoice.placa}</TableCell>
                            <TableCell>{invoice.status}</TableCell>
                            <TableCell className="text-center">{/* ações */}</TableCell>
                        </TableRow>
                    ))}
                    {paginatedInvoices.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-400 py-8">Nenhum resultado encontrado.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Paginação */}
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
        </div>
    );
}
