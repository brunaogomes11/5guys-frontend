import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

export function TabelaVeiculos() {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const columns = [
        { key: 'invoice', label: 'Nome', className: 'w-[200px] text-white' },
        { key: 'paymentStatus', label: 'Endereço', className: 'w-[300px] text-white' },
        { key: 'paymentMethod', label: 'Cidade/UF', className: 'w-[200px] text-white' },
        { key: 'totalAmount', label: 'Qtd. Funcionários Alocados', className: 'w-[180px] text-white text-center' },
        { key: 'actions', label: 'Ações', className: 'w-[100px] text-white text-center' },
    ];

    function sortData(data: typeof invoices) {
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

    const sortedInvoices = sortData(invoices);

    return (
        <div className="rounded-xl overflow-hidden border-[2px] border-[#E4E6F5]">
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
                    {sortedInvoices.map((invoice) => (
                        <TableRow key={invoice.invoice} className="text-black bg-white">
                            <TableCell className="font-medium">{invoice.invoice}</TableCell>
                            <TableCell>{invoice.paymentStatus}</TableCell>
                            <TableCell>{invoice.paymentMethod}</TableCell>
                            <TableCell className="text-center">{invoice.totalAmount}</TableCell>
                            <TableCell className="text-center">{/* ações */}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
