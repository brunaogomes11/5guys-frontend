import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, senha } = await request.json();

    // Exemplo: usuário e senha fixos
    if (email === 'admin@admin.com' && senha === '123456') {
        // Retorne um token fake
        return NextResponse.json({ token: 'fake-jwt-token', user: { email } });
    }

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
}