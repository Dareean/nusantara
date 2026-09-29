import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

type User = { name: string; email: string; passwordHash: string };

type SessionEntry = { email: string; name: string; createdAt: number; expiresAt: number };

const STORE_FILENAME = path.join(process.cwd(), 'laras_auth_store.json');
// default TTL: 7 days
export const DEFAULT_SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

// In-memory maps backed by a file store for persistence across dev server restarts/processes
export const users: Map<string, User> = new Map();
export const sessions: Map<string, SessionEntry> = new Map();

function purgeExpiredSessions() {
  let changed = false;
  const now = Date.now();
  for (const [sid, s] of Array.from(sessions.entries())) {
    if (s.expiresAt <= now) {
      sessions.delete(sid);
      changed = true;
    }
  }
  if (changed) saveStore();
}

function loadStore() {
  try {
    if (!fs.existsSync(STORE_FILENAME)) return;
    const raw = fs.readFileSync(STORE_FILENAME, 'utf8');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.users) {
      Object.keys(parsed.users).forEach((email) => {
        const u = parsed.users[email];
        users.set(email, { name: u.name, email, passwordHash: u.passwordHash });
      });
    }
    if (parsed.sessions) {
      Object.keys(parsed.sessions).forEach((sid) => {
        const s = parsed.sessions[sid];
        // ensure numeric timestamps
        const createdAt = typeof s.createdAt === 'number' ? s.createdAt : Date.now();
        const expiresAt = typeof s.expiresAt === 'number' ? s.expiresAt : (createdAt + DEFAULT_SESSION_TTL);
        sessions.set(sid, { email: s.email, name: s.name, createdAt, expiresAt });
      });
    }
    // purge expired immediately after loading
    purgeExpiredSessions();
  } catch (err) {
    // If parsing fails, ignore and start fresh
    console.warn('Failed to load auth store:', err);
  }
}

function saveStore() {
  try {
    const payload = {
      users: Object.fromEntries(Array.from(users.entries()).map(([email, u]) => [email, { name: u.name, passwordHash: u.passwordHash }])),
      sessions: Object.fromEntries(Array.from(sessions.entries()).map(([sid, s]) => [sid, { email: s.email, name: s.name, createdAt: s.createdAt, expiresAt: s.expiresAt }])),
    };
    const tmp = STORE_FILENAME + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), 'utf8');
    fs.renameSync(tmp, STORE_FILENAME);
  } catch (err) {
    console.warn('Failed to save auth store:', err);
  }
}

// Initialize store on module load
loadStore();

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function addUser(name: string, email: string, password: string) {
  const passwordHash = hashPassword(password);
  users.set(email, { name, email, passwordHash });
  saveStore();
}

export function getUserByEmail(email: string) {
  return users.get(email);
}

export function createSessionForUser(user: { name: string; email: string }, ttlMs: number = DEFAULT_SESSION_TTL) {
  const sessionId = crypto.randomUUID();
  const createdAt = Date.now();
  const expiresAt = createdAt + ttlMs;
  sessions.set(sessionId, { email: user.email, name: user.name, createdAt, expiresAt });
  saveStore();
  return sessionId;
}

export function getSession(sessionId: string | null | undefined) {
  if (!sessionId) return null;
  // reload store before read to increase chance of seeing sessions created by other processes
  try { loadStore(); } catch {};
  purgeExpiredSessions();
  const s = sessions.get(sessionId) || null;
  // If found but expired (race), treat as null
  if (s && s.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    saveStore();
    return null;
  }
  return s;
}

export function destroySession(sessionId: string | null | undefined) {
  if (!sessionId) return false;
  const removed = sessions.delete(sessionId);
  saveStore();
  return removed;
}
