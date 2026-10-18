import type { Receipt } from "./receipt";
import { formatIDR } from "./receipt";

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Teks struk untuk Telegram (parse_mode HTML). Total full, DP hanya keterangan. */
export function receiptTelegramHtml(r: Receipt, notes: string, budget: string): string {
  const lines = [
    `<b>STRUK LOGIA CREATIVE</b>`,
    `ID: ${escHtml(r.id)}`,
    `Waktu: ${escHtml(r.timestamp)}`,
    `Pelanggan: ${escHtml(r.customer)}${r.brand ? ` (${escHtml(r.brand)})` : ""}`,
    `Kontak: ${escHtml(r.contact)}`,
    budget ? `Budget: ${escHtml(budget)}` : null,
    ``,
    ...(r.items.length
      ? r.items.map(
          (it) => `• <b>${escHtml(it.packageName)}</b> · ${escHtml(it.solutionName)} (${escHtml(it.priceLabel)})`,
        )
      : [`• <b>${escHtml(r.packageName)}</b> · ${escHtml(r.solutionName)} (${escHtml(r.priceLabel)})`]),
    ``,
    r.total != null ? `<b>Total (${r.items.length} paket, belum dikurangi DP): ${escHtml(formatIDR(r.total))}</b>` : null,
    r.dp != null
      ? `DP 50%: silakan lakukan pembayaran DP sebesar <b>${escHtml(formatIDR(r.dp))}</b> untuk memulai pekerjaan.`
      : null,
    r.sisa != null ? `Sisa pelunasan: ${escHtml(formatIDR(r.sisa))} (dibahas privat via WA admin).` : null,
    `Status: <b>${escHtml(r.status)}</b>`,
    notes ? `\nCatatan: ${escHtml(notes.length > 500 ? notes.slice(0, 500) + "…" : notes)}` : null,
  ].filter((l): l is string => l !== null);
  return lines.join("\n");
}

export interface TelegramResult {
  ok: boolean;
  error?: string;
}

/** Kirim struk ke grup via Bot API. Best-effort: gagal kirim ≠ gagal inquiry. */
export async function sendReceiptTelegram(
  token: string,
  chatId: string,
  html: string,
): Promise<TelegramResult> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; description?: string } | null;
    if (res.ok && data?.ok) return { ok: true };
    return { ok: false, error: data?.description || `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}
