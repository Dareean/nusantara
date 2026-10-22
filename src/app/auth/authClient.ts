export type ClientSession = {
  email: string;
  name: string;
  isAdmin: boolean;
};

let cachedSession: ClientSession | null = null;
let sessionPromise: Promise<ClientSession | null> | null = null;

async function apiRequest(path: string, method = 'GET', body?: Record<string, string>) {
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
    throw err;
  }
}

const SESSION_STORAGE_KEY = 'laras.active_session';

function persistSession(sess: ClientSession | null) {
  if (typeof window === 'undefined') return;
  try {
    if (sess) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sess));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {}
}

export async function register(name: string, email: string, password: string) {
  const data = await apiRequest('/api/auth/register', 'POST', { name, email, password });
  const sess: ClientSession = { email: data.email, name: data.name, isAdmin: false };
  cachedSession = sess;
  persistSession(sess);
  return sess;
}

export async function login(email: string, password: string) {
  const data = await apiRequest('/api/auth/login', 'POST', { email, password });
  const sess: ClientSession = { email: data.email, name: data.name, isAdmin: Boolean(data.isAdmin) };
  cachedSession = sess;
  persistSession(sess);
  return sess;
}

export async function logout() {
  cachedSession = null;
  sessionPromise = null;
  persistSession(null);
  try {
    await apiRequest('/api/auth/logout', 'POST');
  } catch {}
}

export async function getSession(forceRefresh = false): Promise<ClientSession | null> {
  if (cachedSession && !forceRefresh) return cachedSession;
  if (sessionPromise && !forceRefresh) return sessionPromise;

  sessionPromise = (async () => {
    try {
      const data = await apiRequest('/api/auth/session', 'GET');
      if (data?.ok && data.session) {
        cachedSession = {
          email: data.session.email,
          name: data.session.name,
          isAdmin: Boolean(data.session.isAdmin),
        };
        persistSession(cachedSession);
        return cachedSession;
      }
      cachedSession = null;
      persistSession(null);
      return null;
    } catch {
      return cachedSession;
    } finally {
      sessionPromise = null;
    }
  })();

  return sessionPromise;
}

export function getCachedSessionSync(): ClientSession | null {
  if (cachedSession) return cachedSession;
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        cachedSession = JSON.parse(raw);
        return cachedSession;
      }
    } catch {}
  }
  return null;
}

const authClient = { register, login, logout, getSession, getCachedSessionSync };

export default authClient;