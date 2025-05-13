'use client';

import React, { useState } from 'react';

const MsgSucessoErro: React.FC = () => {
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleSuccess = () => setStatus('success');
  const handleError = () => setStatus('error');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Resultado da operação</h1>

        {status === 'success' && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4 border border-green-300">
            ✅ Operação realizada com sucesso!
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 border border-red-300">
            ❌ Ocorreu um erro durante a operação.
          </div>
        )}

        {!status && (
          <p className="text-gray-600 mb-4">Clique em um dos botões abaixo para testar.</p>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleSuccess}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
          >
            Simular Sucesso
          </button>

          <button
            onClick={handleError}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
          >
            Simular Erro
          </button>
        </div>
      </div>
    </div>
  );
};

export default MsgSucessoErro;

//Exemplo de uso do useRouter para redirecionar após cadastro
//'use client';
//
//import { useRouter } from 'next/navigation';
//
//const CadastroUsuario: React.FC = () => {
//  const router = useRouter();
//
//  const handleSubmit = async () => {
//    try {
//      // Simulando cadastro
//      const res = await fetch('/api/cadastro', { method: 'POST' });
//      if (!res.ok) throw new Error('Erro ao cadastrar');
//      
//      // Sucesso → redireciona com status na query
//      router.push('/msgSucessoErro?status=success');
//    } catch (err) {
//      // Erro → redireciona com erro
//      router.push('/msgSucessoErro?status=error');
//    }
//  };
//
//  return (
//    <button onClick={handleSubmit}>
//      Cadastrar
//    </button>
//  );
//};
