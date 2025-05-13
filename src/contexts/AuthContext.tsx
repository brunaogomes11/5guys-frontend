"use client";
import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
    user: any;
    login: (email: string, senha: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    async function login(email: string, senha: string) {
        const res = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('token', data.token);
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