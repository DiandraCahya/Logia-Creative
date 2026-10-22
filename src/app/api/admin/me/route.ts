import { NextRequest, NextResponse } from "next/server";
import { verifySessionFromRequest } from "@/lib/cms/auth";

export async function GET(req: NextRequest) {
  const authenticated = await verifySessionFromRequest(req);
  return NextResponse.json({ authenticated });
}
