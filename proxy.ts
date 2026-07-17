import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth-edge';

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (!user || (isAdminPath && user.role !== 'ADMIN')) {
    const loginUrl = new URL(isAdminPath ? '/admin/login' : '/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
