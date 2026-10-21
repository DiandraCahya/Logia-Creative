"use client";

import React, { useState } from "react";
import { openCollaborationModal } from "@/components/CollaborationManager";
import { useScrollReveal } from "@/lib/useScrollReveal";
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
      },
      {
        icon: PackageCheck,
        title: "Kemasan Retail",
        description: "Rancangan kemasan berstandar rak supermarket modern.",
      },
      {
        icon: LayoutGrid,
        title: "Katalog & Medsos",
        description: "Desain katalog PDF interaktif & template feed media sosial.",
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
    <section id="target-pasar" className="py-12 md:py-20 relative bg-transparent">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10" ref={ref}>
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-righteous text-[clamp(2.1rem,4.5vw,3.75rem)] tracking-normal text-black dark:text-white mb-4">
            Target Pasar
          </h2>
          <p className="text-base text-[#666666] dark:text-[#999999]">
            Solusi yang diadaptasi khusus untuk tantangan industri Anda.
          </p>
        </div>

        {/* Individual Tab Buttons tanpa card pembungkus */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16" role="tablist" aria-label="Target pasar">
          {targetMarkets.map((market) => {
            const Icon = market.icon;
            const isActive = activeTab === market.id;
            return (
              <button
                key={market.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(market.id)}
                className={`px-5 py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap border ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md backdrop-blur-md"
                    : "bg-white/60 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/20 border-black/10 dark:border-white/15 backdrop-blur-md shadow-sm"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{market.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="max-w-5xl mx-auto">
          <div
            key={currentMarket.id}
            className="glass-card rounded-[2rem] p-5 sm:p-12 animate-fade-up"
          >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-6 sm:mb-10 pb-6 sm:pb-8 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 flex items-center justify-center shrink-0">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                {/* Left: Problem & Stats */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white mb-3">
                      {currentMarket.problemTitle}
                    </h4>
                    <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed border-l-2 border-black/20 dark:border-white/20 pl-4">
                      &ldquo;{currentMarket.problemText}&rdquo;
                    </p>
                  </div>
                  {/* Metrik: 1 kolom di layar sempit supaya teks tidak terpotong */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {currentMarket.stats.map((stat, i) => (
                      <div key={i} className="p-4 glass-card rounded-xl">
                        <p className="text-2xl font-black text-black dark:text-white mb-1">{stat.value}</p>
                        <p className="text-xs font-semibold text-black dark:text-white">{stat.label}</p>
                        <p className="text-[10px] max-sm:text-[11px] text-[#666666] dark:text-[#999999] mt-0.5">{stat.sublabel}</p>
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
                        <div key={i} className="flex gap-4 p-4 glass-card rounded-xl transition-all hover:scale-[1.01]">
                          <div className="w-10 h-10 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center shrink-0">
                            <SolIcon className="w-5 h-5 text-black dark:text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h5 className="font-bold text-sm text-black dark:text-white">{sol.title}</h5>
                              {"deliverableTag" in sol && sol.deliverableTag ? (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-black/10 dark:border-white/10 text-[#666666] dark:text-[#999999]">
                                  {sol.deliverableTag}
                                </span>
                              ) : null}
                            </div>
                            <p className="text-xs text-[#666666] dark:text-[#999999] leading-relaxed">{sol.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (onOpenCollaboration) onOpenCollaboration();
                else openCollaborationModal();
              }}
              className="btn-solid px-6 py-3 min-h-[44px] bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 inline-flex items-center gap-2 group"
            >
              <span>Konsultasikan Bisnis Anda</span>
              <ArrowRight className="w-4 h-4 text-white dark:text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
