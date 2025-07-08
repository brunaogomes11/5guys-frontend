import React, { useState, useEffect } from "react";
import PrimaryButton from "@/components/buttons/primary_button";
import CancelButton from "@/components/buttons/cancel_button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ModalCadastrarRotas: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        descricao: "",
        obraId: "",
        veiculoId: "",
    });
    const [obras, setObras] = useState<any[]>([]);
    const [veiculos, setVeiculos] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carrega dados iniciais ao abrir o modal
    useEffect(() => {
        if (!isOpen) return;
        
        const loadData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [resObras, resVeiculos] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/obras/`, { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/veiculos/`, { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                ]);

                if (resObras.ok) {
                    const obrasData = await resObras.json();
                    setObras(obrasData);
                } else {
                    console.error('Erro ao buscar obras', await resObras.text());
                }

                if (resVeiculos.ok) {
                    const veicData = await resVeiculos.json();
                    setVeiculos(veicData);
                } else {
                    console.error('Erro ao buscar veículos', await resVeiculos.text());
                }
            } catch (err) {
                console.error('Erro na requisição inicial', err);
                setError('Erro ao carregar dados necessários');
            }
        };

        loadData();
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                descricao: form.descricao, // API espera "nome" baseado no comentário
                obra_id: form.obraId,
                veiculo_id: form.veiculoId,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/rotas/otimizar/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // Reset form
                setForm({
                    descricao: "",
                    obraId: "",
                    veiculoId: "",
                });
                onSuccess();
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Erro ao cadastrar rota');
            }
        } catch (err) {
            console.error('Erro ao cadastrar rota:', err);
            setError('Erro de conexão com o servidor');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[1000]">
            <div className="bg-blue-primary py-[3.25rem] px-[5.5rem] rounded-lg min-w-[400px] max-w-[500px] shadow-lg relative">
                <h2 className="text-[#FFFFFF] mb-4 text-center text-xl font-bold">Cadastrar Rota</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-sm mb-1">Nome da Rota</label>
                        <input
                            type="text"
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            className="w-full text-black bg-[#EAEAEA] rounded-[0.4rem] px-2 py-1"
                            required
                            placeholder="Digite o nome da rota..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white text-sm mb-1">Obra</label>
                        <select
                            name="obraId"
                            value={form.obraId}
                            onChange={handleChange}
                            className="w-full text-black bg-[#EAEAEA] rounded-[0.4rem] px-2 py-1"
                            required
                        >
                            <option value="">Selecione uma obra</option>
                            {obras.map(o => (
                                <option key={o.id} value={o.id}>{o.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-white text-sm mb-1">Veículo</label>
                        <select
                            name="veiculoId"
                            value={form.veiculoId}
                            onChange={handleChange}
                            className="w-full text-black bg-[#EAEAEA] rounded-[0.4rem] px-2 py-1"
                            required
                        >
                            <option value="">Selecione um veículo</option>
                            {veiculos.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.modelo} - {v.placa}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-row gap-2 border-box">
                        <PrimaryButton 
                            type="submit" 
                            className="mt-2 mx-auto relative"
                        >
                            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Rota'}
                        </PrimaryButton>
                        <CancelButton 
                            className="mt-2 mx-auto relative" 
                            onClick={onClose}
                        >
                            Cancelar
                        </CancelButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCadastrarRotas;
