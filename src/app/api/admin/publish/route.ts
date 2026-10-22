import { NextRequest, NextResponse } from "next/server";
import { verifySessionFromRequest, verifyCsrfOrigin } from "@/lib/cms/auth";
import { getStore } from "@/lib/cms/store";
import type { BatchFileChange } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await verifySessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const driver = store.driverName;
  const sha = await store.getLatestSha();
  const hasGithubConfig = !!(
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO
  );

  return NextResponse.json({
    driver,
    hasGithubConfig,
    currentSha: sha,
    owner: process.env.GITHUB_OWNER || null,
    repo: process.env.GITHUB_REPO || null,
    branch: process.env.GITHUB_BRANCH || "main",
  });
}

export async function POST(request: NextRequest) {
  const session = await verifySessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json({ error: "Forbidden: CSRF check failed" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const summary = typeof body.summary === "string" ? body.summary.trim() : "";
    const expectedSha = typeof body.expectedSha === "string" ? body.expectedSha.trim() : undefined;
    const files: BatchFileChange[] = Array.isArray(body.files) ? body.files : [];
    const deletions: string[] = Array.isArray(body.deletions) ? body.deletions : [];

    const store = getStore();
    const commitMsg = summary || "pembaruan konten situs";

    const result = await store.commitBatch(files, deletions, commitMsg, expectedSha);

    if (!result.success) {
      const status = result.isConflict ? 409 : 500;
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Gagal mempublikasikan perubahan.",
          isConflict: result.isConflict || false,
        },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      driver: store.driverName,
      commitSha: result.commitSha || null,
      message:
        store.driverName === "github"
          ? "Terkirim. Perubahan tampil setelah deploy selesai (sekitar 1–2 menit)."
          : "Perubahan berhasil disimpan dan cache halaman telah diperbarui langsung.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
