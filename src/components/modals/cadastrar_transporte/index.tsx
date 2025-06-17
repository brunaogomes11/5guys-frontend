import React, { useState } from "react";
import PrimaryButton from "@/components/buttons/primary_button";
import CancelButton from "@/components/buttons/cancel_button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ModalCadastrarTransporte: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    descricao: "",
    destino: "",
    motorista: "",
  });

  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Simulando envio
      const res = await fetch("/api/ordens_transporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descricao: form.descricao,
          destino: form.destino,
          motorista: form.motorista,
        }),
      });

      if (!res.ok) throw new Error();

      setMensagemSucesso("Transporte cadastrado com sucesso! ✅");

      // Limpa o formulário
      setForm({ descricao: "", destino: "", motorista: "" });

      // Chama a função de sucesso do pai
      onSuccess();
    } catch (error) {
      console.error("Erro ao cadastrar transporte:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">Cadastrar Transporte</h2>

        {/* ✅ Mensagem de sucesso */}
        {mensagemSucesso && (
          <div className="bg-green-500 text-white text-sm px-3 py-2 rounded mb-4">
            {mensagemSucesso}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Destino</label>
            <input
              type="text"
              name="destino"
              value={form.destino}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Motorista</label>
            <input
              type="text"
              name="motorista"
              value={form.motorista}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <CancelButton onClick={onClose}>Cancelar</CancelButton>
            <PrimaryButton type="submit">Cadastrar</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCadastrarTransporte;
