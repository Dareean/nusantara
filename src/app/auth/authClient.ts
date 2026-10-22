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

export async function register(name: string, email: string, password: string) {
  const data = await apiRequest('/api/auth/register', 'POST', { name, email, password });
  const sess: ClientSession = { email: data.email, name: data.name, isAdmin: false };
  cachedSession = sess;
  return sess;
}

export async function login(email: string, password: string) {
  const data = await apiRequest('/api/auth/login', 'POST', { email, password });
  const sess: ClientSession = { email: data.email, name: data.name, isAdmin: Boolean(data.isAdmin) };
  cachedSession = sess;
  return sess;
}

export async function logout() {
  cachedSession = null;
  sessionPromise = null;
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
        return cachedSession;
      }
      cachedSession = null;
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
  return cachedSession;
}

const authClient = { register, login, logout, getSession, getCachedSessionSync };

export default authClient;