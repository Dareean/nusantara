import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '../../../auth/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get('laras_session');
    const sessionId = cookie?.value;
    if (sessionId) destroySession(sessionId);
    const res = NextResponse.json({ ok: true });
    // clear cookie
    res.cookies.set('laras_session', '', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
