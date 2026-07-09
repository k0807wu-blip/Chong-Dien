import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const INVALID_CREDENTIALS = { error: '帳號或密碼錯誤' } as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid) {
    return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
  }

  const sessionUser = { id: user.id, email: user.email, name: user.name };
  const token = await signSession(sessionUser);

  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
