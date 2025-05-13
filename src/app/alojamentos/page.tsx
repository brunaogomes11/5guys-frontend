"use client";
import PrimaryButton from "@/components/buttons/primary_button";
import Menu from "@/components/menu";
import { useState } from "react";
import ModalCadastrarAlojamento from "@/components/modals/cadastrar_alojamentos";

export default function AlojamentosPage() {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <Menu />
            <div className="w-[100%] h-[100%] p-[32px] border-box">
                <div className="flex"></div>
                <div className="w-[300px] flex justify-center items-center">
                    {showModal && (
                        <ModalCadastrarAlojamento isOpen={true} onClose={() => setShowModal(false)} />
                    )}

                    <PrimaryButton onClick={() => setShowModal(true)}>
                        <img src="icons/plus_icon.svg" alt="Plus Icon"/>
                        Cadastrar novos alojamentos
                    </PrimaryButton>
                </div>
                <div className="w-full">
                    <table className="min-w-full bg-white border border-gray-200 rounded">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Nome</th>
                                <th className="py-2 px-4 border-b">Endereço</th>
                                <th className="py-2 px-4 border-b">Capacidade</th>
                                <th className="py-2 px-4 border-b">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b">Alojamento 1</td>
                                <td className="py-2 px-4 border-b">Rua Exemplo, 123</td>
                                <td className="py-2 px-4 border-b">10</td>
                                <td className="py-2 px-4 border-b">
                                    <button className="text-blue-500 hover:underline">Editar</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">Alojamento 2</td>
                                <td className="py-2 px-4 border-b">Av. Teste, 456</td>
                                <td className="py-2 px-4 border-b">20</td>
                                <td className="py-2 px-4 border-b">
                                    <button className="text-blue-500 hover:underline">Editar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}