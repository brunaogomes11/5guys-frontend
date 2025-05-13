import React, { useState } from "react";
import TextInput from "@/components/inputs/text_input";
import PrimaryButton from "@/components/buttons/primary_button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalCadastrarAlojamento: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        nome: "",
        logradouro: "",
        numero: "",
        cidade: "",
        uf: "",
        cep: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[1000]">
            <div className="bg-blue-primary py-[3.25rem] px-[5.5rem] rounded-lg min-w-[350px] shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-transparent border-none text-[2rem] text-white cursor-pointer"
                    aria-label="Fechar"
                    type="button"
                >
                    ×
                </button>
                <h2 className="text-[#FFFFFF] mb-4 text-center">Cadastrar Alojamento</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log("Dados do alojamento:", form);
                        onClose(); // Fecha o modal após salvar
                    }}
                >
                    <div className="mb-3">
                        <TextInput
                            label="Nome"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                    <div className="mb-3 flex gap-2">
                        <TextInput
                            label="Logradouro"
                            name="logradouro"
                            value={form.logradouro}
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
                            name="uf"
                            value={form.uf}
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
                    <PrimaryButton
                        className="mt-2 mx-auto"
                        onClick={() => {
                            // Optionally, you can trigger form submission here if needed
                        }}
                    >
                        Salvar
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
};

export default ModalCadastrarAlojamento;