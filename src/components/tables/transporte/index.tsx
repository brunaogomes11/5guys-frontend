import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface TransporteTableProps {
    status: 'emAndamento' | 'concluidos' | 'emEspera';
}

const TransporteTable: React.FC<TransporteTableProps> = ({ status }) => {
    const [filter, setFilter] = useState('');

    const data = {
        emAndamento: [
            { id: 1, descricao: 'Transporte 1', destino: 'Local A', motorista: 'João' },
            { id: 2, descricao: 'Transporte 2', destino: 'Local B', motorista: 'Maria' },
        ],
        concluidos: [
            { id: 3, descricao: 'Transporte 3', destino: 'Local C', motorista: 'Carlos' },
            { id: 4, descricao: 'Transporte 4', destino: 'Local D', motorista: 'Ana' },
        ],
        emEspera: [
            { id: 5, descricao: 'Transporte 5', destino: 'Local E', motorista: 'Pedro' },
            { id: 6, descricao: 'Transporte 6', destino: 'Local F', motorista: 'Clara' },
        ],
    };

    const rows = data[status] || [];

    const filteredRows = rows.filter((row) => {
        const search = filter.toLowerCase();
        return (
            row.descricao.toLowerCase().includes(search) ||
            row.destino.toLowerCase().includes(search) ||
            row.motorista.toLowerCase().includes(search)
        );
    });

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5] w-full mt-8">
            <div className="p-2 bg-[#f5f7fa]">
                <input
                    type="text"
                    placeholder="Filtrar por descrição, destino ou motorista"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <Table className="w-full">
                <TableHeader className="bg-blue-primary text-white">
                    <TableRow>
                        <TableHead className='text-white'>ID</TableHead>
                        <TableHead className='text-white'>Descrição</TableHead>
                        <TableHead className='text-white'>Destino</TableHead>
                        <TableHead className='text-white'>Motorista</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredRows.map((row) => (
                        <TableRow key={row.id} className="text-black bg-white">
                            <TableCell className="font-medium">{row.id}</TableCell>
                            <TableCell>{row.descricao}</TableCell>
                            <TableCell>{row.destino}</TableCell>
                            <TableCell>{row.motorista}</TableCell>
                        </TableRow>
                    ))}
                    {filteredRows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                                Nenhum resultado encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TransporteTable;
