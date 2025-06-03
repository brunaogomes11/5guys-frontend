"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
  const { user } = useAuth();
  const router = useRouter();
  if (typeof window !== 'undefined' && !user && window.location.pathname !== '/login' && window.location.pathname !== '/cadastrar') {
    window.location.href = '/login';
    return null;
  }
  return <>{children}</>;
}
