import { NextResponse, type NextRequest } from "next/server";
import { getTestimonials } from "@/lib/cms/content";
import { getStore } from "@/lib/cms/store";
import { validateTestimonialsContent } from "@/lib/cms/validation";
import { verifySessionFromRequest, verifyCsrfOrigin } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authed = await verifySessionFromRequest(req);
  if (!authed) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  try {
    const data = await getTestimonials();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengambil data testimoni." }, { status: 500 });
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
    const validation = validateTestimonialsContent(body);

    if (!validation.valid || !validation.content) {
      return NextResponse.json({ error: "Data testimoni tidak valid.", details: validation.errors }, { status: 400 });
    }

    const store = getStore();
    await store.writeJson("content/testimonials.json", validation.content);

    return NextResponse.json({
      success: true,
      message: "Daftar testimoni berhasil diperbarui.",
      data: validation.content,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan testimoni." }, { status: 500 });
  }
}
