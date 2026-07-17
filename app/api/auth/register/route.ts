import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = await checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: '嘗試次數過多，請稍後再試。' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: '請確認 Email、密碼（至少 8 碼）與姓名皆已正確填寫。' }, { status: 400 });
  }
  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: '此 Email 已經註冊過了。' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });

  const sessionUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  const token = await signSession(sessionUser);

  const response = NextResponse.json({ user: sessionUser }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
