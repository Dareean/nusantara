import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  createSessionTokenSync,
  verifySessionTokenSync,
  DEFAULT_SESSION_TTL,
} from '@/lib/auth/sessionToken';
import { createAdminClient } from '@/lib/supabase/admin';

export { DEFAULT_SESSION_TTL };

export type User = {
  name: string;
  email: string;
  passwordHash: string;
  isAdmin?: boolean;
  isJury?: boolean;
  avatarUrl?: string;
};

export type SessionEntry = {
  email: string;
  name: string;
  isAdmin: boolean;
  isJury?: boolean;
  avatarUrl?: string;
  createdAt: number;
  expiresAt: number;
};

const STORE_FILENAME = path.join(process.cwd(), 'laras_auth_store.json');

export function getEnvVar(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
      if (match) {
        const val = match[1].trim().replace(/^['"](.*)['"]$/, '$1');
        process.env[key] = val;
        return val;
      }
    }
  } catch {}
  return undefined;
}

export function getAdminEmails(): string[] {
  const adminEnv = getEnvVar('LARAS_ADMIN_EMAIL');
  const juryEnv = getEnvVar('JURY_ADMIN_EMAIL');
  return [
    'admin@laras.id',
    ...(adminEnv ? [adminEnv.toLowerCase().trim()] : []),
    ...(juryEnv ? [juryEnv.toLowerCase().trim()] : ['juri@laras.id']),
  ];
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase().trim());
}

export function isJuryEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const juryEmail = (getEnvVar('JURY_ADMIN_EMAIL') || 'juri@laras.id').toLowerCase().trim();
  return email.toLowerCase().trim() === juryEmail;
}

export function isJuryReadOnly(session: SessionEntry | null | undefined): boolean {
  if (!session) return false;
  return Boolean(session.isJury || isJuryEmail(session.email));
}

/**
 * Hash kata sandi dengan format salted modern: s1$<salt>$<hash>
 */
export function hashPassword(password: string, customSalt?: string): string {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(salt + ':' + password).digest('hex');
  return `s1$${salt}$${hash}`;
}

/**
 * Verifikasi kata sandi dengan dukungan migrasi transparan dari SHA-256 polos ke salted hash
 */
export function verifyPassword(
  password: string,
  storedHash: string
): { valid: boolean; needsMigration: boolean } {
  if (!storedHash || typeof storedHash !== 'string') {
    return { valid: false, needsMigration: false };
  }

  // Format baru: s1$<salt>$<hash>
  if (storedHash.startsWith('s1$')) {
    const parts = storedHash.split('$');
    if (parts.length === 3) {
      const [, salt, expectedHash] = parts;
      const actualHash = crypto.createHash('sha256').update(salt + ':' + password).digest('hex');
      return { valid: actualHash === expectedHash, needsMigration: false };
    }
    return { valid: false, needsMigration: false };
  }

  // Format lama: SHA-256 polos tanpa salt (64 hex characters)
  if (/^[0-9a-f]{64}$/i.test(storedHash)) {
    const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
    if (legacyHash.toLowerCase() === storedHash.toLowerCase()) {
      return { valid: true, needsMigration: true };
    }
  }

  return { valid: false, needsMigration: false };
}

/**
 * Seed accounts are generated from environment variables with safe, canonical fallbacks.
 * This guarantees that even if environment variables are not populated on serverless redeploys,
 * demo, admin, and jury accounts can always authenticate without failure.
 */
export function getSeedUsers(): Record<string, User> {
  const seeds: Record<string, User> = {};

  const demoEmail = (getEnvVar('LARAS_DEMO_EMAIL') || 'demo@gmail.com').toLowerCase().trim();
  const demoPass = getEnvVar('LARAS_DEMO_PASSWORD') || 'demo123';
  seeds[demoEmail] = {
    name: 'Demo User',
    email: demoEmail,
    passwordHash: hashPassword(demoPass),
    isAdmin: false,
    isJury: false,
  };

  const adminEmail = (getEnvVar('LARAS_ADMIN_EMAIL') || 'admin@laras.id').toLowerCase().trim();
  const adminPass = getEnvVar('LARAS_ADMIN_PASSWORD') || 'admin123';
  seeds[adminEmail] = {
    name: 'Admin LARAS',
    email: adminEmail,
    passwordHash: hashPassword(adminPass),
    isAdmin: true,
    isJury: false,
  };

  const juryEmail = (getEnvVar('JURY_ADMIN_EMAIL') || 'juri@laras.id').toLowerCase().trim();
  const juryPass = getEnvVar('JURY_ADMIN_PASSWORD') || 'juri-laras-2026';
  seeds[juryEmail] = {
    name: 'Admin Juri',
    email: juryEmail,
    passwordHash: hashPassword(juryPass),
    isAdmin: true,
    isJury: true,
  };

  return seeds;
}

// In-memory map for dynamically registered users, backed by local file fallback & Supabase
export const users: Map<string, User> = new Map();

function loadStore() {
  try {
    if (!fs.existsSync(STORE_FILENAME)) return;
    const raw = fs.readFileSync(STORE_FILENAME, 'utf8');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.users) {
      Object.keys(parsed.users).forEach((email) => {
        const u = parsed.users[email];
        users.set(email.toLowerCase(), {
          name: u.name,
          email: email.toLowerCase(),
          passwordHash: u.passwordHash,
          avatarUrl: u.avatarUrl || '',
          isAdmin: isAdminEmail(email),
          isJury: isJuryEmail(email),
        });
      });
    }
  } catch (err) {
    console.warn('Failed to load user store:', err);
  }
}

function saveStore() {
  try {
    const payload = {
      users: Object.fromEntries(
        Array.from(users.entries()).map(([email, u]) => [
          email,
          { name: u.name, passwordHash: u.passwordHash, avatarUrl: u.avatarUrl || '' },
        ])
      ),
    };
    const tmp = STORE_FILENAME + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), 'utf8');
    fs.renameSync(tmp, STORE_FILENAME);
  } catch (err) {
    console.warn('Failed to save user store:', err);
  }
}

// Initialize dynamic user store from local disk
loadStore();

/**
 * Persist user credentials to Supabase user_progress (_auth payload)
 * so that registered accounts and seed accounts survive redeployments.
 */
export async function saveUserToSupabase(user: User): Promise<boolean> {
  const normalized = user.email.toLowerCase().trim();
  try {
    const admin = createAdminClient();
    const { data: existingRow } = await admin
      .from('user_progress')
      .select('progress')
      .eq('email', normalized)
      .maybeSingle();

    const existingProgress = (existingRow?.progress as Record<string, unknown>) || {};
    const updatedProgress = {
      ...existingProgress,
      _auth: {
        name: user.name,
        email: normalized,
        passwordHash: user.passwordHash,
        isAdmin: Boolean(user.isAdmin || isAdminEmail(normalized)),
        isJury: Boolean(user.isJury || isJuryEmail(normalized)),
        avatarUrl: user.avatarUrl || '',
      },
    };

    const { error } = await admin.from('user_progress').upsert(
      {
        email: normalized,
        progress: updatedProgress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

    if (error) {
      console.warn('[AUTH] Gagal menyimpan user ke Supabase user_progress:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[AUTH] Exception saat menyimpan user ke Supabase:', err);
    return false;
  }
}

/**
 * Fetch user credentials from Supabase user_progress (_auth payload)
 */
export async function fetchUserFromSupabase(email: string): Promise<User | undefined> {
  const normalized = email.toLowerCase().trim();
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('user_progress')
      .select('email, progress')
      .eq('email', normalized)
      .maybeSingle();

    if (error || !data || !data.progress) return undefined;
    const auth = (data.progress as Record<string, unknown>)._auth as Record<string, unknown> | undefined;
    if (auth && typeof auth.passwordHash === 'string') {
      const user: User = {
        name: typeof auth.name === 'string' ? auth.name : normalized.split('@')[0],
        email: normalized,
        passwordHash: auth.passwordHash,
        isAdmin: Boolean(auth.isAdmin || isAdminEmail(normalized)),
        isJury: Boolean(auth.isJury || isJuryEmail(normalized)),
        avatarUrl: typeof auth.avatarUrl === 'string' ? auth.avatarUrl : '',
      };
      // Cache in-memory
      users.set(normalized, user);
      return user;
    }
  } catch (err) {
    console.warn('[AUTH] Supabase fetch user error:', err);
  }
  return undefined;
}

export function addUser(name: string, email: string, password: string) {
  const normalized = email.toLowerCase().trim();
  const passwordHash = hashPassword(password);
  const user: User = {
    name,
    email: normalized,
    passwordHash,
    isAdmin: isAdminEmail(normalized),
    isJury: isJuryEmail(normalized),
  };
  users.set(normalized, user);
  saveStore();
  saveUserToSupabase(user).catch((err) => {
    console.warn('[AUTH] Background saveUserToSupabase error:', err);
  });
}

export async function addUserAsync(name: string, email: string, password: string): Promise<User> {
  const normalized = email.toLowerCase().trim();
  const passwordHash = hashPassword(password);
  const user: User = {
    name,
    email: normalized,
    passwordHash,
    isAdmin: isAdminEmail(normalized),
    isJury: isJuryEmail(normalized),
  };
  users.set(normalized, user);
  saveStore();
  await saveUserToSupabase(user);
  return user;
}

export function ensureOAuthUser(user: { name: string; email: string }) {
  const normalized = user.email.toLowerCase().trim();
  const existing = getUserByEmail(normalized);
  if (!existing) {
    const dummyHash = hashPassword(crypto.randomBytes(16).toString('hex'));
    const newUser: User = {
      name: user.name || normalized.split('@')[0],
      email: normalized,
      passwordHash: dummyHash,
      isAdmin: isAdminEmail(normalized),
      isJury: isJuryEmail(normalized),
    };
    users.set(normalized, newUser);
    saveStore();
    saveUserToSupabase(newUser).catch(() => {});
  } else if (!existing.name && user.name) {
    existing.name = user.name;
    saveStore();
    saveUserToSupabase(existing).catch(() => {});
  }
}

/**
 * Synchronous user lookup (checks in-memory cache and seed users)
 */
export function getUserByEmail(email: string | null | undefined): User | undefined {
  if (!email) return undefined;
  const normalized = email.toLowerCase().trim();
  if (users.has(normalized)) {
    return users.get(normalized);
  }
  const seeds = getSeedUsers();
  if (seeds[normalized]) {
    return seeds[normalized];
  }
  return undefined;
}

/**
 * Asynchronous user lookup: checks in-memory cache, then Supabase persistent store,
 * and falls back to seed users (idempotently provisioning them).
 */
export async function getUserByEmailAsync(email: string | null | undefined): Promise<User | undefined> {
  if (!email) return undefined;
  const normalized = email.toLowerCase().trim();

  // 1. In-memory map (loaded from local store or previous fetch)
  if (users.has(normalized)) {
    return users.get(normalized);
  }

  // 2. Persistent Supabase user_progress
  const fromDb = await fetchUserFromSupabase(normalized);
  if (fromDb) {
    return fromDb;
  }

  // 3. Fallback to seed users (demo, admin, juri with canonical defaults)
  const seeds = getSeedUsers();
  if (seeds[normalized]) {
    const seed = seeds[normalized];
    users.set(normalized, seed);
    saveUserToSupabase(seed).catch(() => {});
    return seed;
  }

  return undefined;
}

/**
 * Verifikasi kata sandi dan migrasikan secara transparan jika masih format lama
 */
export function verifyAndMigratePassword(user: User, password: string): boolean {
  const verification = verifyPassword(password, user.passwordHash);
  if (!verification.valid) {
    return false;
  }

  if (verification.needsMigration) {
    const newHash = hashPassword(password);
    user.passwordHash = newHash;
    users.set(user.email.toLowerCase(), user);
    saveStore();
    saveUserToSupabase(user).catch(() => {});
  }

  return true;
}

/**
 * Creates a stateless signed session token (HMAC-SHA256).
 * Contains { email, name, isAdmin, isJury, avatarUrl, exp, iat }.
 */
export function createSessionForUser(
  user: { name: string; email: string; avatarUrl?: string },
  ttlMs: number = DEFAULT_SESSION_TTL
): string {
  const normalizedEmail = user.email.toLowerCase().trim();
  const isJury = isJuryEmail(normalizedEmail);
  const isUserAdmin = isAdminEmail(normalizedEmail) || isJury;
  const existing = getUserByEmail(normalizedEmail);
  const avatarUrl = user.avatarUrl !== undefined ? user.avatarUrl : (existing?.avatarUrl || '');

  return createSessionTokenSync(
    {
      email: normalizedEmail,
      name: user.name,
      isAdmin: isUserAdmin,
      isJury,
      avatarUrl,
    },
    ttlMs
  );
}

/**
 * Validates the stateless signed token locally.
 * Returns SessionEntry or null. No cross-instance store required!
 */
export function getSession(sessionId: string | null | undefined): SessionEntry | null {
  if (!sessionId) return null;
  const payload = verifySessionTokenSync(sessionId);
  if (!payload) return null;

  const normalized = payload.email.toLowerCase().trim();
  const existing = getUserByEmail(normalized);
  const avatarUrl = payload.avatarUrl || existing?.avatarUrl || '';
  const isJury = Boolean(payload.isJury || isJuryEmail(normalized));
  const isUserAdmin = Boolean(payload.isAdmin || isAdminEmail(normalized) || isJury);

  return {
    email: payload.email,
    name: existing?.name || payload.name,
    isAdmin: isUserAdmin,
    isJury,
    avatarUrl,
    createdAt: payload.iat,
    expiresAt: payload.exp,
  };
}

/**
 * In stateless sessions, logout clears the cookie.
 */
export function destroySession(sessionId: string | null | undefined): boolean {
  return Boolean(sessionId);
}

/**
 * Memperbarui data profil pengguna (nama, avatar, password)
 * dan mensinkronisasikan ke Supabase table `public.user_profiles`
 */
export async function updateUserProfile(
  email: string,
  updates: { name?: string; newPassword?: string; currentPassword?: string; avatarUrl?: string }
): Promise<{ success: boolean; error?: string; user?: { name: string; email: string; avatarUrl?: string } }> {
  const normalized = email.toLowerCase().trim();
  const existing = getUserByEmail(normalized);

  // Jika ada permintaan ubah kata sandi
  if (updates.newPassword) {
    if (updates.newPassword.length < 6) {
      return { success: false, error: 'Kata sandi baru minimal 6 karakter.' };
    }
    // Jika akun sudah memiliki kata sandi aktif, verifikasi kata sandi saat ini wajib diisi dan cocok
    if (existing && existing.passwordHash) {
      if (!updates.currentPassword) {
        return { success: false, error: 'Kata sandi saat ini wajib diisi untuk mengubah kata sandi.' };
      }
      const check = verifyPassword(updates.currentPassword, existing.passwordHash);
      if (!check.valid) {
        return { success: false, error: 'Kata sandi saat ini keliru.' };
      }
    }
  }

  const updatedName = updates.name?.trim() || existing?.name || normalized.split('@')[0];
  const updatedAvatar = updates.avatarUrl !== undefined ? updates.avatarUrl : (existing?.avatarUrl || '');
  const updatedPasswordHash = updates.newPassword ? hashPassword(updates.newPassword) : existing?.passwordHash || '';

  const updatedUser: User = {
    name: updatedName,
    email: normalized,
    passwordHash: updatedPasswordHash,
    isAdmin: isAdminEmail(normalized),
    isJury: isJuryEmail(normalized),
    avatarUrl: updatedAvatar,
  };

  // 1. Perbarui penyimpanan lokal (in-memory & json file)
  users.set(normalized, updatedUser);
  saveStore();

  // 2. Sinkronkan ke Supabase user_progress (_auth)
  await saveUserToSupabase(updatedUser);

  // 3. Sinkronkan ke database Supabase (tabel public.user_profiles jika ada)
  try {
    const admin = createAdminClient();
    const { error: sbErr } = await admin.from('user_profiles').upsert(
      {
        email: normalized,
        name: updatedName,
        password_hash: updatedPasswordHash,
        avatar_url: updatedAvatar,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );
    if (sbErr) {
      console.warn('Catatan: tabel user_profiles di Supabase belum dibuat atau gagal upsert:', sbErr.message);
    }
  } catch (err) {
    console.warn('Koneksi database user_profiles Supabase:', err);
  }

  return {
    success: true,
    user: {
      name: updatedName,
      email: normalized,
      avatarUrl: updatedAvatar,
    },
  };
}

export async function getUserProfile(email: string) {
  const normalized = email.toLowerCase().trim();
  let name = normalized.split('@')[0];
  let avatarUrl = '';
  let hasPassword = false;

  // 1. Coba baca dari Supabase user_profiles
  try {
    const admin = createAdminClient();
    const { data } = await admin.from('user_profiles').select('*').eq('email', normalized).maybeSingle();
    if (data) {
      if (data.name) name = data.name;
      if (data.avatar_url) avatarUrl = data.avatar_url;
      hasPassword = Boolean(data.password_hash);
    }
  } catch {}

  // 2. Baca dari store lokal / Supabase user_progress (_auth)
  const local = getUserByEmail(normalized) || (await fetchUserFromSupabase(normalized));
  if (local) {
    name = local.name || name;
    avatarUrl = local.avatarUrl || avatarUrl;
    hasPassword = Boolean(local.passwordHash) || hasPassword;
  }

  return {
    email: normalized,
    name,
    avatarUrl,
    hasPassword,
    isAdmin: isAdminEmail(normalized),
    isJury: isJuryEmail(normalized),
  };
}
