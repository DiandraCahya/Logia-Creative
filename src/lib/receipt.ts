import { PACKAGES } from "./rate-card";

/** Ambil angka Rupiah pertama dari string harga ("Rp 1.500.000 / Bulan" -> 1500000). */
export function parsePrice(price: string): number | null {
  const m = price.replace(/\s/g, "").match(/Rp([\d.]+)/i);
  if (!m) return null;
  const n = parseInt(m[1].replace(/\./g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

export function formatIDR(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

export function makeReceiptId(d = new Date()): string {
  const y = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `LGC-${y}${mm}${dd}-${rand}`;
}

/** Timestamp format WIB: "28 Sep 2026, 14.30 WIB". */
export function wibTimestamp(d = new Date()): string {
  const fmt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  return fmt.format(d).replace(",", ",") + " WIB";
}

export interface Receipt {
  id: string;
  timestamp: string;
  customer: string;
  brand: string;
  contact: string;
  packageName: string;
  priceLabel: string;
  total: number | null;
  dp: number | null;
  sisa: number | null;
  status: "Menunggu DP";
}

export function buildReceipt(pkgName: string, customer: string, brand: string, contact: string): Receipt | null {
  const pkg = PACKAGES.find((p) => p.name === pkgName);
  if (!pkg) return null;
  const total = parsePrice(pkg.price);
  return {
    id: makeReceiptId(),
    timestamp: wibTimestamp(),
    customer,
    brand,
    contact,
    packageName: pkg.name,
    priceLabel: pkg.price,
    total,
    dp: total != null ? Math.round(total / 2) : null,
    sisa: total != null ? total - Math.round(total / 2) : null,
    status: "Menunggu DP",
  };
}

/** Draft pesanan hasil ekstraksi chatbot → prefill modal (submit tetap via /api/collaboration). */
export interface CollabDraft {
  name: string;
  brandName: string;
  contact: string;
  budget: string;
  services: string[];
  notes: string;
}

/** Parse blok ```collab {...}``` dari balasan bot; null bila tak valid. Nama layanan difuzzy-match ke PACKAGES agar struk selalu terbit. */
export function parseCollabBlock(text: string): CollabDraft | null {
  const m = text.match(/```collab\s*([\s\S]*?)```/i);
  if (!m) return null;
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(m[1]);
  } catch {
    return null;
  }
  const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  const name = str(raw.name, 100);
  const contact = str(raw.contact, 120);
  const list = Array.isArray(raw.services) ? raw.services.map(String) : [];
  const services = list
    .map((s) => {
      const hit = PACKAGES.find(
        (p) => p.name.toLowerCase() === s.trim().toLowerCase() || s.toLowerCase().includes(p.name.split(" ")[0].toLowerCase())
      );
      if (hit) return hit.name;
      return /satuan|custom/i.test(s) ? "Layanan Satuan / Custom" : null;
    })
    .filter((s): s is string => s !== null)
    .slice(0, 8);
  if (name.length < 2 || contact.length < 5 || services.length === 0) return null;
  return {
    name,
    brandName: str(raw.brandName, 100),
    contact,
    budget: str(raw.budget, 80),
    services,
    notes: str(raw.notes, 2000),
  };
}

/** Ringkasan T&C singkat untuk struk. */
export const RECEIPT_TERMS = [
  "DP 50% untuk memulai pekerjaan; pelunasan sebelum handover/go-live.",
  "Maks. 2x revisi minor per paket.",
  "Harga belum termasuk domain & hosting premium.",
];
