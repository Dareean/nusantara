import { NextResponse } from 'next/server';
import { getEnvVar } from '../../../auth/serverAuth';

export async function GET() {
  const email =
    getEnvVar('JURY_ADMIN_EMAIL') ||
    getEnvVar('NEXT_PUBLIC_JURY_ADMIN_EMAIL');
  const password =
    getEnvVar('JURY_ADMIN_PASSWORD') ||
    getEnvVar('NEXT_PUBLIC_JURY_ADMIN_PASSWORD');

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
