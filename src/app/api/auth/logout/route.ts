import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '../../../auth/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get('laras_session');
    const sessionId = cookie?.value;
    if (sessionId) destroySession(sessionId);
    const res = NextResponse.json({ ok: true });
    // clear cookie
    res.cookies.set('laras_session', '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
