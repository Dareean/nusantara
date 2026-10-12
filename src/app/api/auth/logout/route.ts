import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { destroySession } from '../../../auth/serverAuth';

export async function POST(req: NextRequest) {
  try {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {}

    const cookie = req.cookies.get('laras_session');
    const sessionId = cookie?.value;
    if (sessionId) destroySession(sessionId);

    const res = NextResponse.json({ ok: true });
    res.cookies.set('laras_session', '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
