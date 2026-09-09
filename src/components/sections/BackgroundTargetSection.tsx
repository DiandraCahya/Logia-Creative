"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Sparkles,
  TrendingUp,
  Store,
  Rocket,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  Compass,
} from "lucide-react";

const fourPillars = [
  {
    title: "Kebutuhan Digitalisasi Bisnis",
    desc: "Pergeseran perilaku pasar menuntut setiap pelaku usaha hadir secara digital dengan infrastruktur yang cepat, responsif, dan terpercaya.",
    icon: TrendingUp,
    badge: "Urgensi Pasar",
  },
  {
    title: "Konsistensi Tampilan",
    desc: "Biar foto profil Instagram, kemasan kardus, sampai tombol checkout di website kelihatan seperti dari satu dapur yang sama.",
    icon: Sparkles,
    badge: "Bukan Desain Acak",
  },
  {
    title: "Gak Perlu Jadi Wasit Vendor",
    desc: "Desainer grafis dan programmer kami duduk di meja yang sama. Anda gak perlu pusing oper-operan file atau dengerin alasan programmer nyalahin desainer pas web gak presisi.",
    icon: RefreshCw,
    badge: "Tanpa Miskomunikasi",
  },
  {
    title: "Skema Biaya yang Masuk Akal",
    desc: "Tiap bisnis punya ritme cash flow beda-beda. Mau bayar per proyek atau langganan bulanan tanpa komitmen kontrak rumit, semuanya jelas di depan.",
    icon: SlidersHorizontal,
    badge: "Transparansi Biaya",
  },
];

const targetMarkets = [
  {
    id: "umkm",
    title: "UMKM & Brand Lokal",
    category: "Fondasi & Pertumbuhan",
    icon: Store,
    gradient: "from-brand-primary/20 via-brand-aqua/10 to-transparent",
    borderAccent: "border-brand-primary/40",
    badgeColor: "bg-brand-primary/15 text-brand-primary dark:text-brand-aqua",
    problemText:
      "Produk laku dan repeat order lancar, tapi logo masih file JPEG burem dari template gratisan. Pas mau masuk kurasi retail atau pameran, sering kurang percaya diri karena kemasannya belum seragam.",
    solutions: [
      "File master logo vector SVG/PDF (gak bakal pecah dicetak di spanduk 5 meter)",
      "Panduan warna sablon & kemasan produk fisik",
      "Katalog digital cepat tanpa perlu download PDF 50 MB",
      "Template konten sosmed yang gampang diedit tim sendiri",
    ],
  },
  {
    id: "startup",
    title: "Startup & Growing Businesses",
    category: "Skala & Akselerasi",
    icon: Rocket,
    gradient: "from-brand-aqua/20 via-brand-mint/10 to-transparent",
    borderAccent: "border-brand-aqua/40",
    badgeColor: "bg-brand-aqua/15 text-brand-aqua dark:text-brand-mint",
    problemText:
      "Ngejar rilis web dalam 4-6 minggu, tapi tim frontend pusing karena desainer freelance sebelumnya gak nyediain sistem komponen Figma yang rapi. Tampilan web jadi berat dan navigasinya ruwet.",
    solutions: [
      "Design system Figma komplit (komponen, token warna, auto-layout)",
      "Pengembangan web Next.js cepat dengan skor Google PageSpeed hijau (>90)",
      "Rekap data formulir otomatis langsung masuk database tanpa entri manual",
      "Materi kampanye digital siap pasang untuk Meta & Google Ads",
    ],
  },
  {
    id: "organisasi",
    title: "Organisasi & Event Organizer",
    category: "Aktivasi & Manajemen",
    icon: CalendarCheck,
    gradient: "from-brand-slate/20 via-brand-primary/10 to-transparent",
    borderAccent: "border-brand-slate/40",
    badgeColor: "bg-brand-slate/15 text-brand-slate dark:text-brand-aqua",
    problemText:
      "Pendaftaran peserta membludak di hari-H, formulir Google Form nge-lag, panitia kewalahan cek mutasi bukti transfer manual, dan materi promosi ukuran Instagram vs banner fisik berantakan.",
    solutions: [
      "Landing page khusus event dengan kuota tiket real-time",
      "Sistem verifikasi tiket dan pengiriman barcode WhatsApp otomatis",
      "Paket materi visual seragam (feed, lanyard panitia, backdrop panggung)",
      "Dashboard kehadiran peserta tanpa lembar absensi kertas yang rawan hilang",
    ],
  },
];

// Interactive 3D Tilt Card Component
function TiltCard({ market }: { market: (typeof targetMarkets)[0] }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const Icon = market.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className="relative rounded-3xl p-6 sm:p-8 liquid-glass-card border border-foreground/10 dark:border-white/10 hover:border-brand-aqua/50 transition-colors flex flex-col justify-between h-full group"
    >
      {/* Dynamic Background Gradient */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${market.gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />

      <div className="relative z-10 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${market.badgeColor}`}
          >
            {market.category}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-foreground/[0.04] dark:bg-white/[0.06] border border-foreground/10 dark:border-white/10 flex items-center justify-center text-brand-primary dark:text-brand-aqua group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-brand-primary dark:group-hover:text-brand-aqua transition-colors">
            {market.title}
          </h3>
          <p className="text-xs text-foreground/70 mt-2 italic leading-relaxed bg-foreground/[0.02] dark:bg-white/[0.02] p-3 rounded-xl border border-foreground/5 dark:border-white/5">
            {market.problemText}
          </p>
        </div>

        {/* Solutions List */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Fokus Solusi Disediakan:
          </p>
          <ul className="space-y-2">
            {market.solutions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-aqua mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 pt-6 mt-6 border-t border-foreground/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-brand-primary dark:text-brand-aqua">
        <span>Solusi Spesifik Industri</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
}

export function BackgroundTargetSection() {
  return (
    <section id="tentang" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass border border-brand-primary/20 text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-brand-aqua">
            <Compass className="w-3.5 h-3.5" />
            Proposal Poin 3 • Latar Belakang & Segmentasi Pasar
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Menjembatani Kesenjangan Antara{" "}
            <span className="text-gradient-brand">Kreativitas & Teknologi</span>
          </h2>
          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
            Banyak brand dan pelaku usaha berhadapan dengan dilema: memiliki tim desain namun lemah di sistem teknologi, atau memiliki sistem teknis namun kaku dalam komunikasi visual. LOGIA CREATIVE mengintegrasikan keduanya dalam satu payung layanan sinergis.
          </p>
        </div>

        {/* Problem Statement Callout Banner */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-500/10 via-brand-primary/10 to-brand-aqua/10 border border-brand-primary/20 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Tantangan Utama di Lapangan (The Gap Problem)
              </h3>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                Di lapangan, keterbatasan sumber daya membuat bisnis mengelola desain grafis dan pembuatan website secara terpisah. Akibatnya terjadi inkonsistensi citra merek, alur komunikasi tersendat, serta biaya vendor yang membengkak karena koordinasi ganda.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pilar Alasan Pembentukan Bisnis */}
        <div className="space-y-6 mb-24">
          <div className="text-left">
            <h3 className="text-2xl font-bold text-foreground">
              4 Pilar Strategis Nilai Bisnis Logia
            </h3>
            <p className="text-xs sm:text-sm text-foreground/70 mt-1">
              Mengapa perpaduan solusi Logia Creative esensial bagi ekosistem bisnis modern.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fourPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 rounded-3xl liquid-glass border border-foreground/10 dark:border-white/10 hover:border-brand-primary/40 transition-all space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary dark:text-brand-aqua flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 px-2 py-0.5 rounded-full bg-foreground/[0.04] dark:bg-white/[0.04]">
                      Pilar 0{idx + 1}
                    </span>
                  </div>
                  <span className="inline-block text-[11px] font-semibold text-brand-aqua">
                    {pillar.badge}
                  </span>
                  <h4 className="text-base font-bold text-foreground">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Target Market Interactive 3D Cards */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-aqua">
              Segmentasi Pengguna
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              Target Pasar & Portofolio Solusi Spesifik
            </h3>
            <p className="text-xs sm:text-sm text-foreground/70">
              Setiap segmen memiliki karakteristik unik. Jelajahi bagaimana kami mengadaptasi layanan untuk menjawab tantangan spesifik mereka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {targetMarkets.map((market) => (
              <TiltCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
