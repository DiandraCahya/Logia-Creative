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

/** Ringkasan T&C singkat untuk struk. */
export const RECEIPT_TERMS = [
  "DP 50% untuk memulai pekerjaan; pelunasan sebelum handover/go-live.",
  "Maks. 2x revisi minor per paket.",
  "Harga belum termasuk domain & hosting premium.",
];
