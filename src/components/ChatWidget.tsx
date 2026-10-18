"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, X, Send, Maximize2, Minimize2, ClipboardEdit } from "lucide-react";
import { parseCollabBlock, type CollabDraft } from "@/lib/receipt";

interface Msg { role: "user" | "assistant"; content: string; }

/**
 * Sembunyikan blok data dari model (`collab` dan `quick`) dari tampilan chat.
 * Keduanya wajib hilang termasuk saat streaming, ketika fence penutupnya
 * belum datang, karena JSON mentahnya sempat memenuhi seluruh bubble.
 */
function stripBotBlocks(content: string): string {
  return content
    .replace(/```(?:collab|quick)[\s\S]*?```/gi, "") // blok lengkap
    .replace(/```(?:collab|quick)[\s\S]*$/i, "") // belum ditutup (streaming)
    .replace(/^\s*```\s*$/gm, "") // sisa pagar kosong
    .trim();
}

/**
 * Pilihan jawaban yang dibuat model sendiri, supaya tombolnya selalu cocok
 * dengan pertanyaan yang benar-benar dia ajukan (bukan cuma katalog statis).
 * Format: ```quick [{"label":"Jenis usaha","options":["UMKM","Jasa"]}]```
 */
function parseQuickBlock(text: string): QuickQuestion[] | null {
  const m = text.match(/```quick\s*([\s\S]*?)```/i);
  if (!m) return null;
  try {
    const raw: unknown = JSON.parse(m[1]);
    if (!Array.isArray(raw)) return null;
    const out: QuickQuestion[] = [];
    for (const item of raw) {
      const it = item as { label?: unknown; options?: unknown };
      const label = String(it?.label ?? "").trim().slice(0, 40);
      const options = Array.isArray(it?.options)
        ? it.options.map((o) => String(o).trim().slice(0, 40)).filter(Boolean).slice(0, 6)
        : [];
      if (label && options.length >= 2) out.push({ label, options });
      if (out.length >= 6) break;
    }
    return out.length ? out : null;
  } catch {
    return null;
  }
}

/* ── Jawab cepat ────────────────────────────────────────────────────────────
   Bot menggali kebutuhan sebagai daftar bernomor (jenis usaha, tujuan, fitur,
   budget, deadline). Alih-alih user mengetik "1. umkm, 2. penjualan, …",
   pertanyaan yang cocok diberi pilihan siap-tap; hasilnya dirangkai jadi satu
   balasan berlabel lalu dikirim lewat jalur `send` yang sama. */
type QuickQuestion = { label: string; options: string[] };

const QUICK_CATALOG: { match: RegExp; label: string; options: string[] }[] = [
  {
    match: /jenis usaha|bidang usaha|usaha\s*\/\s*produk|produk\s*\/\s*jasa|usaha apa/i,
    label: "Jenis usaha",
    options: ["UMKM", "Jasa", "E-commerce", "Kafe/Resto", "Personal"],
  },
  {
    match: /tujuan/i,
    label: "Tujuan",
    options: ["Jualan online", "Info profil", "Booking", "Portfolio/Lead"],
  },
  {
    match: /fitur/i,
    label: "Fitur",
    options: ["Galeri", "Form kontak", "E-commerce", "Dashboard/Login"],
  },
  {
    match: /anggaran|budget|biaya|harga/i,
    label: "Budget",
    options: ["< 1 juta", "1–3 juta", "3–10 juta", "> 10 juta"],
  },
  {
    match: /deadline|tenggat|kapan selesai|target waktu/i,
    label: "Deadline",
    options: ["< 2 minggu", "1 bulan", "2–3 bulan", "Fleksibel"],
  },
];

/** Ambil pertanyaan bernomor dari balasan bot → pilihan yang dikenal. */
function extractQuickQuestions(body: string): QuickQuestion[] {
  const asked = body
    .split("\n")
    .map((ln) => (ln.match(NUM_RE) ?? ln.match(BULLET_RE))?.[1]?.trim())
    .filter((v): v is string => !!v);
  if (asked.length < 2) return [];
  const out: QuickQuestion[] = [];
  for (const q of asked) {
    const hit = QUICK_CATALOG.find((c) => c.match.test(q));
    if (hit && !out.some((o) => o.label === hit.label)) {
      out.push({ label: hit.label, options: hit.options });
    }
  }
  return out;
}

/**
 * Bot tidak boleh memakai em dash. Prompt sudah melarangnya, ini jaring
 * pengaman kalau model tetap melanggar (dan untuk teks lama di riwayat).
 * En dash hanya diubah kalau dipakai sebagai pemisah kalimat (" – "), bukan
 * saat menempel di rentang angka seperti "1–3 juta".
 */
function stripDashes(text: string): string {
  return text
    .replace(/\s*—\s*/g, ", ") // em dash → koma
    .replace(/\s+–\s+/g, ", ") // en dash sebagai dash → koma
    .replace(/^\s*,\s*/gm, "") // koma nyangkut di awal baris
    .replace(/([:;])\s*,\s*/g, "$1 ") // koma tepat setelah titik dua
    .replace(/,\s*([,.!?:;])/g, "$1") // koma dobel / sebelum tanda baca
    .replace(/,\s*$/gm, "") // koma menggantung di akhir baris
    .replace(/[ \t]{2,}/g, " ");
}

/**
 * Model kadang menulis nomor di baris sendiri ("1." lalu baris baru berisi
 * teksnya). Parser butuh nomor dan teks dalam satu baris, jadi nomor yatim
 * digabung ke baris berikutnya sebelum diproses.
 */
function joinLooseNumbers(text: string): string {
  return text.replace(/^(\s*\d{1,2}\s*[.)、．])[ \t]*\n\s*(?=\S)/gm, "$1 ");
}

/** Semua pembersihan teks bot lewat sini, supaya render & ekstraksi konsisten. */
function cleanBotText(raw: string): string {
  return stripDashes(joinLooseNumbers(stripBotBlocks(raw)));
}

/** Gabung opsi buatan model dengan katalog: model menang per topik, sisanya diisi katalog. */
function mergeQuick(model: QuickQuestion[] | null, catalog: QuickQuestion[]): QuickQuestion[] {
  if (!model?.length) return catalog;
  // Topik yang sudah dicakup model, dicocokkan lewat regex katalog supaya
  // label berbeda ejaan ("Jenis Usaha" vs "jenis usaha") tidak dobel.
  const covered = QUICK_CATALOG.filter((c) => model.some((m) => c.match.test(m.label)));
  const extra = catalog.filter((q) => !covered.some((c) => c.label === q.label));
  return [...model, ...extra].slice(0, 6);
}

/* Daftar bernomor/bullet dari model. Regex sengaja longgar: model kadang menulis
   "1.", "1)", "1、", atau membungkus nomornya dengan **bold**. */
const NUM_RE = /^\s*(?:\*\*)?\d{1,2}\s*[.)、．]\s*(?:\*\*)?\s*(.+)$/;
const BULLET_RE = /^\s*[-•*]\s+(.+)$/;

/**
 * Balasan bot → blok teks polos. Nomor daftar ditulis EKSPLISIT, tidak
 * mengandalkan `::marker`: marker pernah tidak ter-paint di device user, dan
 * saat itu terjadi 4 pertanyaan berubah jadi satu blok teks tanpa pemisah.
 * Antar blok diberi jarak supaya paragraf tidak menumpuk.
 */
function renderContent(content: string) {
  const blocks: React.ReactNode[] = [];
  let items: { kind: "num" | "bullet"; text: string }[] = [];

  const flush = (k: string) => {
    if (!items.length) return;
    const isNum = items[0].kind === "num";
    const Tag = isNum ? "ol" : "ul";
    blocks.push(
      <Tag key={k} className="list-none space-y-1.5 pl-0">
        {items.map((it, j) => (
          <li key={j} className="flex gap-2">
            <span aria-hidden className="shrink-0 tabular-nums opacity-60">
              {isNum ? `${j + 1}.` : "•"}
            </span>
            <span className="min-w-0">{it.text}</span>
          </li>
        ))}
      </Tag>
    );
    items = [];
  };

  content.split("\n").forEach((ln, i) => {
    const num = ln.match(NUM_RE);
    const bul = num ? null : ln.match(BULLET_RE);
    if (num) items.push({ kind: "num", text: num[1] });
    else if (bul) items.push({ kind: "bullet", text: bul[1] });
    else {
      flush(`l-${i}`);
      if (ln.trim()) blocks.push(<p key={`p-${i}`}>{ln}</p>);
    }
  });
  flush("l-end");

  return blocks.length ? <div className="space-y-2">{blocks}</div> : "...";
}

// Token selaras dengan form kolaborasi (Modul 4).
// Satu geometri popup untuk desktop & mobile: kartu mengambang di kanan-bawah,
// 12px di atas launcher (launcher 52px + jarak 12px = 4rem dari tepi bawah).
// Sebelumnya inset panel hanya ada di `max-sm:*`, jadi di desktop `fixed` tanpa
// top/right/bottom menempel di posisi statisnya di dasar dokumen (y≈6889) dan
// tidak pernah terlihat. Jangan hapus inset non-breakpoint di bawah.
const PANEL =
  "fixed z-40 flex flex-col overflow-hidden " +
  "right-4 left-4 sm:left-auto " +
  "bottom-[max(1rem,env(safe-area-inset-bottom))] " +
  "rounded-[var(--radius-md)] " +
  "border border-[color-mix(in_srgb,var(--text-primary)_14%,transparent)] " +
  "bg-[color-mix(in_srgb,var(--bg-primary)_95%,transparent)] backdrop-blur-xl " +
  "shadow-[0_24px_64px_-24px_rgba(0,0,0,0.45)]";

export function ChatWidget({ onAutofill }: { onAutofill?: (d: CollabDraft) => void }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Halo! Saya asisten Logia Creative. Ceritakan usaha & kebutuhan web/branding Anda. Saya bantu rekomendasikan paket yang pas." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<CollabDraft | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [quick, setQuick] = useState<Record<string, string>>({});
  const [quickHidden, setQuickHidden] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // lazy: mount penuh setelah idle agar tidak ganggu LCP
  useEffect(() => {
    const t = ("requestIdleCallback" in window ? requestIdleCallback : setTimeout) as (cb: () => void) => unknown;
    const id = t(() => setReady(true));
    return () => ("cancelIdleCallback" in window ? cancelIdleCallback(id as number) : clearTimeout(id as number));
  }, []);

  // Esc menutup panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Fokus pindah ke panel (bukan ke input) saat dibuka: Esc dan Tab langsung
  // bekerja, tapi keyboard mobile tidak otomatis naik menutupi composer.
  useEffect(() => {
    if (open) panelRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, busy]);

  if (!ready) return null;

  const send = async (override?: string) => {
    const text = (override ?? input).trim().slice(0, 1000);
    if (!text || busy) return;
    setInput("");
    setDraft(null);
    setQuick({});
    setQuickHidden(false);
    const next = [...msgs.slice(-7), { role: "user" as const, content: text }];
    setMsgs([...next, { role: "assistant" as const, content: "" }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Gagal.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "", acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const ln of lines) {
          const line = ln.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") break;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              acc += delta;
              const d = parseCollabBlock(acc);
              if (d) setDraft(d);
              setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: acc }; return c; });
            }
          } catch { /* abaikan chunk parsial */ }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error.";
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: `Maaf, ${msg} Coba lagi atau isi form kolaborasi ya.` }; return c; });
    } finally {
      setBusy(false);
    }
  };

  const lastIsEmptyAssistant = busy && msgs[msgs.length - 1]?.role === "assistant" && !stripBotBlocks(msgs[msgs.length - 1].content);

  // Pertanyaan bernomor di balasan TERAKHIR → pilihan siap-tap. Prioritas:
  // blok `quick` buatan model (selalu cocok dengan pertanyaannya), lalu
  // katalog statis sebagai cadangan kalau model tidak mengirim blok.
  const lastMsg = msgs[msgs.length - 1];
  const lastBotRaw = !busy && lastMsg?.role === "assistant" ? lastMsg.content : "";
  const quickQuestions = lastBotRaw
    ? mergeQuick(parseQuickBlock(lastBotRaw), extractQuickQuestions(cleanBotText(lastBotRaw)))
    : [];
  const quickAnswers = quickQuestions.filter((q) => quick[q.label]);
  const showQuick = quickQuestions.length > 0 && !quickHidden && !draft;

  const sendQuick = () => {
    const lines = quickAnswers.map((q) => `${q.label}: ${quick[q.label]}`);
    if (!lines.length) return;
    setQuickHidden(true);
    void send(lines.join("\n"));
  };

  // Satu ukuran popup, dua state. Ditulis sebagai nilai penuh (bukan menimpa
  // `h-[...]` dengan `h-[...]`) supaya tidak bergantung urutan emisi Tailwind.
  // 560px dipilih supaya di mobile tetap terbaca sebagai kartu popup, bukan sheet.
  const panelSize = expanded
    ? "w-auto sm:w-[520px] h-[min(760px,calc(100dvh-2rem))]"
    : "w-auto sm:w-[380px] h-[min(560px,calc(100dvh-2rem))]";

  return (
    <>
      {/* Launcher: hanya saat tertutup. Panel duduk persis di posisinya, jadi
          tidak ada dua tombol tutup (X di launcher + X di header) yang bentrok. */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka chat Logia"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 min-h-[52px] min-w-[52px] rounded-full bg-black text-white dark:bg-white dark:text-black shadow-xl flex items-center justify-center active:scale-95 hover:opacity-90 transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat Logia"
          tabIndex={-1}
          className={`${PANEL} ${panelSize} outline-none`}
        >
          {/* Header minimalis: logo + nama + aksi */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[color-mix(in_srgb,var(--text-primary)_12%,transparent)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Image src="/LOGO.png" alt="Logia" width={22} height={22} loading="lazy" decoding="async" className="rounded-full object-cover shrink-0" />
              <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)] truncate">Logia</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Perkecil chat" : "Perbesar chat"}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup chat"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pesan: solid kontras penuh dua mode: bot putih, user hitam (sama light/dark) */}
          <div ref={boxRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 text-sm overscroll-contain">
            {msgs.map((m, i) => {
              const isUser = m.role === "user";
              // Blok ```collab``` adalah artefak sisi bot. Jangan pernah
              // menerapkannya ke pesan user: kalau user menempel teks yang
              // kebetulan memuat fence itu, kalimatnya sendiri ikut terhapus
              // dan bubble-nya berubah jadi blok kosong.
              const body = isUser ? m.content : cleanBotText(m.content);
              const isLast = i === msgs.length - 1;
              if (!body && isLast && !isUser && busy) return null; // typing indicator menggantikan
              if (!body) return null;
              return (
                <div
                  key={i}
                  className={`max-w-[85%] break-words px-3.5 py-2.5 text-[14px] leading-[1.6] ${
                    isUser
                      ? "ml-auto rounded-2xl rounded-br-[var(--radius-xs)] bg-black text-white dark:bg-white dark:text-black font-medium shadow-sm"
                      : "mr-auto rounded-2xl rounded-bl-[var(--radius-xs)] bg-white text-black dark:bg-[#1c1c1c] dark:text-white font-medium border border-black/10 dark:border-white/15 shadow-sm"
                  }`}
                >
                  {isUser ? (
                    /* Pesan user tampil apa adanya: tidak diubah jadi <ol>,
                       nomornya tidak ditulis ulang, baris baru dipertahankan. */
                    <span className="whitespace-pre-wrap">{body}</span>
                  ) : (
                    renderContent(body)
                  )}
                </div>
              );
            })}
            {lastIsEmptyAssistant && (
              <div
                aria-live="polite"
                aria-label="Asisten sedang menulis"
                className="mr-auto inline-flex items-center gap-1 rounded-2xl rounded-bl-[var(--radius-xs)] bg-white dark:bg-[#1c1c1c] border border-black/10 dark:border-white/15 px-3.5 py-3"
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse"
                    style={{ animationDelay: `${d * 160}ms`, animationDuration: "1.2s" }}
                  />
                ))}
              </div>
            )}
            {draft && onAutofill && (
              <button
                onClick={() => { onAutofill(draft); setDraft(null); setOpen(false); }}
                className="w-full min-h-[48px] px-4 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <ClipboardEdit className="w-4 h-4" />
                Isi Form Otomatis
              </button>
            )}

            {/* Jawab cepat: satu baris chip per pertanyaan bot, lalu satu tombol
                kirim. User yang mau menjawab bebas tetap bisa mengetik. */}
            {showQuick && (
              <div
                role="group"
                aria-label="Jawab cepat"
                className="mr-auto w-full rounded-2xl rounded-bl-[var(--radius-xs)] border border-black/10 bg-white p-3 dark:border-white/15 dark:bg-[#1c1c1c]"
              >
                <div className="mb-2.5 flex items-baseline justify-between gap-3">
                  <p className="text-[12px] font-semibold text-[var(--text-primary)]">Jawab cepat</p>
                  <button
                    type="button"
                    onClick={() => setQuickHidden(true)}
                    className="text-[11px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    Tulis sendiri
                  </button>
                </div>

                <div className="space-y-2.5">
                  {quickQuestions.map((q) => (
                    <div key={q.label}>
                      <p className="mb-1.5 text-[11px] font-medium text-[var(--text-muted)]">{q.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {q.options.map((opt) => {
                          const on = quick[q.label] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              aria-pressed={on}
                              onClick={() => setQuick((s) => ({ ...s, [q.label]: on ? "" : opt }))}
                              className={`min-h-[34px] rounded-full border px-3 text-[12px] font-medium transition-colors ${
                                on
                                  ? "border-transparent bg-black text-white dark:bg-white dark:text-black"
                                  : "border-black/10 bg-black/[0.03] text-[var(--text-primary)] hover:border-black/30 dark:border-white/15 dark:bg-white/[0.06] dark:hover:border-white/40"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={sendQuick}
                  disabled={!quickAnswers.length}
                  className="mt-3 min-h-[40px] w-full rounded-full bg-black text-[13px] font-semibold text-white transition-transform active:scale-[0.99] disabled:opacity-35 dark:bg-white dark:text-black"
                >
                  Kirim jawaban
                  {quickAnswers.length ? ` (${quickAnswers.length}/${quickQuestions.length})` : ""}
                </button>
              </div>
            )}
          </div>

          {/* Composer: input garis hairline, tombol kirim sama gaya dengan form */}
          <div className="p-3 border-t border-[color-mix(in_srgb,var(--text-primary)_12%,transparent)] flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tulis kebutuhan Anda..."
              maxLength={1000}
              aria-label="Pesan chat"
              className="flex-1 min-h-[46px] px-3.5 rounded-[var(--radius-sm)] bg-transparent border border-[color-mix(in_srgb,var(--text-primary)_18%,transparent)] text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/70 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
            <button
              onClick={() => send()}
              disabled={busy}
              aria-label="Kirim pesan"
              className="min-h-[46px] min-w-[46px] shrink-0 rounded-[var(--radius-sm)] bg-black text-white dark:bg-white dark:text-black flex items-center justify-center active:scale-95 disabled:opacity-40 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}