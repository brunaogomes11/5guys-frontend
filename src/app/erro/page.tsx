'use client';

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

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Email inválido.';
    if (!formData.cpf.match(/^\d{11}$/)) newErrors.cpf = 'CPF deve conter 11 dígitos numéricos.';
    if (formData.senha.length < 6) newErrors.senha = 'Senha deve ter pelo menos 6 caracteres.';
    if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'As senhas não coincidem.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Limpa erro ao digitar
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Dados válidos:', formData);
      // Aqui você pode enviar para o backend
    }
  };

  return (
    <div style={{ backgroundColor: '#0e335e', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
        {renderInput('Nome Completo', 'nome')}
        {renderInput('Email', 'email')}
        {renderInput('CPF', 'cpf')}
        {renderInput('Senha', 'senha', 'password')}
        {renderInput('Confirmar Senha', 'confirmarSenha', 'password')}

        <button style={styles.button} type="submit">Cadastrar</button>
      </form>
    </div>
  );

  function renderInput(label: string, name: string, type = 'text') {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: 'white' }}>{label}</label>
        <input
          type={type}
          name={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          style={styles.input}
        />
        {errors[name] && <span style={styles.error}>{errors[name]}</span>}
      </div>
    );
  }
};

const styles = {
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    marginTop: '5px',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#ff6530',
    color: 'white',
    fontWeight: 'bold' as const,
    border: 'none',
    borderRadius: '20px',
    padding: '12px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.875rem',
    marginTop: '4px',
    display: 'block',
  },
};

export default CadastroPage;
