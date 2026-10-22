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
    // Bersihkan parameter internal Next.js seperti _rsc sebelum dijadikan target redirect
    const cleanSearch = new URLSearchParams(req.nextUrl.search);
    cleanSearch.delete('_rsc');
    const searchStr = cleanSearch.toString();
    const destination = req.nextUrl.pathname + (searchStr ? `?${searchStr}` : '');
    loginUrl.searchParams.set('redirect', destination);

    const response = NextResponse.redirect(loginUrl);
    // Cegah client-side router (prefetch) meng-cache respons redirect ke /auth
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  };

  // Cek cookie sesi
  const rawCookie = req.cookies.get('laras_session')?.value;
  if (!rawCookie) {
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

  const cookie = rawCookie.includes('%') ? decodeURIComponent(rawCookie) : rawCookie;

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
    // Jika ada redirect aman dan valid, langsung antarkan pengguna ke rute tersebut
    if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
      return NextResponse.redirect(new URL(redirectParam, req.url));
    }
    // Bila tidak ada redirect khusus, arahkan ke tujuan bawaan role
    return NextResponse.redirect(new URL(userIsAdmin ? '/admin' : '/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/admin', '/auth'],
};
