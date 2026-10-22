import { NextResponse, type NextRequest } from "next/server";
import { getSite } from "@/lib/cms/content";
import { getStore } from "@/lib/cms/store";
import { validateSiteContent } from "@/lib/cms/validation";
import { verifySessionFromRequest, verifyCsrfOrigin } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/site
 * Mengambil data teks seluruh website
 */
export async function GET(req: NextRequest) {
  const authed = await verifySessionFromRequest(req);
  if (!authed) {
    return NextResponse.json(
      { error: "Akses ditolak. Sesi tidak valid atau telah berakhir." },
      { status: 401 }
    );
  }

  try {
    const site = await getSite();
    return NextResponse.json({ success: true, data: site });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mengambil data teks website." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/site
 * Menyimpan pembaruan data teks seluruh website
 */
export async function POST(req: NextRequest) {
  const authed = await verifySessionFromRequest(req);
  if (!authed) {
    return NextResponse.json(
      { error: "Akses ditolak. Sesi tidak valid atau telah berakhir." },
      { status: 401 }
    );
  }

  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json(
      { error: "Permintaan ditolak karena Origin header tidak valid (CSRF check)." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const validation = validateSiteContent(body);

    if (!validation.valid || !validation.content) {
      return NextResponse.json(
        { error: "Data teks tidak valid.", details: validation.errors },
        { status: 400 }
      );
    }

    const store = getStore();
    await store.writeJson("content/site.json", validation.content);

    return NextResponse.json({
      success: true,
      message: "Konten teks website berhasil disimpan.",
      data: validation.content,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal menyimpan konten teks website." },
      { status: 500 }
    );
  }
}
