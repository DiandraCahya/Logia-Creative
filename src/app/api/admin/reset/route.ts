import { NextRequest, NextResponse } from "next/server";
import { verifySessionFromRequest, verifyCsrfOrigin } from "@/lib/cms/auth";
import { getStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await verifySessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json({ error: "Forbidden: CSRF check failed" }, { status: 403 });
  }

  try {
    const store = getStore();
    const result = await store.resetToDefaults();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Gagal mereset ke default." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seluruh konten berhasil direset ke default pabrik.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
