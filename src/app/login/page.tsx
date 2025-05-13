"use client";

import React, { useState } from 'react';
import PrimaryButton from '@/components/buttons/primary_button';
import Logo from '@/components/logo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const ok = await login(email, senha);
        if (ok) {
            router.push('/'); // Redireciona para a home
        } else {
            setError('E-mail ou senha inválidos');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-primary">
            <div className="w-full max-w-md p-8 rounded-lg">
                <Logo fontSize='40px'/>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='mt-[30px]'>
                        <label htmlFor="email" className="block text-[14px] font-medium text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white-input rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <PrimaryButton className='mt-[40px]'>
                        Entrar
                    </PrimaryButton>
                    <div className="flex justify-center mt-4">
                        <span className="text-white text-sm mx-2 inline-block">
                            Não tem uma conta?
                        <a href="/cadastrar" className="text-blue-500 hover:underline ml-1">
                            Cadastre-se
                        </a>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;