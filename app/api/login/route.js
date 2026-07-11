import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, AUTH_TOKEN_VALUE } from '../../../lib/auth';

export async function POST(request) {
  const { username, password } = await request.json();

  if (!username?.trim() || !password?.trim()) {
    return NextResponse.json(
      { error: 'Nom d’utilisateur et mot de passe requis' },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: AUTH_TOKEN_VALUE,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
