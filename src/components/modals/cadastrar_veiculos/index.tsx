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
        tipo_veiculo: "",
        marca: "",
        modelo: "",
        placa: "",
        cor: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[1000]">
            <div className="bg-blue-primary py-[3.25rem] px-[5.5rem] rounded-lg min-w-[350px] shadow-lg relative">
                <h2 className="text-[#FFFFFF] mb-4 text-center">Cadastrar Veículo</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log("Dados do Obra:", form);
                        onClose(); // Fecha o modal após salvar
                    }}
                >
                    <div className="mb-3">
                        <TextInput
                            label="Tipo de Veículo"
                            name="tipo_veiculo"
                            value={form.tipo_veiculo}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                    <div className="mb-3">
                        <TextInput
                            label="Marca"
                            name="marca"
                            value={form.marca}
                            onChange={handleChange}
                            className="w-full"
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