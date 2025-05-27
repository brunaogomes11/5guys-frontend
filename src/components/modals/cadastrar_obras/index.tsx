import React, { useState } from "react";
import TextInput from "@/components/inputs/text_input";
import PrimaryButton from "@/components/buttons/primary_button";
import CancelButton from "@/components/buttons/cancel_button";
import ModalSelecaoEnd from "@/components/maps/modal_selecao_end";
import ModalSucessoCadObras from "@/components/modals/sucesso_cad_obras";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalCadastrarObra: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        nome: "",
        endereco: "",
        numero: "",
        cidade: "",
        estado: "",
        cep: "",
        latitude: "",
        longitude: "",
    });
    const [showMap, setShowMap] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const payload = {
                nome: form.nome,
                endereco: form.endereco,
                numero: form.numero,
                cidade: form.cidade,
                estado: form.estado,
                latitude: form.latitude ? Number(form.latitude).toFixed(4) : undefined,
                longitude: form.longitude ? Number(form.longitude).toFixed(4)  : undefined,
                cep: form.cep,
            };
            const res = await fetch('http://127.0.0.1:8000/api/obras/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowSuccess(true);
            } else {
                const errorData = await res.json();
                let errorMsg = 'Erro ao cadastrar obra.';
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
            {showMap && (
                <ModalSelecaoEnd
                    isOpen={showMap}
                    onClose={() => setShowMap(false)}
                    onSelect={(lat, lng, cep, endereco, cidade, estado) => {
                        setForm(f => ({
                            ...f,
                            latitude: lat ? String(lat) : "",
                            longitude: lng ? String(lng) : "",
                            cep: cep || "",
                            endereco: endereco || "",
                            cidade: cidade || "",
                            estado: estado || "",
                        }));
                        setShowMap(false);
                    }}
                />
            )}
            <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[1000]">
                <div className="bg-blue-primary py-[3.25rem] px-[5.5rem] rounded-lg min-w-[350px] shadow-lg relative">
                    <h2 className="text-[#FFFFFF] mb-4 text-center">Cadastrar Obra</h2>
                    <form onSubmit={handleSubmit}>
                        {formError && (
                            <div className="mb-3 text-red-600 bg-red-100 border border-red-300 rounded p-2 text-sm">
                                {formError.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                            </div>
                        )}
                        <div className="mb-3">
                            <TextInput
                                label="Nome"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-3 flex gap-2 items-end">
                            <TextInput
                                label="Endereço"
                                name="endereco"
                                value={form.endereco}
                                onChange={handleChange}
                                className="flex-1"
                                placeholder="Rua, Avenida..."
                            />
                            <TextInput
                                label="Nº"
                                name="numero"
                                value={form.numero}
                                onChange={handleChange}
                                className="w-[100px]"
                                placeholder="Número"
                            />
                            <div>
                                <PrimaryButton
                                    className="ml-2 px-2 py-1 rounded"
                                    onClick={() => setShowMap(true)}
                                >
                                    Selecionar pelo mapa
                                </PrimaryButton>
                            </div>
                        </div>
                        <div className="mb-3 flex gap-2">
                            <TextInput
                                label="Cidade"
                                name="cidade"
                                value={form.cidade}
                                onChange={handleChange}
                                className="flex-1"
                            />
                            <TextInput
                                label="UF"
                                name="estado"
                                value={form.estado}
                                onChange={handleChange}
                                className="w-1/3"
                                maxLength={2}
                                placeholder="UF"
                            />
                        </div>
                        <div className="mb-3">
                            <TextInput
                                label="CEP"
                                name="cep"
                                value={form.cep}
                                onChange={handleChange}
                                className="w-full"
                                placeholder="00000-000"
                            />
                        </div>
                        <div className="flex flex-row gap-2 border-box">
                            <PrimaryButton
                                className="mt-2 mx-auto relative"
                                onClick={() => {
                                    // Optionally, you can trigger form submission here if needed
                                }}
                            >
                                <img src="icons/tool_icon.svg" alt="Tool Icon" className="w-[1rem] absolute right-3 top-1/2 -translate-y-1/2"/>
                                Cadastrar Obra
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
                <ModalSucessoCadObras isOpen={showSuccess} onClose={() => { setShowSuccess(false); onClose(); }} />
            )}
        </>
    );
};

export default ModalCadastrarObra;