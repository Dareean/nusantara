export type ClientSession = {
  email: string;
  name: string;
  isAdmin: boolean;
  avatarUrl?: string;
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

let serverVerified = false;

export async function register(name: string, email: string, password: string) {
  const data = await apiRequest('/api/auth/register', 'POST', { name, email, password });
  const sess: ClientSession = { email: data.email, name: data.name, isAdmin: false };
  cachedSession = sess;
  serverVerified = true;
  persistSession(sess);
  return sess;
}

export async function login(email: string, password: string) {
  const data = await apiRequest('/api/auth/login', 'POST', { email, password });
  const sess: ClientSession = { email: data.email, name: data.name, isAdmin: Boolean(data.isAdmin) };
  cachedSession = sess;
  serverVerified = true;
  persistSession(sess);
  return sess;
}

export async function logout() {
  cachedSession = null;
  serverVerified = false;
  sessionPromise = null;
  persistSession(null);
  try {
    await apiRequest('/api/auth/logout', 'POST');
  } catch {}
}

export async function getSession(forceRefresh = false): Promise<ClientSession | null> {
  // If the server has already verified the session during this page lifecycle, and not forceRefresh, return cache
  if (serverVerified && cachedSession && !forceRefresh) return cachedSession;
  if (sessionPromise && !forceRefresh) return sessionPromise;

  sessionPromise = (async () => {
    try {
      const data = await apiRequest('/api/auth/session', 'GET');
      if (data?.ok && data.session) {
        const verified: ClientSession = {
          email: data.session.email,
          name: data.session.name,
          isAdmin: Boolean(data.session.isAdmin),
        };
        const prevEmail = cachedSession?.email;
        cachedSession = verified;
        serverVerified = true;
        persistSession(verified);

        // If server identity differs from initial optimistic cache, notify app
        if (typeof window !== 'undefined' && prevEmail && prevEmail.toLowerCase() !== verified.email.toLowerCase()) {
          window.dispatchEvent(new CustomEvent('laras-identity-changed', { detail: verified }));
          window.dispatchEvent(new Event('laras-progress-updated'));
        }
        return verified;
      }

      // Server answered no session: wipe local cache
      cachedSession = null;
      serverVerified = true;
      persistSession(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('laras-progress-updated'));
      }
      return null;
    } catch {
      // Offline fallback: keep cached session if available
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

export async function updateProfile(payload: {
  name?: string;
  avatarUrl?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<ClientSession> {
  const data = await apiRequest('/api/user/profile', 'PUT', payload as Record<string, string>);
  if (data?.session) {
    cachedSession = data.session;
    persistSession(data.session);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('laras-profile-updated', { detail: data.session }));
    }
    return data.session;
  }
  throw new Error(data?.error || 'Gagal memperbarui profil');
}

const authClient = { register, login, logout, getSession, getCachedSessionSync, updateProfile };

export default authClient;