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
  return out.length ? out : "…";
}

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

  // lazy: mount penuh setelah idle agar tidak ganggu LCP
  useEffect(() => {
    const t = ("requestIdleCallback" in window ? requestIdleCallback : setTimeout) as (cb: () => void) => unknown;
    const id = t(() => setReady(true));
    return () => ("cancelIdleCallback" in window ? cancelIdleCallback(id as number) : clearTimeout(id as number));
  }, []);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

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

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat" : "Buka chat Logia"}
        className="btn-solid fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 min-h-[52px] min-w-[52px] rounded-full !bg-black !text-white dark:!bg-white dark:!text-black shadow-2xl flex items-center justify-center active:scale-95 hover:scale-105 transition-all"
      >
        {open ? <X className="w-5 h-5 !text-white dark:!text-black" /> : <MessageCircle className="w-5 h-5 !text-white dark:!text-black" />}
      </button>
      {open && (
        <div className={`fixed z-40 rounded-3xl border border-black/10 dark:border-white/10 glass-card shadow-2xl flex flex-col overflow-hidden transition-transform duration-200 ${expanded ? "inset-x-3 bottom-3 h-[70dvh] top-auto sm:inset-x-auto sm:right-4 sm:bottom-20 sm:w-[420px] sm:h-[600px]" : "bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] right-4 w-[calc(100vw-2rem)] max-w-[320px] h-[420px] sm:w-[320px] sm:h-[420px]"}`}>
          <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 font-normal text-sm flex items-center justify-between">
            <span className="flex items-center gap-2 font-normal" style={{ fontFamily: "'Inter','Styrene A',system-ui,-apple-system,sans-serif" }}>
              <Image src="/LOGO.png" alt="Logia" width={20} height={20} className="rounded-full object-cover" />
              Logia Assistant
            </span>
            <button onClick={() => setExpanded((v) => !v)} aria-label={expanded ? "Perkecil chat" : "Perbesar chat"} className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg active:scale-95 text-black dark:text-white">
              {expanded ? <Minimize2 className="w-4 h-4 text-black dark:text-white" /> : <Maximize2 className="w-4 h-4 text-black dark:text-white" />}
            </button>
          </div>
          <div ref={boxRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {msgs.map((m, i) => (
              <div key={i} style={{ fontFamily: "'Inter','Styrene A',system-ui,-apple-system,sans-serif" }} className={`max-w-[85%] px-3 py-2 rounded-2xl font-normal text-[14px] leading-[1.6] ${m.role === "user" ? "ml-auto !bg-black !text-white dark:!bg-white dark:!text-black" : "bg-black/5 dark:bg-white/10 text-black dark:text-white"}`}>
                {renderContent(stripCollabBlock(m.content))}
              </div>
            ))}
            {draft && onAutofill && (
              <button
                onClick={() => { onAutofill(draft); setDraft(null); setOpen(false); }}
                className="w-full min-h-[48px] px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] hover:scale-[1.01] transition-transform"
              >
                <ClipboardEdit className="w-4 h-4" />
                Isi Form Otomatis
              </button>
            )}
          </div>
          <div className="p-2 border-t border-black/10 dark:border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tulis kebutuhan Anda…"
              maxLength={1000}
              aria-label="Pesan chat"
              style={{ fontFamily: "'Inter','Styrene A',system-ui,-apple-system,sans-serif" }}
              className="flex-1 min-h-[48px] px-3 rounded-xl bg-black/5 dark:bg-white/10 text-[16px] text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
            />
            <button onClick={send} disabled={busy} aria-label="Kirim pesan" className="btn-solid min-h-[48px] min-w-[48px] rounded-xl !bg-black !text-white dark:!bg-white dark:!text-black flex items-center justify-center active:scale-95 disabled:opacity-50">
              <Send className="w-4 h-4 !text-white dark:!text-black" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
