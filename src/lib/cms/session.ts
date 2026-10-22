/**
 * Logia Creative CMS - Edge-compatible Session Layer
 * Uses Web Crypto API (crypto.subtle) so it runs seamlessly in Next.js Middleware and Edge runtime.
 */

export const SESSION_COOKIE_NAME = "logia_cms_session";
export const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

export interface SessionPayload {
  role: "admin";
  iat: number;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    return "logia-dev-session-secret-at-least-32-chars-long-2026";
  }
  return secret;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates signed session token using Web Crypto HMAC-SHA256
 */
export async function createSessionToken(): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = {
    role: "admin",
    iat: now,
    exp: now + SESSION_DURATION_MS,
  };

  const enc = new TextEncoder();
  const payloadB64 = base64UrlEncode(enc.encode(JSON.stringify(payload)));
  const key = await getHmacKey(getSessionSecret());
  const signatureBytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64))
  );
  const signatureB64 = base64UrlEncode(signatureBytes);

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies signed session token using Web Crypto HMAC-SHA256
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signatureB64] = parts;
  if (!payloadB64 || !signatureB64) return false;

  try {
    const enc = new TextEncoder();
    const key = await getHmacKey(getSessionSecret());
    const signatureBytes = base64UrlDecode(signatureB64);

    const isValidSig = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(payloadB64)
    );

    if (!isValidSig) return false;

    const payloadBytes = base64UrlDecode(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr) as SessionPayload;

    if (payload.role !== "admin") return false;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Verify session from raw Request
 */
export async function verifySessionFromRequest(req: Request): Promise<boolean> {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : undefined;
  return await verifySessionToken(token);
}
