/**
 * Logia Creative CMS - Authentication Layer (Node runtime)
 * Built with standard crypto (no external auth libraries).
 * Password verification with scrypt, rate limiting, and CSRF protection.
 */

import crypto from "crypto";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  createSessionToken,
  verifySessionToken,
  verifySessionFromRequest,
} from "./session";

export {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  createSessionToken,
  verifySessionToken,
  verifySessionFromRequest,
};

// In-memory rate limiting (best effort on serverless)
interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
}
const loginAttempts = new Map<string, RateLimitRecord>();

/**
 * Artificial delay to prevent timing analysis on passwords
 */
export async function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check and record login attempt for anti brute force
 */
export function checkRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && record.lockoutUntil > now) {
    const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  return { allowed: true };
}

export function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockoutUntil: 0 };

  if (success) {
    loginAttempts.delete(ip);
    return;
  }

  record.attempts += 1;
  // If failed >= 5 times, lock out for 15 minutes
  if (record.attempts >= 5) {
    record.lockoutUntil = now + 15 * 60 * 1000;
  }
  loginAttempts.set(ip, record);
}

/**
 * Verify plaintext password against ADMIN_PASSWORD_HASH env variable.
 * Format of ADMIN_PASSWORD_HASH: "<salt>:<hexHash>"
 */
export function verifyPassword(password: string): boolean {
  const hashEnv = process.env.ADMIN_PASSWORD_HASH;
  if (!hashEnv || !hashEnv.includes(":")) {
    return false;
  }

  const [salt, expectedHex] = hashEnv.split(":");
  if (!salt || !expectedHex) return false;

  try {
    const derived = crypto.scryptSync(password.trim(), salt, 64);
    const expected = Buffer.from(expectedHex, "hex");

    if (derived.length !== expected.length) {
      return false;
    }

    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/**
 * Verify session directly from Next.js server cookie store
 */
export async function getIsAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return await verifySessionToken(token);
}

/**
 * CSRF Protection: Verifies Origin or Referer header against request Host
 */
export function verifyCsrfOrigin(req: Request): boolean {
  // Safe methods do not mutate
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return true;
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");

  if (!origin || !host) {
    // Fallback: check referer if origin is absent
    const referer = req.headers.get("referer");
    if (!referer || !host) return false;
    try {
      const refUrl = new URL(referer);
      return refUrl.host === host;
    } catch {
      return false;
    }
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}
