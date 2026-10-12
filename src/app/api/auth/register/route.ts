import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { addUser, createSessionForUser } from '../../../auth/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Mohon isi semua field' }, { status: 400 });
    }

    const normEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();
    const cleanName = String(name).trim();

    // 1. Create user in Supabase Auth via Admin Client (autoconfirmed)
    let supabaseUserId: string | null = null;
    try {
      const admin = createAdminClient();
      const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
        email: normEmail,
        password: cleanPassword,
        user_metadata: { name: cleanName },
        email_confirm: true,
      });

      if (createError) {
        if (createError.message.toLowerCase().includes('already') || createError.status === 422) {
          return NextResponse.json({ error: 'Email sudah terdaftar di Supabase' }, { status: 409 });
        }
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }

      supabaseUserId = createdUser.user?.id ?? null;
    } catch (sbErr) {
      console.warn('Supabase admin create error:', sbErr);
    }

    // 2. Establish session in Supabase via SSR client
    try {
      const supabase = await createClient();
      await supabase.auth.signInWithPassword({
        email: normEmail,
        password: cleanPassword,
      });
    } catch (signInErr) {
      console.warn('Supabase SSR signIn error:', signInErr);
    }

    // 3. Maintain local store & cookie for compatibility
    addUser(cleanName, normEmail, cleanPassword);
    const sessionId = createSessionForUser({ name: cleanName, email: normEmail });

    const res = NextResponse.json({
      ok: true,
      email: normEmail,
      name: cleanName,
      supabaseId: supabaseUserId,
    });
    res.cookies.set('laras_session', sessionId, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
