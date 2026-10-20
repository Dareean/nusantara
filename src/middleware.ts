import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Daftar email admin (selaras dengan ADMIN_EMAILS di src/app/auth/serverAuth.ts)
const ADMIN_EMAILS = ['admin@laras.id'];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  // Hanya proteksi rute /dashboard dan /admin
  if (!isDashboard && !isAdmin) return NextResponse.next();

  const redirectToLogin = () => {
    const loginUrl = new URL('/auth', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  };

  // Cek cookie sesi
  const cookie = req.cookies.get('laras_session')?.value;
  if (!cookie) {
    return redirectToLogin();
  }

  // Validasi sesi dengan memanggil internal session endpoint
  try {
    const origin = req.nextUrl.origin;
    const resp = await fetch(`${origin}/api/auth/session`, {
      headers: { cookie: `laras_session=${cookie}` },
      cache: 'no-store',
    });
    if (!resp.ok) {
      return redirectToLogin();
    }
    const data = await resp.json();
    if (!data?.ok || !data?.session) {
      return redirectToLogin();
    }

    // Jika rute admin, wajib memiliki email yang terdaftar sebagai admin
    if (isAdmin) {
      const email = data.session.email;
      if (!email || !ADMIN_EMAILS.includes(email)) {
        return redirectToLogin();
      }
    }

    return NextResponse.next();
  } catch (err) {
    // on error, redirect to login
    return redirectToLogin();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/admin'],
};
