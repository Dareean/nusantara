import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmailAsync, verifyAndMigratePassword, createSessionForUser, isAdminEmail, isJuryEmail } from '../../../auth/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await getUserByEmailAsync(email);
    if (!user) return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });

    const isValid = verifyAndMigratePassword(user, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Kata sandi salah' }, { status: 401 });
    }

    const sessionId = createSessionForUser({ name: user.name, email: user.email });
    const isJury = isJuryEmail(user.email);
    const isUserAdmin = isAdminEmail(user.email) || isJury;
    const res = NextResponse.json({
      ok: true,
      email: user.email,
      name: user.name,
      isAdmin: isUserAdmin,
      isJury,
    });
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
