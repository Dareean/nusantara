import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdminEmail, isJuryEmail, ensureOAuthUser, createSessionForUser } from '../../../auth/serverAuth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('laras_session');
    const sessionId = cookie?.value;
    let data = getSession(sessionId);

    // If laras_session is missing, check NextAuth session fallback
    if (!data) {
      try {
        const nextSession = await getServerSession(authOptions);
        if (nextSession?.user?.email) {
          const email = nextSession.user.email.toLowerCase().trim();
          const name = nextSession.user.name || email.split('@')[0];
          ensureOAuthUser({ email, name });
          const newSessionId = createSessionForUser({ email, name });
          data = getSession(newSessionId);

          const res = NextResponse.json({
            ok: true,
            session: {
              ...data,
              isAdmin: isAdminEmail(email),
            },
          });
          res.cookies.set('laras_session', newSessionId, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
          });
          return res;
        }
      } catch {
        // Ignore fallback errors and return null session
      }
      return NextResponse.json({ ok: false, session: null });
    }

    const isJury = isJuryEmail(data.email) || Boolean(data.isJury);
    return NextResponse.json({
      ok: true,
      session: {
        ...data,
        isJury,
        isAdmin: isAdminEmail(data.email) || isJury,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
