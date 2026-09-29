import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect dashboard routes: require valid laras_session cookie
export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Only enforce on dashboard paths
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();

  // Allow API and static assets under dashboard (if any) - but normally fine
  // Check cookie
  const cookie = req.cookies.get('laras_session')?.value;
  if (!cookie) {
    const loginUrl = new URL('/auth', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Validate session by calling internal session endpoint
  try {
    const origin = req.nextUrl.origin;
    const resp = await fetch(`${origin}/api/auth/session`, {
      headers: { cookie: `laras_session=${cookie}` },
      // avoid caching
      cache: 'no-store',
    });
    if (!resp.ok) {
      const loginUrl = new URL('/auth', req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    const data = await resp.json();
    if (data?.ok) return NextResponse.next();
  } catch (err) {
    // on error, redirect to login
    const loginUrl = new URL('/auth', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  const loginUrl = new URL('/auth', req.url);
  loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
