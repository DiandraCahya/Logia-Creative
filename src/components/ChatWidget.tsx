"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Msg { role: "user" | "assistant"; content: string; }

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Halo! Saya asisten Logia Creative. Ceritakan usaha & kebutuhan web/branding Anda — saya bantu rekomendasikan paket yang pas." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
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
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 min-h-[52px] min-w-[52px] rounded-full bg-black text-white dark:bg-white dark:text-black shadow-xl flex items-center justify-center active:scale-95"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
      {open && (
        <div className="fixed bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] right-4 z-40 w-[calc(100vw-2rem)] max-w-[360px] h-[60dvh] max-h-[520px] rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 font-semibold text-sm">
            Logia Assistant
          </div>
          <div ref={boxRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-2xl leading-relaxed ${m.role === "user" ? "ml-auto bg-black text-white dark:bg-white dark:text-black" : "bg-black/5 dark:bg-white/10"}`}>
                {m.content || "…"}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-black/10 dark:border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tulis kebutuhan Anda…"
              maxLength={1000}
              aria-label="Pesan chat"
              className="flex-1 min-h-[44px] px-3 rounded-xl bg-black/5 dark:bg-white/10 text-sm focus:outline-none"
            />
            <button onClick={send} disabled={busy} aria-label="Kirim pesan" className="min-h-[44px] min-w-[44px] rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center active:scale-95 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
