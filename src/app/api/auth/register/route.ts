import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, addUser, createSessionForUser, isAdminEmail } from '../../../auth/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (getUserByEmail(email)) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    addUser(name, email, password);
    const sessionId = createSessionForUser({ name, email });
    const isUserAdmin = isAdminEmail(email);

    const res = NextResponse.json({ ok: true, email, name, isAdmin: isUserAdmin });
    res.cookies.set('laras_session', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
