import { NextRequest } from "next/server";
import { SOLUTIONS, priceLabel } from "@/lib/rate-card";

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const WINDOW_MS = 60_000;
const MAX_HITS = 10;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_HITS;
}

const MENU = SOLUTIONS.map(
  (s) =>
    `${s.name}:\n` +
    s.packages
      .map((p) => `- ${p.name}: ${priceLabel(p)}. ${p.tagline}`)
      .join("\n")
).join("\n\n");

const SYSTEM = `Kamu asisten Logia Creative, Bahasa Indonesia santai-sopan. Scope HANYA: layanan web/app/branding/konten/otomasi Logia + paket di bawah. Tolak topik lain singkat + arahkan ke layanan.

Alur: gali kebutuhan (jenis usaha, tujuan, fitur, budget, deadline), jelaskan konsep singkat, rekomendasikan MAKSIMAL 2 paket dari daftar (jangan mengarang harga/layanan; jika tidak cocok arahkan isi form kolaborasi). Rate Card punya 3 kategori solusi: Technology Solution, Creative Solution, Integrated Solution.

Daftar paket:\n${MENU}\n\nJika user cocok, ajak isi form kolaborasi (tombol di navbar) dan sebut nama paketnya agar ter-prefill. Jawaban ringkas, mobile-friendly, maks 120 kata. Selalu jawab dengan teks polos: JANGAN pakai bold (**), italic (*), heading (#), atau bullet markdown. Gunakan kalimat pendek yang mengalir natural seperti percakapan manusia. JIKA ada pilihan, opsi, atau langkah, WAJIB tulis sebagai numbered list ke bawah (1. 2. 3.), satu item per baris, jangan digabung horizontal dalam satu paragraf.

Ketika user sudah menyebut NAMA + KONTAK (WA/email) + minimal 1 layanan/paket, akhiri jawabanmu dengan blok data persis format ini (satu baris JSON valid di dalam code fence, jangan ubah key):
\`\`\`collab {"name":"...","brandName":"...","contact":"...","budget":"...","services":["WEB STARTER"],"notes":"ringkasan kebutuhan"}\`\`\`
services WAJIB berisi nama paket persis dari daftar (cth. WEB STARTER, BRAND STARTER, ULTIMATE PARTNER). Sebutkan juga kategori solusinya bila relevan. Blok ini disembunyikan dari user dan dipakai mengisi form otomatis.`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return new Response(JSON.stringify({ error: "Ramai banget! Coba lagi semenit ya." }), { status: 429 });
  }
  const key = process.env.GROQ_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "Chat belum dikonfigurasi." }), { status: 500 });

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Body tidak valid." }), { status: 400 });
  }
  const hist = (body.messages || [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-8)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1000) }));
  if (!hist.length) return new Response(JSON.stringify({ error: "Pesan kosong." }), { status: 400 });

  let upstream: Response;
  try {
    upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, stream: true, messages: [{ role: "system", content: SYSTEM }, ...hist] }),
    });
  } catch {
    return new Response(JSON.stringify({ error: "Koneksi AI gagal. Coba lagi." }), { status: 502 });
  }
  if (upstream.status === 429) {
    return new Response(JSON.stringify({ error: "AI lagi sibuk. Tunggu sebentar ya." }), { status: 429 });
  }
  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: "AI error. Coba lagi." }), { status: 502 });
  }
  // ponytail: SSE passthrough, tanpa parse; upgrade: filter tool_call kalau pakai function calling
  return new Response(upstream.body, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
