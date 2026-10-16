"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, X, Send, Maximize2, Minimize2, ClipboardEdit } from "lucide-react";
import { parseCollabBlock, type CollabDraft } from "@/lib/receipt";

interface Msg { role: "user" | "assistant"; content: string; }

/** Sembunyikan blok ```collab dari tampilan chat. */
function stripCollabBlock(content: string): string {
  return content.replace(/```collab\s*[\s\S]*?```/gi, "").trim();
}

/** Balasan teks polos: hanya paragraf + daftar bernomor, tanpa markdown/bold. */
function renderContent(content: string) {
  const lines = content.split("\n");
  const out: React.ReactNode[] = [];
  let nums: string[] = [];
  const flush = (k: string) => {
    if (!nums.length) return;
    out.push(<ol key={k} className="pl-4 space-y-1 list-decimal">{nums.map((t, j) => <li key={j}>{t}</li>)}</ol>);
    nums = [];
  };
  lines.forEach((ln, i) => {
    const m = ln.match(/^\s*\d+[.)]\s+(.*)/);
    if (m) nums.push(m[1]);
    else { flush(`ol-${i}`); if (ln.trim()) out.push(<p key={`p-${i}`}>{ln}</p>); }
  });
  flush("ol-end");
  return out.length ? out : "...";
}

// Token selaras dengan form kolaborasi (Modul 4).
const PANEL =
  "fixed z-40 flex flex-col overflow-hidden rounded-[var(--radius-md)] " +
  "border border-[color-mix(in_srgb,var(--text-primary)_14%,transparent)] " +
  "bg-[var(--bg-primary)]/95 backdrop-blur-xl";

export function ChatWidget({ onAutofill }: { onAutofill?: (d: CollabDraft) => void }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Halo! Saya asisten Logia Creative. Ceritakan usaha & kebutuhan web/branding Anda — saya bantu rekomendasikan paket yang pas." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<CollabDraft | null>(null);
  const [expanded, setExpanded] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // lazy: mount penuh setelah idle agar tidak ganggu LCP
  useEffect(() => {
    const t = ("requestIdleCallback" in window ? requestIdleCallback : setTimeout) as (cb: () => void) => unknown;
    const id = t(() => setReady(true));
    return () => ("cancelIdleCallback" in window ? cancelIdleCallback(id as number) : clearTimeout(id as number));
  }, []);

  // Mobile: tinggi panel mengikuti visual viewport → input tidak tertutup keyboard.
  // `small` juga dipakai untuk MEMATIKAN tinggi inline di desktop: kalau tidak,
  // `height: var(--vvh, 100dvh)` (viewport penuh) mengalahkan kelas
  // `sm:h-[min(660px,80dvh)]` dan panel jadi setinggi layar.
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const vv = window.visualViewport;
    const el = panelRef.current;
    const apply = () => {
      setCompact(mq.matches);
      if (!mq.matches || !vv || !el) return;
      el.style.setProperty("--vvh", `${vv.height}px`);
    };
    apply();
    mq.addEventListener("change", apply);
    vv?.addEventListener("resize", apply);
    vv?.addEventListener("scroll", apply);
    return () => {
      mq.removeEventListener("change", apply);
      vv?.removeEventListener("resize", apply);
      vv?.removeEventListener("scroll", apply);
    };
  }, [open]);

  // Esc menutup panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, busy]);

  if (!ready) return null;

  const send = async () => {
    const text = input.trim().slice(0, 1000);
    if (!text || busy) return;
    setInput("");
    setDraft(null);
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

  const lastIsEmptyAssistant = busy && msgs[msgs.length - 1]?.role === "assistant" && !stripCollabBlock(msgs[msgs.length - 1].content);

  return (
    <>
      {/* Launcher — disembunyikan di mobile saat panel terbuka (menutupi composer) */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat" : "Buka chat Logia"}
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 min-h-[52px] min-w-[52px] rounded-full bg-black text-white dark:bg-white dark:text-black shadow-xl flex items-center justify-center active:scale-95 hover:opacity-90 transition-transform ${open ? "max-sm:hidden" : ""}`}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat Logia"
          className={`${PANEL} max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-none max-sm:border-x-0 max-sm:h-[calc(100dvh-4rem)] ${
            expanded
              ? "sm:right-4 sm:bottom-20 sm:w-[440px] sm:h-[min(660px,80dvh)]"
              : "sm:right-4 sm:bottom-20 sm:w-[340px] sm:h-[480px]"
          }`}
          style={{
            // Mobile: sheet penuh yang sadar keyboard (visual viewport) + safe-area.
            // Desktop: `compact` false → kelas sm:h-* yang berlaku.
            ...(compact ? { height: "var(--vvh, 100dvh)" } : null),
            maxHeight: "100dvh",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Header minimalis: logo + nama + aksi */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[color-mix(in_srgb,var(--text-primary)_12%,transparent)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Image src="/LOGO.png" alt="Logia" width={22} height={22} className="rounded-full object-cover shrink-0" />
              <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)] truncate">Logia</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Perkecil chat" : "Perbesar chat"}
                className="max-sm:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
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

          {/* Pesan — solid kontras penuh dua mode: bot putih, user hitam (sama light/dark) */}
          <div ref={boxRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 text-sm overscroll-contain">
            {msgs.map((m, i) => {
              const body = stripCollabBlock(m.content);
              const isLast = i === msgs.length - 1;
              if (!body && isLast && m.role === "assistant" && busy) return null; // typing indicator menggantikan
              if (!body) return null;
              return (
                <div
                  key={i}
                  className={`max-w-[85%] px-3.5 py-2.5 text-[14px] leading-[1.6] ${
                    m.role === "user"
                      ? "ml-auto rounded-2xl rounded-br-[var(--radius-xs)] bg-black text-white dark:bg-white dark:text-black font-medium shadow-sm"
                      : "mr-auto rounded-2xl rounded-bl-[var(--radius-xs)] bg-white text-black dark:bg-[#1c1c1c] dark:text-white font-medium border border-black/10 dark:border-white/15 shadow-sm"
                  }`}
                >
                  {renderContent(body)}
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
          </div>

          {/* Composer — input garis hairline, tombol kirim sama gaya dengan form */}
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
              onClick={send}
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