import React, { useState } from "react";
import TextInput from "@/components/inputs/text_input";
import PrimaryButton from "@/components/buttons/primary_button";
import CancelButton from "@/components/buttons/cancel_button";
import ModalSucessoCadFuncionarios from "@/components/modals/sucesso_cad_funcionarios";
import ModalSelecaoEnd from "@/components/maps/modal_selecao_end";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ModalCadastrarFuncionarios: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        nome_completo: "",
        cpf: "",
        alojamento: "",
        obra: "",
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [alojamentos, setAlojamentos] = useState<any[]>([]);
    const [obras, setObras] = useState<any[]>([]);
    const [loadingAlojamentos, setLoadingAlojamentos] = useState(true);
    const [loadingObras, setLoadingObras] = useState(true);
    const [selectedAlojamento, setSelectedAlojamento] = useState<string>("");
    const [selectedObra, setSelectedObra] = useState<string>("");

    
    // Busca alojamentos e obras ao abrir o modal
    React.useEffect(() => {
        if (isOpen) {
            setLoadingAlojamentos(true);
            setLoadingObras(true);
            
            // Busca alojamentos
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/alojamentos/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
                .then(res => res.json())
                .then(data => {
                    setAlojamentos(data);
                    setLoadingAlojamentos(false);
                })
                .catch(() => setLoadingAlojamentos(false));

            // Busca obras
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/obras/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
                .then(res => res.json())
                .then(data => {
                    setObras(data);
                    setLoadingObras(false);
                })
                .catch(() => setLoadingObras(false));
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const payload = { ...form, alojamento: selectedAlojamento, obra: selectedObra };
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/funcionarios/cadastrar/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowSuccess(true);
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                const errorData = await res.json();
                let errorMsg = 'Erro ao cadastrar funcionário.';
                if (typeof errorData === 'object' && errorData !== null) {
                    errorMsg = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join('\n');
                }
                setFormError(errorMsg);
            }
        } catch {
            setFormError('Erro de conexão com o servidor.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[1000]">
                <div className="bg-blue-primary py-[3.25rem] px-[5.5rem] rounded-lg min-w-[350px] shadow-lg relative">
                    <h2 className="text-[#FFFFFF] mb-4 text-center">Cadastrar Funcionário</h2>
                    <form onSubmit={handleSubmit}>
                        {formError && (
                            <div className="mb-3 text-red-600 bg-red-100 border border-red-300 rounded p-2 text-sm">
                                {formError.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                            </div>
                        )}
                        <div className="mb-3">
                            <TextInput label="Nome" name="nome_completo" value={form.nome_completo} onChange={handleChange} className="w-full" />
                        </div>
                        <div className="mb-3">
                            <TextInput label="CPF" name="cpf" value={form.cpf} onChange={handleChange} className="w-full" placeholder="CPF" />
                        </div>
                        <div className="mb-3 flex gap-2 items-end">
                            <div className="flex-1">
                                <label className="block text-white text-sm font-medium mb-1">Obra</label>
                                <select
                                    className="flex-1 w-full rounded border bg-white border-gray-300 px-2 py-2 text-black"
                                    value={selectedObra}
                                    onChange={e => setSelectedObra(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione uma obra</option>
                                    {obras.map((o: any) => (
                                        <option key={o.id} value={o.id}>{o.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <PrimaryButton
                                className="ml-2 px-2 py-1 rounded"
                                onClick={() => { window.location.href = '/obras'; }}
                            >
                                Nova Obra
                            </PrimaryButton>
                        </div>
                        <div className="mb-3 flex gap-2 items-end">
                            <div className="flex-1">
                                <label className="block text-white text-sm font-medium mb-1">Alojamento</label>
                                <select
                                    className="flex-1 w-full rounded border bg-white border-gray-300 px-2 py-2 text-black"
                                    value={selectedAlojamento}
                                    onChange={e => setSelectedAlojamento(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione um alojamento</option>
                                    {alojamentos.map((a: any) => (
                                        <option key={a.id} value={a.id}>{a.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <PrimaryButton
                                className="ml-2 px-2 py-1 rounded"
                                onClick={() => { window.location.href = '/alojamentos'; }}
                            >
                                Novo Alojamento
                            </PrimaryButton>
                        </div>
                        <div className="flex flex-row gap-2 border-box">
                            <PrimaryButton type="submit" className="mt-2 mx-auto relative">
                                Cadastrar Funcionário
                            </PrimaryButton>
                            <CancelButton className="mt-2 mx-auto relative" onClick={onClose}>
                                Cancelar
                            </CancelButton>
                        </div>
                    </form>
                </div>
            </div>
            {showSuccess && (
                <ModalSucessoCadFuncionarios isOpen={showSuccess} onClose={() => { setShowSuccess(false); onClose(); }} />
            )}
        </>
    );
};

export default ModalCadastrarFuncionarios;