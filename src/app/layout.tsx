"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Remove atributos indesejados adicionados por extensões do navegador
    const body = document.querySelector('body');
    if (body) {
      body.removeAttribute('cz-shortcut-listen');
    }
  }, []);

  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    if (isClient && !loading) {
      const currentPathname = window.location.pathname;
      
      // Se usuário está logado e está na página de login, redireciona para home
      if (user && (currentPathname === '/login' || currentPathname === '/cadastrar')) {
        router.push('/');
      }
      // Se usuário não está logado e não está nas páginas públicas, redireciona para login
      else if (!user && currentPathname !== '/login' && currentPathname !== '/cadastrar') {
        router.push('/login');
      }
    }
  }, [user, loading, router, isClient]);

  // Enquanto estiver carregando ou não for cliente, mostre um loader
  if (loading || !isClient) {
    return <Loading />;
  }

  // Se o usuário não estiver logado e estiver na página de login/cadastro, ou se estiver logado, mostre o conteúdo
  if ((!user && (currentPath === '/login' || currentPath === '/cadastrar')) || user) {
    return <>{children}</>;
  }

  return null; // Evita renderizar o conteúdo antes do redirecionamento
}