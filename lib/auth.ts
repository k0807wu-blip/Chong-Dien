import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SESSION_COOKIE, verifySessionToken, type SessionUser } from '@/lib/auth-edge';

export type { SessionUser };
export { SESSION_COOKIE, signSession, sessionCookieOptions, verifySessionToken } from '@/lib/auth-edge';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
