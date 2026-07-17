import { SignJWT, jwtVerify } from 'jose';

export type Role = 'MEMBER' | 'ADMIN';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export const SESSION_COOKIE = 'chongdien_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 天

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT_SECRET environment variable');
  return new TextEncoder().encode(secret);
}

function isRole(value: unknown): value is Role {
  return value === 'MEMBER' || value === 'ADMIN';
}

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      !payload.sub ||
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string' ||
      !isRole(payload.role)
    ) {
      return null;
    }
    return { id: payload.sub, email: payload.email, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
