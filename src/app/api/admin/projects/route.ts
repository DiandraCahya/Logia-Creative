import { NextResponse, type NextRequest } from "next/server";
import { getProjects } from "@/lib/cms/content";
import { getStore } from "@/lib/cms/store";
import { validateProjectsList } from "@/lib/cms/validation";
import { verifySessionFromRequest, verifyCsrfOrigin } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authed = await verifySessionFromRequest(req);
  if (!authed) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  try {
    const data = await getProjects();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengambil data proyek." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authed = await verifySessionFromRequest(req);
  if (!authed) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ error: "Permintaan ditolak (CSRF check)." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validation = validateProjectsList(body);

    if (!validation.valid || !validation.items) {
      return NextResponse.json({ error: "Data proyek tidak valid.", details: validation.errors }, { status: 400 });
    }

    const store = getStore();
    await store.writeJson("content/projects.json", validation.items);

    return NextResponse.json({
      success: true,
      message: "Koleksi proyek berhasil diperbarui.",
      data: validation.items,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan proyek." }, { status: 500 });
  }
}
