// Auth client: prefer server-side local API (/api/auth/*). Falls back to localStorage if network fails.

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(text: string) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return toHex(hash);
}

type User = { name: string; email: string; passwordHash: string };

const USERS_KEY = 'laras.users';
const SESSION_KEY = 'laras.session';

function readUsers(): Record<string, User> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, User>;
  } catch (e) {
    return {};
  }
}

function writeUsers(users: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function apiRequest(path: string, method = 'GET', body?: any) {
  try {
    const res = await fetch(path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    // bubble up network error to caller which may fallback
    throw err;
  }
}

export async function register(name: string, email: string, password: string) {
  // prefer server API
  try {
    const data = await apiRequest('/api/auth/register', 'POST', { name, email, password });
    return { email: data.email, name: data.name };
  } catch (e) {
    // fallback to localStorage behaviour
    const users = readUsers();
    if (users[email]) throw new Error('Email already terdaftar');
    const passwordHash = await sha256(password);
    users[email] = { name, email, passwordHash };
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name }));
    return { email, name };
  }
}

export async function login(email: string, password: string) {
  try {
    const data = await apiRequest('/api/auth/login', 'POST', { email, password });
    return { email: data.email, name: data.name };
  } catch (e) {
    const users = readUsers();
    const user = users[email];
    if (!user) throw new Error('Pengguna tidak ditemukan');
    const passwordHash = await sha256(password);
    if (passwordHash !== user.passwordHash) throw new Error('Kata sandi salah');
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }));
    return { email: user.email, name: user.name };
  }
}

export async function logout() {
  try {
    await apiRequest('/api/auth/logout', 'POST');
  } catch (e) {
    // ignore
  }
  localStorage.removeItem(SESSION_KEY);
}

export async function getSession() {
  try {
    const data = await apiRequest('/api/auth/session', 'GET');
    if (data?.ok && data.session) return data.session;
  } catch (e) {
    // ignore, fallback to localStorage
  }
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export default { register, login, logout, getSession };