import {
  ALL_PACKAGES,
  CUSTOM_SERVICE_OPTION,
  findPackage,
  formatPrice,
  priceLabel,
  priceTypeLabel,
} from "./rate-card";

export function formatIDR(n: number): string {
  return formatPrice(n);
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
  return fmt.format(d) + " WIB";
}

export interface ReceiptItem {
  packageName: string;
  solutionName: string;
  priceLabel: string;
  price: number;
}

export interface Receipt {
  id: string;
  timestamp: string;
  customer: string;
  brand: string;
  contact: string;
  notes: string;
  items: ReceiptItem[];
  /** Kompat: paket pertama (dipakai link WA lama). */
  packageName: string;
  solutionName: string;
  priceLabel: string;
  total: number | null;
  dp: number | null;
  sisa: number | null;
  status: "Menunggu DP";
}

/** Struk dari BANYAK paket: menjumlahkan semua harga. Null bila tak ada yang cocok. */
export function buildReceipt(refs: string[], customer: string, brand: string, contact: string, notes = ""): Receipt | null {
  const hits = refs
    .map((ref) => findPackage(ref))
    .filter((h): h is NonNullable<typeof h> => h !== null);
  // Dedup per id paket (1-per-solusi sudah dinormalisasi di form; jaga-jaga input API).
  const uniq = [...new Map(hits.map((h) => [h.pkg.id, h])).values()];
  if (!uniq.length) return null;
  const items: ReceiptItem[] = uniq.map((h) => ({
    packageName: h.pkg.name,
    solutionName: h.solution.name,
    priceLabel: `${priceLabel(h.pkg)} (${priceTypeLabel(h.pkg.unit)})`,
    price: h.pkg.price,
  }));
  const total = items.reduce((s, i) => s + i.price, 0);
  const first = uniq[0];
  return {
    id: makeReceiptId(),
    timestamp: wibTimestamp(),
    customer,
    brand,
    contact,
    notes,
    items,
    packageName: first.pkg.name,
    solutionName: first.solution.name,
    priceLabel: `${priceLabel(first.pkg)} (${priceTypeLabel(first.pkg.unit)})`,
    total,
    dp: Math.round(total / 2),
    sisa: total - Math.round(total / 2),
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

/**
 * Parse blok ```collab {...}``` dari balasan bot; null bila tak valid.
 * Nama dari chatbot di-map ke id paket agar form & struk konsisten.
 */
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
      const hit = findPackage(s);
      if (hit) return hit.pkg.id;
      return /custom|konsultasi|satuan/i.test(s) ? CUSTOM_SERVICE_OPTION : null;
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

/** Nama paket dari id pilihan form; id tak dikenal diteruskan apa adanya. */
export function serviceLabel(service: string): string {
  const hit = ALL_PACKAGES.find((e) => e.pkg.id === service);
  return hit ? `${hit.pkg.name} · ${hit.solution.name}` : service;
}