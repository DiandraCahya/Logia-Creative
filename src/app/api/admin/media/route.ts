import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getStore } from "@/lib/cms/store";
import { verifyCsrfOrigin, verifySessionFromRequest } from "@/lib/cms/auth";
import { sanitizeText } from "@/lib/cms/validation";
import type { MediaItem } from "@/lib/cms/types";

const MAX_TOTAL_MEDIA_FILES = 300;
const MAX_SERVER_FILE_SIZE = 1024 * 1024; // 1MB

/**
 * Validates magic bytes to ensure file is genuinely a raster image, and never SVG or script.
 */
function verifyMagicBytes(buffer: Buffer): { valid: boolean; ext: string } {
  if (buffer.length < 12) return { valid: false, ext: "" };

  // Reject SVG text explicitly
  const headerStr = buffer.slice(0, 100).toString("utf-8").toLowerCase();
  if (headerStr.includes("<svg") || headerStr.includes("<?xml") || headerStr.includes("<!doctype html")) {
    return { valid: false, ext: "" };
  }

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, ext: "webp" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: "png" };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: "jpeg" };
  }

  // AVIF: contains ftypavif in first 32 bytes
  const sliceStr = buffer.slice(4, 32).toString("utf-8");
  if (sliceStr.includes("ftypavif") || sliceStr.includes("ftypmif1")) {
    return { valid: true, ext: "avif" };
  }

  return { valid: false, ext: "" };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "photo";
}

export async function GET(req: NextRequest) {
  const isAuthed = await verifySessionFromRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  try {
    const list = await store.readJson<MediaItem[]>("content/media.json");
    return NextResponse.json({ success: true, media: list || [], data: list || [] });
  } catch {
    const defaults = await store.readJson<MediaItem[]>("content/defaults/media.json").catch(() => []);
    return NextResponse.json({ success: true, media: defaults, data: defaults });
  }
}

export async function POST(req: NextRequest) {
  // 1. Auth & CSRF
  const isAuthed = await verifySessionFromRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ error: "CSRF check failed" }, { status: 403 });
  }

  // 2. Parse FormData
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Gagal memproses form data." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const alt = sanitizeText(formData.get("alt"), 200);
  const userSlug = sanitizeText(formData.get("slug"), 50);
  const widthStr = formData.get("width");
  const heightStr = formData.get("height");

  if (!file) {
    return NextResponse.json({ error: "File foto wajib diunggah." }, { status: 400 });
  }
  if (!alt) {
    return NextResponse.json({ error: "Deskripsi teks alternatif (Alt text) wajib diisi untuk aksesibilitas." }, { status: 400 });
  }

  if (file.size > MAX_SERVER_FILE_SIZE) {
    return NextResponse.json(
      { error: `Ukuran file melebihi batas 1MB (${Math.round(file.size / 1024)} KB).` },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 3. Verify magic bytes
  const { valid, ext } = verifyMagicBytes(buffer);
  if (!valid) {
    return NextResponse.json(
      { error: "File bukan gambar yang valid atau format SVG ditolak demi keamanan." },
      { status: 400 }
    );
  }

  const store = getStore();

  // 4. Check total file count limit
  let currentList: MediaItem[] = [];
  try {
    currentList = await store.readJson<MediaItem[]>("content/media.json");
  } catch {
    currentList = await store.readJson<MediaItem[]>("content/defaults/media.json").catch(() => []);
  }

  if (currentList.length >= MAX_TOTAL_MEDIA_FILES) {
    return NextResponse.json(
      { error: `Batas total file tercapai (${MAX_TOTAL_MEDIA_FILES} foto). Hapus foto lama sebelum mengunggah baru.` },
      { status: 400 }
    );
  }

  // 5. Generate secure, date-partitioned file name
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const baseName = slugify(userSlug || file.name.replace(/\.[^/.]+$/, ""));
  const hash = crypto.randomBytes(4).toString("hex");
  const fileName = `${baseName}-${hash}.${ext}`;
  const relativeUploadPath = `public/uploads/${yyyy}/${mm}/${fileName}`;
  const publicUrlPath = `/uploads/${yyyy}/${mm}/${fileName}`;

  // Write file to store (in local mode writes to public/uploads/..., in github mode will be committed)
  await store.writeFile(relativeUploadPath, buffer);

  const width = widthStr ? parseInt(String(widthStr), 10) : 0;
  const height = heightStr ? parseInt(String(heightStr), 10) : 0;

  const newMediaItem: MediaItem = {
    id: `media-${Date.now()}-${hash}`,
    path: publicUrlPath,
    alt,
    width: width || 800,
    height: height || 600,
    size: buffer.length,
    createdAt: now.toISOString(),
  };

  const updatedList = [newMediaItem, ...currentList];
  await store.writeJson("content/media.json", updatedList);

  return NextResponse.json({
    success: true,
    item: newMediaItem,
    message: "Foto berhasil diunggah.",
  });
}

export async function DELETE(req: NextRequest) {
  // 1. Auth & CSRF
  const isAuthed = await verifySessionFromRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ error: "CSRF check failed" }, { status: 403 });
  }

  let body: { id?: string; path?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format request tidak valid." }, { status: 400 });
  }

  const { id, path: targetPath } = body;
  if (!id && !targetPath) {
    return NextResponse.json({ error: "ID atau path media wajib disertakan." }, { status: 400 });
  }

  const store = getStore();

  // 2. Check references in content (Rule: Foto yang masih dipakai konten tidak boleh dihapus)
  try {
    const [siteJson, projectsJson, testimonialsJson] = await Promise.all([
      store.readJson<unknown>("content/site.json").catch(() => null),
      store.readJson<unknown>("content/projects.json").catch(() => null),
      store.readJson<unknown>("content/testimonials.json").catch(() => null),
    ]);

    const serializedContent = JSON.stringify({ siteJson, projectsJson, testimonialsJson });
    if (targetPath && serializedContent.includes(targetPath)) {
      return NextResponse.json(
        {
          error: "Foto ini masih digunakan dalam konten website. Ganti foto tersebut terlebih dahulu sebelum menghapusnya dari galeri.",
        },
        { status: 409 }
      );
    }
  } catch {
    // If checking fails, proceed cautiously
  }

  // 3. Remove from media.json and filesystem
  let mediaList: MediaItem[] = [];
  try {
    mediaList = await store.readJson<MediaItem[]>("content/media.json");
  } catch {
    mediaList = await store.readJson<MediaItem[]>("content/defaults/media.json").catch(() => []);
  }

  const itemToDelete = mediaList.find((m) => m.id === id || m.path === targetPath);
  if (!itemToDelete) {
    return NextResponse.json({ error: "Foto tidak ditemukan." }, { status: 404 });
  }

  const updatedList = mediaList.filter((m) => m.id !== itemToDelete.id);
  await store.writeJson("content/media.json", updatedList);

  if (itemToDelete.path.startsWith("/uploads/")) {
    const fsPath = `public${itemToDelete.path}`;
    await store.deleteFile(fsPath).catch(() => {});
  }

  return NextResponse.json({ success: true, message: "Foto berhasil dihapus." });
}
