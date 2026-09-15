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
  Printer,
  Code2,
  Layers,
  Workflow,
  Gauge,
  Ticket,
  MessageSquare,
  Megaphone,
  QrCode,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SolutionItem {
  icon: React.ElementType;
  title: string;
  description: string;
  deliverableTag: string;
}

interface StatMetric {
  value: string;
  label: string;
  sublabel: string;
}

interface TargetMarket {
  id: "umkm" | "startup" | "organisasi";
  stepNumber: string;
  sectorTag: string;
  title: string;
  subtitle: string;
  tabLabel: string;
  icon: React.ElementType;
  turnaround: string;
  accentBadge: string;
  glowGradient: string;
  activeTabGradient: string;
  accentColorClass: string;
  problemTitle: string;
  problemText: string;
  stats: StatMetric[];
  solutions: SolutionItem[];
  tools: string[];
}

const targetMarkets: readonly TargetMarket[] = [
  {
    id: "umkm",
    stepNumber: "01",
    sectorTag: "Retail, F&B, & Brand Lokal",
    title: "UMKM & Brand Lokal",
    subtitle: "Transformasi visual kemasan dan brand agar siap menembus rak retail modern dan bersaing di pasar nasional.",
    tabLabel: "UMKM & Brand Lokal",
    icon: Store,
    turnaround: "5 - 7 Hari Kerja",
    accentBadge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    glowGradient: "from-amber-500/20 via-orange-500/15 to-rose-500/5",
    activeTabGradient: "from-amber-500 via-orange-500 to-amber-600",
    accentColorClass: "text-amber-600 dark:text-amber-400",
    problemTitle: "Tantangan Nyata di Lapangan",
    problemText: "Produk laku keras, namun kemasan dan logo belum profesional. Sulit masuk retail karena kurangnya identitas visual yang konsisten.",
    stats: [
      { value: "+300%", label: "Daya Tarik Visual", sublabel: "Kredibilitas kemasan retail" },
      { value: "100%", label: "Master Siap Cetak", sublabel: "Vector SVG & PDF anti pecah" },
      { value: "< 7 Hari", label: "Siklus Kerja Cepat", sublabel: "Revisi terarah hingga siap cetak" },
    ],
    solutions: [
      {
        icon: Palette,
        title: "Logo Vector & Brand Guidelines",
        description: "File master SVG/PDF resolusi tinggi untuk neon box, spanduk, hingga stiker kecil lengkap dengan aturan warna CMYK/RGB.",
        deliverableTag: "Master Vector & PDF",
      },
      {
        icon: PackageCheck,
        title: "Kemasan & Label Produk Retail",
        description: "Rancangan box makanan, pouch ziplock, label botol, dan stiker segel higienis berstandar rak supermarket.",
        deliverableTag: "Die-cut Siap Cetak",
      },
      {
        icon: LayoutGrid,
        title: "Katalog Digital & Template Medsos",
        description: "Desain katalog PDF interaktif untuk sales WhatsApp serta bundle template feed & story Instagram/TikTok siap edit.",
        deliverableTag: "Figma & Canva File",
      },
      {
        icon: Printer,
        title: "Aset Promosi & Toko Fisik",
        description: "Banner standing roll-up, kartu thank-you note pengiriman marketplace, dan kartu nama resmi siap kirim ke percetakan.",
        deliverableTag: "Aset Digital & Cetak",
      },
    ],
    tools: ["Adobe Illustrator", "Photoshop", "Brand Book PDF", "Figma", "Pantone CMYK"],
  },
  {
    id: "startup",
    stepNumber: "02",
    sectorTag: "Teknologi, SaaS, & Growing Business",
    title: "Startup & Growing Businesses",
    subtitle: "Arsitektur digital mutakhir, UI/UX terukur dengan konversi tinggi, serta performa web instan tanpa jeda.",
    tabLabel: "Startup & Growing Businesses",
    icon: Rocket,
    turnaround: "10 - 14 Hari Kerja",
    accentBadge: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    glowGradient: "from-blue-600/20 via-indigo-600/15 to-violet-600/5",
    activeTabGradient: "from-blue-600 via-indigo-600 to-violet-600",
    accentColorClass: "text-blue-600 dark:text-blue-400",
    problemTitle: "Tantangan Nyata di Lapangan",
    problemText: "Butuh website rilis cepat dengan UI/UX yang rapi dan terukur, serta optimasi kecepatan untuk performa terbaik.",
    stats: [
      { value: "98+", label: "Lighthouse Score", sublabel: "Audit performa & best practices" },
      { value: "< 1.2s", label: "Loading Speed (LCP)", sublabel: "Akses kilat di jaringan seluler" },
      { value: "100%", label: "Figma Design System", sublabel: "Auto-layout & design tokens rapi" },
    ],
    solutions: [
      {
        icon: Code2,
        title: "Modern Web Apps (Next.js)",
        description: "Dibangun dengan Next.js App Router, React, dan Tailwind CSS. Kode bersih, terstruktur rapi, dan cepat dimuat.",
        deliverableTag: "Next.js & TypeScript",
      },
      {
        icon: Layers,
        title: "Design System Figma Komprehensif",
        description: "Sistem komponen terstandarisasi, varian button, token warna, mode terang/gelap, dan prototipe interaktif.",
        deliverableTag: "Figma Master File",
      },
      {
        icon: Workflow,
        title: "Automasi Formulir & Integrasi API",
        description: "Formulir lead capture langsung tersinkron ke Google Sheets, WhatsApp Gateway, atau Webhook CRM bisnis Anda.",
        deliverableTag: "Webhook & API Sync",
      },
      {
        icon: Gauge,
        title: "SEO On-Page & Optimasi Konversi",
        description: "Arsitektur semantic HTML5, dynamic OpenGraph meta tag, sitemap XML, dan layout navigasi berfokus konversi.",
        deliverableTag: "Core Web Vitals Ready",
      },
    ],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Figma", "Vercel"],
  },
  {
    id: "organisasi",
    stepNumber: "03",
    sectorTag: "Kepanitiaan, Komunitas, & Event Skala Besar",
    title: "Event & Organisasi",
    subtitle: "Ekosistem visual terpadu 360° dan sistem registrasi peserta otomatis dari pendaftaran online hingga venue acara.",
    tabLabel: "Event & Organisasi",
    icon: CalendarCheck,
    turnaround: "5 - 8 Hari Kerja",
    accentBadge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    glowGradient: "from-emerald-500/20 via-teal-500/15 to-cyan-500/5",
    activeTabGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accentColorClass: "text-emerald-600 dark:text-emerald-400",
    problemTitle: "Tantangan Nyata di Lapangan",
    problemText: "Manajemen peserta manual yang merepotkan dan visual promosi event yang kurang terpadu dari online hingga offline.",
    stats: [
      { value: "100%", label: "Automasi Registrasi", sublabel: "Tiket digital instan via WhatsApp" },
      { value: "0 Antrean", label: "Check-in QR Code", sublabel: "Validasi kilat panitia di venue" },
      { value: "360°", label: "Keseragaman Visual", sublabel: "Dari feed IG hingga backdrop panggung" },
    ],
    solutions: [
      {
        icon: Ticket,
        title: "Landing Page Event & Registrasi",
        description: "Landing page informasi acara, jadwal rundown interaktif, speaker profile, dan formulir pendaftaran peserta terintegrasi.",
        deliverableTag: "Landing Page Siap Pakai",
      },
      {
        icon: MessageSquare,
        title: "Sistem Tiket & Notifikasi WhatsApp",
        description: "Kirim invoice, e-ticket ber-QR code, dan reminder acara otomatis langsung ke nomor WhatsApp peserta tanpa repot manual.",
        deliverableTag: "WhatsApp API Gateway",
      },
      {
        icon: Megaphone,
        title: "Aset Visual Event (Venue & Online)",
        description: "Desain backdrop panggung utama, roll-up banner, photobooth, nametag lanyard peserta, dan sertifikat siap cetak.",
        deliverableTag: "Backdrop & ID Card Kit",
      },
      {
        icon: QrCode,
        title: "Sistem Validasi Tiket di Venue",
        description: "Halaman web scanner QR code untuk panitia tiket di pintu masuk tanpa perlu download aplikasi tambahan.",
        deliverableTag: "Web Scanner Ready",
      },
    ],
    tools: ["Landing Page", "WhatsApp API", "QR Code Gateway", "Figma", "Illustrator"],
  },
] as const;

interface BackgroundTargetSectionProps {
  onOpenCollaboration?: () => void;
}

export function BackgroundTargetSection({ onOpenCollaboration }: BackgroundTargetSectionProps) {
  const { ref, isInView } = useScrollReveal();
  const [activeTab, setActiveTab] = useState<typeof targetMarkets[number]["id"]>("umkm");

  const currentMarket = targetMarkets.find((m) => m.id === activeTab) || targetMarkets[0];

  const handleActionClick = () => {
    if (onOpenCollaboration) {
      onOpenCollaboration();
    } else {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="portfolio" className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10" ref={ref}>
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>02 — Target Pasar & Solusi Terarah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tighter text-slate-900 dark:text-white mb-6">
            Solusi Spesifik Untuk Kebutuhan Anda
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mx-auto max-w-2xl leading-relaxed">
            Setiap industri memiliki tantangan unik. Kami mengadaptasi layanan kami untuk memberikan dampak maksimal pada skala bisnis Anda.
          </p>
        </div>

        {/* Tab Switcher (Fluid Liquid Glass Pill Navbar) */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="glass-container p-1.5 sm:p-2 !rounded-2xl sm:!rounded-full inline-flex items-center gap-1.5 sm:gap-2 max-w-full overflow-x-auto hide-scrollbar shadow-xl border border-slate-200/80 dark:border-white/15 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
            {targetMarkets.map((market) => {
              const Icon = market.icon;
              const isActive = activeTab === market.id;
              return (
                <button
                  key={market.id}
                  onClick={() => setActiveTab(market.id)}
                  className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 sm:gap-2.5 whitespace-nowrap z-10 select-none ${
                    isActive
                      ? "text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5"
                  }`}
                >
                  {/* Sliding active pill indicator with Framer Motion spring physics */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTargetIndicator"
                      className={`absolute inset-0 rounded-xl sm:rounded-full bg-gradient-to-r ${market.activeTabGradient} -z-10 shadow-lg shadow-blue-500/20`}
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span
                    className={`text-[10px] sm:text-xs font-mono px-1.5 py-0.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {market.stepNumber}
                  </span>
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                  <span>{market.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Display: Premium Multi-Layered Market Card */}
        <div className="max-w-6xl mx-auto relative min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMarket.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Dynamic ambient glow behind card */}
              <div
                className={`absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-[100px] pointer-events-none opacity-60 dark:opacity-40 bg-gradient-to-br ${currentMarket.glowGradient}`}
              />
              <div
                className={`absolute -bottom-20 -left-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full blur-[90px] pointer-events-none opacity-50 dark:opacity-30 bg-gradient-to-tr ${currentMarket.glowGradient}`}
              />

              {/* Main Card Container */}
              <div className="glass-container !rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-white/15 bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                {/* Header ribbon inside card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-slate-200/70 dark:border-white/10 mb-8">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${currentMarket.glowGradient} border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white shadow-inner`}
                    >
                      <currentMarket.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${currentMarket.accentBadge}`}
                        >
                          {currentMarket.sectorTag}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                          Pilihan #{currentMarket.stepNumber}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {currentMarket.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>Estimasi: {currentMarket.turnaround}</span>
                    </div>
                  </div>
                </div>

                {/* Subtitle hook */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-3xl">
                  {currentMarket.subtitle}
                </p>

                {/* Split Grid: Left = Tantangan & Dampak; Right = Solusi Nyata & Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                  {/* Left Column (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    {/* Problem Statement Card */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-rose-500/[0.04] dark:bg-rose-500/[0.06] border border-rose-500/20 relative">
                      <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{currentMarket.problemTitle}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-2 border-rose-500/50 pl-3.5">
                        &ldquo;{currentMarket.problemText}&rdquo;
                      </p>
                    </div>

                    {/* Measurable Impact / Metrics Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>Dampak & Standar Kualitas</span>
                        </h4>
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {currentMarket.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="p-3 sm:p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 text-center flex flex-col justify-center"
                          >
                            <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                              {stat.value}
                            </span>
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                              {stat.label}
                            </span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight hidden sm:block">
                              {stat.sublabel}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive CTA */}
                    <div className="pt-2 space-y-3">
                      <button
                        onClick={handleActionClick}
                        className="w-full grad-cta py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                      >
                        <span>Konsultasikan Kebutuhan {currentMarket.title}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Diskusi awal tanpa komitmen biaya & audit singkat</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (7 Cols): Detailed Solutions & Deliverables */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Solusi & Output yang Anda Terima</span>
                        </h4>
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                          {currentMarket.solutions.length} Layanan Unggulan
                        </span>
                      </div>

                      {/* 2x2 Grid of Rich Solution Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {currentMarket.solutions.map((item, i) => {
                          const ItemIcon = item.icon;
                          return (
                            <div
                              key={i}
                              className="p-4 sm:p-4.5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300 hover:shadow-md flex flex-col justify-between group"
                            >
                              <div className="space-y-2.5 mb-3">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <ItemIcon className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                                    {item.deliverableTag}
                                  </span>
                                </div>
                                <div>
                                  <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                  </h5>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tools & Ecosystem Pills */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                        Tools & Standar:
                      </span>
                      {currentMarket.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
