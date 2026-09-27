import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO = process.env.COLLABORATION_TO || "nextkokknock@gmail.com";
const FROM = process.env.COLLABORATION_FROM || "onboarding@resend.dev";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_HITS;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  // Honeypot: bot mengisi field tersembunyi ini
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const contact = String(body.contact || "").trim();
  const notes = String(body.notes || "").trim();
  const brandName = String(body.brandName || "").trim();
  const budget = String(body.budget || "").trim();
  const services = Array.isArray(body.services) ? body.services.map(String).slice(0, 8) : [];

  if (name.length < 2) return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
  if (contact.length < 5) return NextResponse.json({ error: "Kontak (WA/email) wajib diisi." }, { status: 400 });
  if (services.length === 0) return NextResponse.json({ error: "Pilih minimal satu layanan." }, { status: 400 });
  if (name.length > 100 || contact.length > 120 || notes.length > 2000) {
    return NextResponse.json({ error: "Isi form terlalu panjang." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Layanan email belum dikonfigurasi." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const subject = `Inquiry kolaborasi: ${name}${brandName ? ` (${brandName})` : ""}`;
  const html = `
    <h2>Inquiry baru dari website Logia Creative</h2>
    <p><b>Nama:</b> ${esc(name)}</p>
    <p><b>Brand:</b> ${esc(brandName) || "-"}</p>
    <p><b>Kontak:</b> ${esc(contact)}</p>
    <p><b>Budget:</b> ${esc(budget) || "-"}</p>
    <p><b>Layanan:</b> ${services.map(esc).join(", ") || "-"}</p>
    <p><b>Catatan:</b></p>
    <p>${esc(notes).replace(/\n/g, "<br>") || "-"}</p>
  `;

  try {
    const { error } = await resend.emails.send({ from: FROM, to: TO, subject, html });
    if (error) return NextResponse.json({ error: "Gagal mengirim email." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal mengirim email." }, { status: 502 });
  }
}
