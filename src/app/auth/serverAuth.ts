import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  createSessionTokenSync,
  verifySessionTokenSync,
  DEFAULT_SESSION_TTL,
} from '@/lib/auth/sessionToken';

export { DEFAULT_SESSION_TTL };

type User = { name: string; email: string; passwordHash: string; isAdmin?: boolean };

export type SessionEntry = {
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: number;
  expiresAt: number;
};

const STORE_FILENAME = path.join(process.cwd(), 'laras_auth_store.json');

export const ADMIN_EMAILS = ['admin@laras.id'];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Seed accounts are hardcoded and deterministic across all serverless instances
export const SEED_USERS: Record<string, User> = {
  'demo@gmail.com': {
    name: 'Demo User',
    email: 'demo@gmail.com',
    passwordHash: hashPassword('demo123'),
    isAdmin: false,
  },
  'admin@laras.id': {
    name: 'Admin LARAS',
    email: 'admin@laras.id',
    passwordHash: hashPassword('admin123'),
    isAdmin: true,
  },
};

// In-memory map for dynamically registered users, backed by local file fallback
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
          isAdmin: isAdminEmail(email),
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
          { name: u.name, passwordHash: u.passwordHash },
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

// Initialize dynamic user store
loadStore();

export function addUser(name: string, email: string, password: string) {
  const normalized = email.toLowerCase().trim();
  const passwordHash = hashPassword(password);
  users.set(normalized, { name, email: normalized, passwordHash, isAdmin: isAdminEmail(normalized) });
  saveStore();
}

export function getUserByEmail(email: string | null | undefined): User | undefined {
  if (!email) return undefined;
  const normalized = email.toLowerCase().trim();
  if (SEED_USERS[normalized]) {
    return SEED_USERS[normalized];
  }
  return users.get(normalized);
}

/**
 * Creates a stateless signed session token (HMAC-SHA256).
 * Contains { email, name, isAdmin, exp, iat }.
 */
export function createSessionForUser(
  user: { name: string; email: string },
  ttlMs: number = DEFAULT_SESSION_TTL
): string {
  const normalizedEmail = user.email.toLowerCase().trim();
  const isUserAdmin = isAdminEmail(normalizedEmail);
  return createSessionTokenSync(
    {
      email: normalizedEmail,
      name: user.name,
      isAdmin: isUserAdmin,
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

  return {
    email: payload.email,
    name: payload.name,
    isAdmin: Boolean(payload.isAdmin || isAdminEmail(payload.email)),
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
