import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../auth/serverAuth';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('laras_session');
    const sessionId = cookie?.value;
    const data = getSession(sessionId);
    if (!data) return NextResponse.json({ ok: false, session: null });
    return NextResponse.json({ ok: true, session: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
