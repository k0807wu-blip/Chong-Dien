import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const INVALID_CREDENTIALS = { error: '帳號或密碼錯誤' } as const;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = await checkRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: '嘗試次數過多，請稍後再試。' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user?.passwordHash ? await verifyPassword(password, user.passwordHash) : false;

  // 密碼對但不是 ADMIN 也一律回一樣的通用錯誤訊息，不透露「帳密正確、只是權限不夠」
  if (!user || !valid || user.role !== 'ADMIN') {
    return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
  }

  const sessionUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  const token = await signSession(sessionUser);

  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
