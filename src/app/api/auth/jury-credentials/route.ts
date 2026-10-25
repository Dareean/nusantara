import { NextResponse } from 'next/server';
import { getEnvVar } from '../../../auth/serverAuth';

export async function GET() {
  const email =
    getEnvVar('JURY_ADMIN_EMAIL') ||
    getEnvVar('NEXT_PUBLIC_JURY_ADMIN_EMAIL') ||
    'juri@laras.id';
  const password =
    getEnvVar('JURY_ADMIN_PASSWORD') ||
    getEnvVar('NEXT_PUBLIC_JURY_ADMIN_PASSWORD') ||
    'juri-laras-2026';

  return NextResponse.json({
    email,
    password,
    role: 'admin_jury',
  });
}
