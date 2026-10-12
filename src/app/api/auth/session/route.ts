import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '../../../auth/serverAuth';

export async function GET(req: NextRequest) {
  try {
    // 1. Check Supabase Auth user
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        return NextResponse.json({
          ok: true,
          session: {
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0],
          },
        });
      }
    } catch (sbErr) {
      // Fallback
    }

    // 2. Fallback to local cookie session
    const cookie = req.cookies.get('laras_session');
    const sessionId = cookie?.value;
    const data = getSession(sessionId);
    if (!data) return NextResponse.json({ ok: false, session: null });
    return NextResponse.json({ ok: true, session: data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
