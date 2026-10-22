import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/auth/sessionToken';

// Daftar email admin (selaras dengan ADMIN_EMAILS di src/app/auth/serverAuth.ts)
const ADMIN_EMAILS = ['admin@laras.id'];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAuth = pathname === '/auth' || pathname.startsWith('/auth/');

  // Hanya proteksi rute /dashboard, /admin, dan /auth
  if (!isDashboard && !isAdmin && !isAuth) return NextResponse.next();

  const redirectToLogin = () => {
    const loginUrl = new URL('/auth', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  };

  // Cek cookie sesi
  const cookie = req.cookies.get('laras_session')?.value;
  if (!cookie) {
    const nextAuthCookie =
      req.cookies.get('next-auth.session-token')?.value ||
      req.cookies.get('__Secure-next-auth.session-token')?.value;

    if (nextAuthCookie && (isDashboard || isAdmin)) {
      const syncUrl = new URL('/api/auth/oauth-sync', req.url);
      syncUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(syncUrl);
    }

    if (isDashboard || isAdmin) {
      return redirectToLogin();
    }
    return NextResponse.next();
  }

  // Validasi sesi secara lokal dan stateless (HMAC-SHA256) — tanpa fetch internal ke /api/auth/session!
  const session = await verifySessionToken(cookie);
  if (!session) {
    if (isDashboard || isAdmin) return redirectToLogin();
    return NextResponse.next();
  }

  const email = session.email?.toLowerCase().trim();
  const userIsAdmin = Boolean(session.isAdmin || (email && ADMIN_EMAILS.includes(email)));

  // Jika rute admin:
  // Pengguna yang sudah login tapi BUKAN admin diarahkan ke /dashboard (bukan ke /auth)
  if (isAdmin) {
    if (!userIsAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Jika pengguna yang SUDAH login membuka /auth:
  if (isAuth) {
    const redirectParam = nextUrl.searchParams.get('redirect');
    const isAdminRedirect = redirectParam === '/admin' || (redirectParam && redirectParam.startsWith('/admin/'));
    // Bila redirect menunjuk ke area admin tapi role bukan admin -> buang redirect dan arahkan ke /dashboard
    if (isAdminRedirect && !userIsAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Bila tidak ada redirect khusus atau redirect aman, arahkan ke tujuan bawaan role
    if (!redirectParam) {
      return NextResponse.redirect(new URL(userIsAdmin ? '/admin' : '/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/admin', '/auth'],
};
