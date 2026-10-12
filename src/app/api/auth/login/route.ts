import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserByEmail, hashPassword, createSessionForUser, addUser } from '../../../auth/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Mohon masukkan email dan kata sandi' }, { status: 400 });
    }

    const normEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // 1. Attempt login via Supabase Auth
    try {
      const supabase = await createClient();
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: normEmail,
        password: cleanPassword,
      });

      if (!signInError && authData.user) {
        const userName = authData.user.user_metadata?.name || normEmail.split('@')[0];
        const sessionId = createSessionForUser({ name: userName, email: normEmail });
        addUser(userName, normEmail, cleanPassword);

        const res = NextResponse.json({
          ok: true,
          email: normEmail,
          name: userName,
          supabaseId: authData.user.id,
        });
        res.cookies.set('laras_session', sessionId, { httpOnly: true, path: '/', sameSite: 'lax' });
        return res;
      }
    } catch (sbErr) {
      console.warn('Supabase signIn attempt warning:', sbErr);
    }

    // 2. Fallback to local accounts (e.g. demo account)
    const localUser = getUserByEmail(normEmail);
    if (localUser) {
      const hashed = hashPassword(cleanPassword);
      const isDemoMatch = normEmail === 'demo@gmail.com' && (cleanPassword === 'demo@123' || cleanPassword === 'demo123' || cleanPassword === 'demo');

      if (hashed === localUser.passwordHash || isDemoMatch) {
        // Also register/sync demo user into Supabase in background
        try {
          const admin = createAdminClient();
          await admin.auth.admin.createUser({
            email: normEmail,
            password: cleanPassword,
            user_metadata: { name: localUser.name },
            email_confirm: true,
          });
          const supabase = await createClient();
          await supabase.auth.signInWithPassword({ email: normEmail, password: cleanPassword });
        } catch {
          // Ignore if already exists in Supabase
        }

        const sessionId = createSessionForUser({ name: localUser.name, email: localUser.email });
        const res = NextResponse.json({ ok: true, email: localUser.email, name: localUser.name });
        res.cookies.set('laras_session', sessionId, { httpOnly: true, path: '/', sameSite: 'lax' });
        return res;
      }

      return NextResponse.json({
        error: 'Kata sandi salah. Silakan periksa kembali atau gunakan Akun Demo (demo@gmail.com / demo@123).',
      }, { status: 401 });
    }

    return NextResponse.json({
      error: 'Akun belum terdaftar di Supabase. Silakan klik tab "Daftar Baru" di atas untuk mendaftar.',
    }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
