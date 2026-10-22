import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, hashPassword, createSessionForUser, isAdminEmail } from '../../../auth/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });

    const hashed = hashPassword(password);
    if (hashed !== user.passwordHash) {
      return NextResponse.json({ error: 'Kata sandi salah' }, { status: 401 });
    }

    const sessionId = createSessionForUser({ name: user.name, email: user.email });
    const isUserAdmin = isAdminEmail(user.email);
    const res = NextResponse.json({ ok: true, email: user.email, name: user.name, isAdmin: isUserAdmin });
    res.cookies.set('laras_session', sessionId, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
