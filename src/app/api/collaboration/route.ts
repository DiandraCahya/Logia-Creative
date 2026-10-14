import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { findPackage } from "@/lib/rate-card";
import { buildReceipt, formatIDR, serviceLabel, wibTimestamp, RECEIPT_TERMS } from "@/lib/receipt";

const TO = process.env.COLLABORATION_TO || "logiacreative.id@gmail.com";
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

  // Paket dari SATU sumber (rate-card), dicocokkan via id unik.
  const pkgRef = services.map((s) => findPackage(s)?.pkg.id).find((x): x is string => !!x) ?? null;
  const receipt = pkgRef ? buildReceipt(pkgRef, name, brandName, contact) : null;
  // Label ramah-baca untuk email admin (id -> "NAMA · Solusi").
  const serviceLabels = services.map(serviceLabel);

  const resend = new Resend(apiKey);
  const stamp = wibTimestamp();
  const receiptBlock = receipt ? `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:16px;border:1px solid #e5e5e5;border-radius:8px;">
      <tr><td style="padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#111;">
        <b>STRUK LOGIA CREATIVE</b><br>
        ID: ${esc(receipt.id)}<br>
        Waktu: ${esc(receipt.timestamp)}<br>
        Pelanggan: ${esc(receipt.customer)}${receipt.brand ? ` (${esc(receipt.brand)})` : ""}<br>
        Kontak: ${esc(receipt.contact)}<br>
        Paket: ${esc(receipt.packageName)} · ${esc(receipt.solutionName)}<br>
        Harga: ${esc(receipt.priceLabel)}<br>
        ${receipt.total != null ? `Total: ${formatIDR(receipt.total)}<br>DP 50%: ${formatIDR(receipt.dp!)}<br>Sisa: ${formatIDR(receipt.sisa!)}<br>` : ""}
        Status: <b>Menunggu DP</b>
        <br><br><span style="font-size:12px;color:#555;">${RECEIPT_TERMS.map(esc).join("<br>")}</span>
      </td></tr>
    </table>` : "";
  const subject = `Inquiry kolaborasi: ${name}${brandName ? ` (${brandName})` : ""}${receipt ? ` [${receipt.id}]` : ""}`;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:16px;background:#fafafa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:8px;font-family:Arial,Helvetica,sans-serif;">
      <tr><td style="padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#111;">
        <h2 style="margin:0 0 12px;font-size:18px;">Inquiry baru dari website Logia Creative</h2>
        <p><b>Nama:</b> ${esc(name)}</p>
        <p><b>Brand:</b> ${esc(brandName) || "-"}</p>
        <p><b>Kontak:</b> ${esc(contact)}</p>
        <p><b>Budget:</b> ${esc(budget) || "-"}</p>
        <p><b>Layanan:</b> ${serviceLabels.map(esc).join(", ") || "-"}</p>
        <p><b>Catatan:</b></p>
        <p>${esc(notes).replace(/\n/g, "<br>") || "-"}</p>
        <p style="font-size:12px;color:#555;">Diterima: ${esc(stamp)}</p>
      </td></tr>
    </table>${receiptBlock}
  </body></html>`;

  try {
    const { error } = await resend.emails.send({ from: FROM, to: TO, subject, html });
    if (error) return NextResponse.json({ error: "Gagal mengirim email." }, { status: 502 });
    return NextResponse.json({ ok: true, receipt });
  } catch {
    return NextResponse.json({ error: "Gagal mengirim email." }, { status: 502 });
  }
}
