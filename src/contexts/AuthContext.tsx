"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
    user: any;
    login: (email: string, senha: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean; // Adicione o estado de loading
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        setIsClient(true);
        
        // Só acessa localStorage no lado cliente
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/usuarios/me/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => {
                    if (!res.ok) {
                        localStorage.removeItem('token');
                        return null;
                    }
                    return res.json();
                })
                .then(data => {
                    if (data) {
                        setUser(data);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        }
    }, []); // Sem dependências para evitar loops

    async function login(email: string, senha: string) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/usuarios/login/`, {
                method: 'POST',
                body: JSON.stringify({ email, senha }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                
                // Salva o token no localStorage
                localStorage.setItem('token', data.access);
                
                // Atualiza o usuário
                setUser(data);
                
                // Redireciona após um pequeno delay
                setTimeout(() => {
                    router.push('/');
                }, 50);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        }
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}