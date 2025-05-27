"use client";
import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
    user: any;
    login: (email: string, senha: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    // Checa o token no localStorage ao iniciar e busca o usuário
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            fetch('http://127.0.0.1:8000/api/usuarios/me/', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (res.status === 401) {
                        setUser(null);
                        localStorage.removeItem('token');
                        return null;
                    }
                    return res.ok ? res.json() : null;
                })
                .then(data => {
                    if (data) setUser(data);
                });
        }
    }, []);

    async function login(email: string, senha: string) {
        const res = await fetch('http://127.0.0.1:8000/api/usuarios/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password: senha }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem('token', data.access);
            router.push('/'); // Redireciona para a página inicial
            return true;
        }
        return false;
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}