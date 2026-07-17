import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const STATE_COOKIE = 'google_oauth_state';

export async function GET(request: NextRequest) {
  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return response;
}
