import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  createSessionToken,
  delay,
  recordLoginAttempt,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  verifyCsrfOrigin,
  verifyPassword,
} from "@/lib/cms/auth";

export async function POST(req: NextRequest) {
  // 1. Verify CSRF Origin
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ error: "Permintaan tidak sah (CSRF check failed)." }, { status: 403 });
  }

  // 2. Client IP & Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan gagal. Silakan tunggu ${rateLimit.remainingSeconds} detik lagi.`,
      },
      { status: 429 }
    );
  }

  // 3. Artificial delay (anti-timing attack)
  await delay(400);

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format request tidak valid." }, { status: 400 });
  }

  const password = body.password || "";
  if (!password) {
    return NextResponse.json({ error: "Password wajib diisi." }, { status: 400 });
  }

  // 4. Verify password
  const isValid = verifyPassword(password);
  recordLoginAttempt(ip, isValid);

  if (!isValid) {
    return NextResponse.json({ error: "Password admin salah." }, { status: 401 });
  }

  // 5. Issue secure session token
  const token = await createSessionToken();
  const isProduction = process.env.NODE_ENV === "production";

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });

  return response;
}
