"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Target,
  Sparkles,
  Lightbulb,
  Award,
  CheckCircle2,
  Workflow,
  Compass,
} from "lucide-react";

export function CompanyProfileSection() {
  const [activeTab, setActiveTab] = useState<"visi" | "misi" | "filosofi">("visi");

  const missions = [
    {
      title: "Aset Desain Siap Pakai",
      desc: "Bukan sekadar mockup indah di layar. Kami kirimkan paket vector lengkap (SVG, PDF, EPS), palet warna CMYK/RGB siap cetak, dan lisensi font resmi untuk tim Anda.",
    },
    {
      title: "Kode Web Bersih & Cepat",
      desc: "Membangun website Next.js modern yang dimuat di bawah 1 detik tanpa tumpukan plugin pihak ketiga yang rawan bikin web crash.",
    },
    {
      title: "Komunikasi Tanpa Jargon",
      desc: "Menjelaskan opsi teknis dengan bahasa yang jelas, estimasi waktu realistis, dan serah-terima hak cipta serta repositori penuh ke tangan Anda.",
    },
    {
      title: "Otomasi yang Menghemat Waktu",
      desc: "Menggunakan AI dan script automasi untuk memangkas tugas repetitif, sehingga biaya produksi tetap hemat dan hasil kerja selesai lebih cepat.",
    },
  ];

  const brandPillars = [
    {
      title: "Logika & Kreativitas",
      desc: "Nama LOGIA menggabungkan daya nalar logis sistemik (Logic) dan kebebasan ekspresi visual (Creativity).",
    },
    {
      title: "Tetesan Ide ke Dampak",
      desc: "Aksen tetesan air di atas huruf 'i' pada logo melambangkan gagasan kreatif murni yang menetes dan berkembang menjadi dampak nyata bagi bisnis.",
    },
    {
      title: "Tipografi Dinamis Bersambung",
      desc: "Bentuk huruf 'l' dan 'g' yang mengalir merepresentasikan fleksibilitas adaptasi agensi terhadap dinamika kebutuhan industri klien.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Pill & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass border border-brand-primary/20 text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-brand-aqua">
            <Sparkles className="w-3.5 h-3.5" />
            Proposal Poin 4 • Profil Agensi, Visi, Misi & Filosofi
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Fondasi Nilai & Arah Langkah{" "}
            <span className="text-gradient-brand">LOGIA CREATIVE</span>
          </h2>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            Membantu bisnis lokal dan perintis usaha membangun identitas visual yang profesional serta infrastruktur web yang stabil, tanpa jebakan biaya tersembunyi atau bahasa teknis yang membingungkan.
          </p>
        </div>

        {/* Interactive Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="p-1.5 rounded-full liquid-glass-pill border border-foreground/10 dark:border-white/10 flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("visi")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "visi"
                  ? "bg-brand-primary text-white shadow-md"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Visi Perusahaan</span>
            </button>

            <button
              onClick={() => setActiveTab("misi")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "misi"
                  ? "bg-brand-primary text-white shadow-md"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]"
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Misi Strategis</span>
            </button>

            <button
              onClick={() => setActiveTab("filosofi")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "filosofi"
                  ? "bg-brand-primary text-white shadow-md"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Filosofi Identitas</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === "visi" && (
            <motion.div
              key="visi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="p-8 sm:p-12 rounded-3xl liquid-glass-card border border-brand-primary/30 max-w-4xl mx-auto text-center space-y-6 shadow-glass-glow"
            >
              <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-primary/15 text-brand-primary flex items-center justify-center">
                <Eye className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-aqua">
                Visi Jangka Panjang
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
                &ldquo;Menjadi mitra kreatif dan teknologi terdepan yang memberdayakan bisnis di Indonesia melalui integrasi identitas visual yang berkarakter dan solusi digital yang berdampak nyata.&rdquo;
              </h3>
              <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs text-foreground/75">
                <span className="px-4 py-1.5 rounded-full bg-foreground/[0.04] dark:bg-white/[0.05] border border-foreground/10">
                  Target: 100+ Bisnis Terbantu
                </span>
                <span className="px-4 py-1.5 rounded-full bg-foreground/[0.04] dark:bg-white/[0.05] border border-foreground/10">
                  Standar Mutu: High-End UI & UX
                </span>
                <span className="px-4 py-1.5 rounded-full bg-foreground/[0.04] dark:bg-white/[0.05] border border-foreground/10">
                  Orientasi: ROI & Pertumbuhan Klien
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === "misi" && (
            <motion.div
              key="misi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              {missions.map((m, idx) => (
                <div
                  key={m.title}
                  className="p-6 rounded-3xl liquid-glass border border-foreground/10 dark:border-white/10 hover:border-brand-primary/40 transition-all space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary font-bold text-sm flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-foreground">{m.title}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed pl-11">
                    {m.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "filosofi" && (
            <motion.div
              key="filosofi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto"
            >
              <div className="lg:col-span-5 p-8 rounded-3xl liquid-glass border border-brand-primary/30 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative w-44 h-20">
                  <Image
                    src="/LOGO.png"
                    alt="Logo Logia"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative w-32 h-8">
                  <Image
                    src="/Group 1.png"
                    alt="Creative Wordmark"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-brand-aqua font-mono uppercase tracking-wider">
                  Harmoni Warna: Sky Blue • Aqua • Mint • Deep Navy
                </p>
              </div>

              <div className="lg:col-span-7 space-y-4">
                {brandPillars.map((bp) => (
                  <div
                    key={bp.title}
                    className="p-5 rounded-2xl liquid-glass border border-foreground/10 dark:border-white/10 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-brand-primary dark:text-brand-aqua text-sm font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>{bp.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
                      {bp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
