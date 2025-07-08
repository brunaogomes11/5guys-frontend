"use client";

import Logo from '@/components/logo';
import React, { useState } from 'react';

const CadastroPage: React.FC = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        senha: '',
        confirmarSenha: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showTooltip, setShowTooltip] = useState(false);

    const { login } = require('@/contexts/AuthContext').useAuth();
    const router = require('next/navigation').useRouter();

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
        if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Email inválido.';
        if (!formData.cpf.match(/^\d{11}$/)) newErrors.cpf = 'CPF deve conter 11 dígitos numéricos.';
        if (!validarSenha(formData.senha)) newErrors.senha = 'A senha deve conter pelo menos 6 caracteres, uma letra maiúscula, um símbolo e um número.';
        if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'As senhas não coincidem.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function validarSenha(senha: string) {
        // Pelo menos 6 caracteres, uma letra maiúscula, um símbolo e um número
        return senha.length >= 6 &&
            /[A-Z]/.test(senha) &&
            /[0-9]/.test(senha) &&
            /[^A-Za-z0-9]/.test(senha);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/usuarios/cadastrar/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome: formData.nome,
                        email: formData.email,
                        cpf: formData.cpf,
                        senha: formData.senha,
                        confirmacao_senha: formData.confirmarSenha
                    })
                });
                if (res.ok) {
                    // Autentica automaticamente após cadastro
                    const ok = await login(formData.email, formData.senha);
                    if (ok) {
                        router.push('/');
                    }
                } else {
                    const data = await res.json();
                    setErrors({ email: data.detail || 'Erro ao cadastrar.' });
                }
            } catch (err) {
                setErrors({ email: 'Erro de conexão com o servidor.' });
            }
        }
    };

    return (
        <div className="bg-[#0e335e] min-h-screen flex flex-col items-center justify-center">
            <Logo fontSize='40px' />
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full max-w-md bg-transparent"
            >
                {renderInput('Nome Completo', 'nome')}
                {renderInput('Email', 'email')}
                {renderInput('CPF', 'cpf')}
                {renderInput('Senha', 'senha', 'password')}
                {renderInput('Confirmar Senha', 'confirmarSenha', 'password')}

                <button
                    type="submit"
                    className="bg-[#ff6530] text-white font-bold border-none rounded-[20px] py-3 px-4 text-base cursor-pointer mt-2 transition hover:bg-[#ff7b4a]"
                >
                    Cadastrar
                </button>
            </form>
            <p className="text-white text-sm mt-4">
                Já possui uma conta?{' '}
                <a href="/login" className="text-[#ff6530] hover:underline">
                    Faça login
                </a>
            </p>
        </div>
    );

    function renderInput(label: string, name: string, type = 'text') {
        // Adiciona o "?" com tooltip apenas no campo senha
        return (
            <div className="mb-4 relative">
                <label className="text-white block mb-1">
                    {label}
                    {name === 'senha' && (
                        <span
                            className="inline-flex items-center justify-center ml-2 w-5 h-5 rounded-full border-[1px] text-white text-xs font-bold cursor-pointer relative"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            ?
                            {showTooltip && (
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg">
                                    A senha deve conter pelo menos 6 caracteres, uma letra maiúscula, um símbolo e um número.
                                </span>
                            )}
                        </span>
                    )}
                </label>
                <input
                    type={type}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#EAEAEA] rounded-[6px] border-none mt-1 text-base"
                />
                {errors[name] && <span className="text-[#ff6b6b] text-xs mt-1 block">{errors[name]}</span>}
            </div>
        );
    }
};

export default CadastroPage;