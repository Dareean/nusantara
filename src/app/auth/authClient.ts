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
  return { email: data.email, name: data.name };
}

export async function login(email: string, password: string) {
  const data = await apiRequest('/api/auth/login', 'POST', { email, password });
  return { email: data.email, name: data.name };
}

export async function logout() {
  try {
    await apiRequest('/api/auth/logout', 'POST');
  } catch {}
}

export async function getSession() {
  try {
    const data = await apiRequest('/api/auth/session', 'GET');
    if (data?.ok && data.session) return data.session;
  } catch {
    return null;
  }
}

const authClient = { register, login, logout, getSession };

export default authClient;