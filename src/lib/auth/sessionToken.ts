export type SessionPayload = {
  email: string;
  name: string;
  isAdmin: boolean;
  avatarUrl?: string;
  exp: number; // timestamp ms
  iat: number; // timestamp ms
};

export const DEFAULT_SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getAuthSecret(): string {
  return (
    process.env.LARAS_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXTAUTH_SECRET ||
    "laras-session-hmac-secret-munas-2026-salt"
  );
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64url");
  }
  const utf8 = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
  return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf8");
  }
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  return decodeURIComponent(
    Array.from(binary)
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function getNodeCrypto() {
  if (typeof process !== "undefined" && process.env?.NEXT_RUNTIME === "edge") {
    return null;
  }
  // @ts-expect-error EdgeRuntime global check
  if (typeof EdgeRuntime === "string") {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const c = require("crypto");
    if (c && typeof c.createHmac === "function") {
      try {
        c.createHmac("sha256", "test").update("test").digest("hex");
        return c;
      } catch {
        return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Synchronous signing using Node crypto (for API routes & serverAuth in Node runtime)
 */
export function createSessionTokenSync(
  payload: Omit<SessionPayload, "exp" | "iat">,
  ttlMs: number = DEFAULT_SESSION_TTL
): string {
  const iat = Date.now();
  const exp = iat + ttlMs;
  const fullPayload: SessionPayload = { ...payload, exp, iat };
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const secret = getAuthSecret();
  const nodeCrypto = getNodeCrypto();
  if (nodeCrypto) {
    const sig = nodeCrypto.createHmac("sha256", secret).update(encodedPayload).digest("base64url");
    return `${encodedPayload}.${sig}`;
  }
  throw new Error("createSessionTokenSync requires Node.js runtime");
}

/**
 * Synchronous verification using Node crypto (for API routes & serverAuth in Node runtime)
 */
export function verifySessionTokenSync(token: string | null | undefined): SessionPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, sig] = parts;
  if (!encodedPayload || !sig) return null;

  try {
    const secret = getAuthSecret();
    const nodeCrypto = getNodeCrypto();
    if (nodeCrypto) {
      const expectedSig = nodeCrypto.createHmac("sha256", secret).update(encodedPayload).digest("base64url");
      if (sig !== expectedSig) {
        return null;
      }

      const json = base64UrlDecode(encodedPayload);
      const payload = JSON.parse(json) as SessionPayload;
      if (!payload.email || typeof payload.exp !== "number") return null;
      if (Date.now() > payload.exp) return null;

      return payload;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Asynchronous signing using Web Crypto (Edge & Node compatible)
 */
export async function createSessionToken(
  payload: Omit<SessionPayload, "exp" | "iat">,
  ttlMs: number = DEFAULT_SESSION_TTL
): Promise<string> {
  const iat = Date.now();
  const exp = iat + ttlMs;
  const fullPayload: SessionPayload = { ...payload, exp, iat };
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const secret = getAuthSecret();
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(encodedPayload));
  const sigBytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < sigBytes.length; i++) {
    binary += String.fromCharCode(sigBytes[i]);
  }
  const sig = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${encodedPayload}.${sig}`;
}

/**
 * Asynchronous verification using Web Crypto (Edge-compatible, 0 Node/fs dependency)
 * Used in Next.js middleware.
 */
export async function verifySessionToken(
  token: string | null | undefined
): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const normalized = token.includes("%") ? decodeURIComponent(token) : token;

  const parts = normalized.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, encodedSig] = parts;
  if (!encodedPayload || !encodedSig) return null;

  try {
    const secret = getAuthSecret();
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    let base64 = encodedSig.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binary = atob(base64);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(encodedPayload));
    if (!isValid) return null;

    const json = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(json) as SessionPayload;
    if (!payload.email || typeof payload.exp !== "number") return null;
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}
