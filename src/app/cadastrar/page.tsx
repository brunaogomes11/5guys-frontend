"use client";

import React from 'react';
import PrimaryButton from '@/components/buttons/primary_button';
import Logo from '@/components/logo';

const CadastroUsuarioLayout: React.FC = () => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Lógica para envio do formulário
        console.log('Formulário enviado');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-primary">
            <div className="w-full max-w-md p-8 rounded-lg">
                <Logo fontSize='40px'/>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='mt-[30px]'>
                        <label htmlFor="nome" className="block text-[14px] font-medium text-white">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white-input rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className='mt-[30px]'>
                        <label htmlFor="email" className="block text-[14px] font-medium text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white-input rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className='mt-[30px]'>
                        <label htmlFor="cpf" className="block text-[14px] font-medium text-white">
                            CPF
                        </label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white-input rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className='mt-[30px]'>
                        <label htmlFor="senha" className="block text-[14px] font-medium text-white">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white-input rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className='mt-[30px]'>
                        <label htmlFor="confirmarSenha" className="block text-[14px] font-medium text-white">
                            Confirmar Senha
                        </label>
                        <input
                            type="password"
                            id="confirmarSenha"
                            name="confirmarSenha"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white-input rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <PrimaryButton className='mt-[40px]'>
                        Cadastrar
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
};

export default CadastroUsuarioLayout;