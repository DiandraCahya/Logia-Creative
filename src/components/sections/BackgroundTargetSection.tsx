"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Rocket,
  CalendarCheck,
  Palette,
  PackageCheck,
  LayoutGrid,
  Code2,
  Layers,
  Workflow,
  Ticket,
  MessageSquare,
  Megaphone,
  ArrowRight,
} from "lucide-react";

const targetMarkets = [
  {
    id: "umkm",
    stepNumber: "01",
    sectorTag: "Retail, F&B, & Brand Lokal",
    title: "UMKM & Brand Lokal",
    subtitle: "Transformasi visual kemasan dan brand agar siap menembus rak retail modern.",
    tabLabel: "UMKM & Brand Lokal",
    icon: Store,
    turnaround: "5 - 7 Hari",
    problemTitle: "Tantangan Utama",
    problemText: "Produk laku keras, namun kemasan dan logo belum profesional. Sulit masuk retail karena kurangnya identitas visual yang konsisten.",
    stats: [
      { value: "+300%", label: "Daya Tarik Visual", sublabel: "Kredibilitas kemasan retail" },
      { value: "100%", label: "Master Siap Cetak", sublabel: "Vector SVG & PDF anti pecah" },
    ],
    solutions: [
      {
        icon: Palette,
        title: "Brand Guidelines",
        description: "File master SVG/PDF resolusi tinggi lengkap dengan aturan warna.",
        deliverableTag: "Vector Master",
      },
      {
        icon: PackageCheck,
        title: "Kemasan Retail",
        description: "Rancangan kemasan berstandar rak supermarket modern.",
        deliverableTag: "Die-cut File",
      },
      {
        icon: LayoutGrid,
        title: "Katalog & Medsos",
        description: "Desain katalog PDF interaktif & template feed media sosial.",
        deliverableTag: "Figma File",
      },
    ],
  },
  {
    id: "startup",
    stepNumber: "02",
    sectorTag: "Teknologi, SaaS, & Growing Business",
    title: "Startup & B2B",
    subtitle: "Arsitektur digital mutakhir, UI/UX terukur dengan konversi tinggi.",
    tabLabel: "Startup & B2B",
    icon: Rocket,
    turnaround: "10 - 14 Hari",
    problemTitle: "Tantangan Utama",
    problemText: "Butuh website rilis cepat dengan UI/UX yang rapi dan terukur, serta optimasi kecepatan untuk performa terbaik.",
    stats: [
      { value: "98+", label: "Lighthouse Score", sublabel: "Audit performa" },
      { value: "100%", label: "Design System", sublabel: "Figma tokens rapi" },
    ],
    solutions: [
      {
        icon: Code2,
        title: "Modern Web Apps",
        description: "Dibangun dengan Next.js App Router, React, dan Tailwind CSS.",
        deliverableTag: "Next.js Code",
      },
      {
        icon: Layers,
        title: "Figma System",
        description: "Sistem komponen, varian, dan prototipe interaktif.",
        deliverableTag: "Figma Master",
      },
      {
        icon: Workflow,
        title: "Form Automation",
        description: "Formulir capture langsung sinkron ke Sheets atau Webhook.",
        deliverableTag: "API Sync",
      },
    ],
  },
  {
    id: "organisasi",
    stepNumber: "03",
    sectorTag: "Kepanitiaan & Event",
    title: "Event & Organisasi",
    subtitle: "Sistem registrasi terpadu dari pendaftaran online hingga check-in venue.",
    tabLabel: "Event & Organisasi",
    icon: CalendarCheck,
    turnaround: "5 - 8 Hari",
    problemTitle: "Tantangan Utama",
    problemText: "Manajemen peserta manual yang merepotkan dan visual promosi event yang kurang terpadu.",
    stats: [
      { value: "100%", label: "Automasi", sublabel: "Tiket digital instan" },
      { value: "0 Antrean", label: "Check-in QR", sublabel: "Validasi panitia kilat" },
    ],
    solutions: [
      {
        icon: Ticket,
        title: "Event Landing Page",
        description: "Halaman web informasi acara dengan form registrasi.",
        deliverableTag: "Web Page",
      },
      {
        icon: MessageSquare,
        title: "WhatsApp Bot",
        description: "Kirim e-ticket QR code otomatis ke nomor WA peserta.",
        deliverableTag: "WA Gateway",
      },
      {
        icon: Megaphone,
        title: "Aset Visual Event",
        description: "Desain backdrop, nametag panitia, dan sertifikat.",
        deliverableTag: "Print Kit",
      },
    ],
  },
] as const;

interface Props {
  onOpenCollaboration?: () => void;
}

export function BackgroundTargetSection({ onOpenCollaboration }: Props) {
  const { ref, isInView } = useScrollReveal();
  const [activeTab, setActiveTab] = useState<typeof targetMarkets[number]["id"]>("umkm");

  const currentMarket = targetMarkets.find((m) => m.id === activeTab) || targetMarkets[0];
  const ActiveIcon = currentMarket.icon;

  return (
    <section id="portfolio" className="py-24 md:py-32 relative bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10" ref={ref}>
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-black dark:text-white mb-4">
            Target Pasar
          </h2>
          <p className="text-base text-[#666666] dark:text-[#999999]">
            Solusi yang diadaptasi khusus untuk tantangan industri Anda.
          </p>
        </div>

        {/* Minimalist Tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex p-1.5 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 overflow-x-auto hide-scrollbar max-w-full">
            {targetMarkets.map((market) => {
              const Icon = market.icon;
              const isActive = activeTab === market.id;
              return (
                <button
                  key={market.id}
                  onClick={() => setActiveTab(market.id)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap z-10 ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTargetBg"
                      className="absolute inset-0 rounded-full bg-white dark:bg-[#1A1A1A] shadow-sm border border-black/5 dark:border-white/5 -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{market.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="max-w-5xl mx-auto min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMarket.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 flex items-center justify-center shrink-0">
                    <ActiveIcon className="w-8 h-8 text-black dark:text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black dark:text-white mb-2 inline-block">
                      {currentMarket.sectorTag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
                      {currentMarket.title}
                    </h3>
                  </div>
                </div>

                <div className="md:text-right">
                  <p className="text-sm font-semibold text-black dark:text-white">Estimasi Pengerjaan:</p>
                  <p className="text-sm text-[#666666] dark:text-[#999999]">{currentMarket.turnaround}</p>
                </div>
              </div>

              {/* Grid 2 Cols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Problem & Stats */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white mb-3">
                      {currentMarket.problemTitle}
                    </h4>
                    <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed border-l-2 border-black/20 dark:border-white/20 pl-4">
                      "{currentMarket.problemText}"
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {currentMarket.stats.map((stat, i) => (
                      <div key={i} className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl">
                        <p className="text-2xl font-black text-black dark:text-white mb-1">{stat.value}</p>
                        <p className="text-xs font-semibold text-black dark:text-white">{stat.label}</p>
                        <p className="text-[10px] text-[#666666] dark:text-[#999999] mt-0.5">{stat.sublabel}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Solutions */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white mb-4">
                    Solusi Utama
                  </h4>
                  <div className="space-y-4">
                    {currentMarket.solutions.map((sol, i) => {
                      const SolIcon = sol.icon;
                      return (
                        <div key={i} className="flex gap-4 p-4 border border-black/5 dark:border-white/5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center shrink-0">
                            <SolIcon className="w-5 h-5 text-black dark:text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-bold text-sm text-black dark:text-white">{sol.title}</h5>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-black/10 dark:border-white/10 text-[#666666] dark:text-[#999999]">
                                {sol.deliverableTag}
                              </span>
                            </div>
                            <p className="text-xs text-[#666666] dark:text-[#999999] leading-relaxed">{sol.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <button
              onClick={onOpenCollaboration}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black !text-white dark:!text-black text-sm font-semibold rounded-full hover:scale-[1.02] transition-transform duration-200 inline-flex items-center gap-2 group"
            >
              <span className="!text-white dark:!text-black">Konsultasikan Bisnis Anda</span>
              <ArrowRight className="w-4 h-4 !text-white dark:!text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
