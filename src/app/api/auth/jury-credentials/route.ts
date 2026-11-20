import { NextResponse } from 'next/server';
import { getEnvVar } from '../../../auth/serverAuth';

export async function GET() {
  const isProd = process.env.NODE_ENV === 'production';
  const email =
    getEnvVar('JURY_ADMIN_EMAIL') ||
    getEnvVar('NEXT_PUBLIC_JURY_ADMIN_EMAIL') ||
    (!isProd ? 'juri@laras.id' : undefined);
  const password =
    getEnvVar('JURY_ADMIN_PASSWORD') ||
    getEnvVar('NEXT_PUBLIC_JURY_ADMIN_PASSWORD') ||
    (!isProd ? 'juri-laras-2026' : undefined);

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Kredensial juri belum disetel di variabel lingkungan.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    email,
    password,
    role: 'admin_jury',
  });
}
