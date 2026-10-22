import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifyCsrfOrigin } from "@/lib/cms/auth";

export async function POST(req: NextRequest) {
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ error: "Permintaan tidak sah." }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
