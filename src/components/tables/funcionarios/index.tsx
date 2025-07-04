import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
        { key: 'cpf', label: 'CPF', className: 'w-[300px] text-white' },
        { key: 'alojamento', label: 'Alojamento', className: 'w-[200px] text-white' },
        { key: 'actions', label: 'Ações', className: 'w-[100px] text-white text-center' },
    ];

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch('http://127.0.0.1:8000/api/funcionarios/', {
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

    const filtered = data.filter((item: any) => {
        const search = filter.toLowerCase();
        return (
            (item.nome || "").toLowerCase().includes(search) ||
            (item.cpf || "").toLowerCase().includes(search) ||
            (item.alojamento || "").toLowerCase().includes(search)
        );
    });
    const sorted = sortData(filtered);
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
            <div className="p-2 bg-[#f5f7fa]">
                <input
                    type="text"
                    placeholder="Filtrar por nome, endereço, cidade/UF ou cargo"
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
                            <TableCell className="text-center">{item.alojamento}</TableCell>
                            <TableCell className="text-center">{/* ações */}</TableCell>
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
        </div>
    );
}
