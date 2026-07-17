import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth-edge';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|images).*)'],
};

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const isAdminHost = hostname.startsWith('admin.');
  const { pathname } = request.nextUrl;

  // Route handlers enforce their own auth (see app/api/admin/orders/[id]/route.ts),
  // and /api/auth/* is shared by both hosts — never rewrite or gate API routes here.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (isAdminHost) {
    // Map the clean external path to the actual /admin/* file tree. A path that's
    // already /admin/* (e.g. our own redirect target below) passes through as-is
    // so we don't double-prefix it.
    const targetPath = pathname.startsWith('/admin')
      ? pathname
      : `/admin${pathname === '/' ? '/orders' : pathname}`;

    const isLoginPath = targetPath === '/admin/login';

    if (!isLoginPath) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      const user = token ? await verifySessionToken(token) : null;
      if (!user || user.role !== 'ADMIN') {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.search = '';
        return NextResponse.redirect(loginUrl);
      }
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = targetPath;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Main domain: the admin file tree is unreachable here — don't even reveal
  // that it exists via a login redirect, just 404.
  if (pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname.startsWith('/account')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const user = token ? await verifySessionToken(token) : null;
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
