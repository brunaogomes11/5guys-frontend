import React, { useState } from "react";
import TextInput from "@/components/inputs/text_input";
import PrimaryButton from "@/components/buttons/primary_button";
import CancelButton from "@/components/buttons/cancel_button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalCadastrarVeiculos: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
                <h2 className="text-[#FFFFFF] mb-4 text-center">Cadastrar Obra</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log("Dados do Obra:", form);
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
                    <div className="flex flex-row gap-2 border-box">
                        <PrimaryButton
                            className="mt-2 mx-auto relative"
                            onClick={() => {
                                // Optionally, you can trigger form submission here if needed
                            }}
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
    );
};

export default ModalCadastrarVeiculos;