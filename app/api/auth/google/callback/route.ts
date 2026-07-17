import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

const STATE_COOKIE = 'google_oauth_state';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const cookieState = request.cookies.get(STATE_COOKIE)?.value;

  function failRedirect(reason: string) {
    const res = NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(reason)}`);
    res.cookies.set(STATE_COOKIE, '', { path: '/', maxAge: 0 });
    return res;
  }

  if (!code || !state || !cookieState || state !== cookieState) {
    return failRedirect('google_state_mismatch');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return failRedirect('google_not_configured');
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const client = new OAuth2Client({ clientId, clientSecret, redirectUri });

  let idToken: string | undefined;
  try {
    const { tokens } = await client.getToken({ code, redirect_uri: redirectUri });
    idToken = tokens.id_token ?? undefined;
  } catch {
    return failRedirect('google_token_exchange_failed');
  }
  if (!idToken) return failRedirect('google_no_id_token');

  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    payload = ticket.getPayload();
  } catch {
    return failRedirect('google_invalid_id_token');
  }

  if (!payload?.email || payload.email_verified !== true || !payload.sub) {
    return failRedirect('google_email_not_verified');
  }

  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name ?? email.split('@')[0];

  let user = await prisma.user.findUnique({ where: { googleId } });
  if (!user) {
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    user = existingByEmail
      ? await prisma.user.update({ where: { id: existingByEmail.id }, data: { googleId } })
      : await prisma.user.create({ data: { email, name, googleId, passwordHash: null } });
  }

  const sessionUser = { id: user.id, email: user.email, name: user.name };
  const token = await signSession(sessionUser);

  const response = NextResponse.redirect(`${origin}/account`);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  response.cookies.set(STATE_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
