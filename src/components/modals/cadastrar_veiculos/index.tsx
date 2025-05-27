import React, { useState } from "react";
import TextInput from "@/components/inputs/text_input";
import PrimaryButton from "@/components/buttons/primary_button";
import CancelButton from "@/components/buttons/cancel_button";
import ModalSucessoCadVeiculos from "@/components/modals/sucesso_cad_veiculos";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalCadastrarVeiculos: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        quantidade_passageiros: "",
        modelo: "",
        placa: "",
        cor: "",
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const payload = { ...form };
            const res = await fetch('http://127.0.0.1:8000/api/veiculos/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowSuccess(true);
            } else {
                const errorData = await res.json();
                let errorMsg = 'Erro ao cadastrar veículo.';
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
                    <h2 className="text-[#FFFFFF] mb-4 text-center">Cadastrar Veículo</h2>
                    <form onSubmit={handleSubmit}>
                        {formError && (
                            <div className="mb-3 text-red-600 bg-red-100 border border-red-300 rounded p-2 text-sm">
                                {formError.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                            </div>
                        )}
                        <div className="mb-3">
                            <TextInput
                                label="Quantidade de Passageiros"
                                name="quantidade_passageiros"
                                value={form.quantidade_passageiros}
                                onChange={handleChange}
                                className="w-full"
                                type="number"
                                min="1"
                            />
                        </div>
                        <div className="mb-3">
                            <TextInput
                                label="Modelo"
                                name="modelo"
                                value={form.modelo}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-3">
                            <TextInput
                                label="Placa"
                                name="placa"
                                value={form.placa}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-3">
                            <TextInput
                                label="Cor"
                                name="cor"
                                value={form.cor}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        
                        <div className="flex flex-row gap-2 border-box">
                            <PrimaryButton
                                className="mt-2 mx-auto relative"
                            >
                                <img src="icons/truck_icon.svg" alt="Truck Icon" className="w-[1rem] absolute right-3 top-1/2 -translate-y-1/2"/>
                                Cadastrar Veículo
                            </PrimaryButton>
                            <CancelButton
                                className="mt-2 mx-auto relative"
                                onClick={onClose}
                            >
                                Cancelar
                                <img
                                    src="icons/x_icon.svg"
                                    alt="Plus Icon"
                                    className="w-[1rem] absolute right-3 top-1/2 -translate-y-1/2"
                                    style={{ pointerEvents: "none" }}
                                />
                            </CancelButton>
                        </div>
                    </form>
                </div>
            </div>
            {showSuccess && (
                <ModalSucessoCadVeiculos isOpen={showSuccess} onClose={() => { setShowSuccess(false); onClose(); }} />
            )}
        </>
    );
};

export default ModalCadastrarVeiculos;