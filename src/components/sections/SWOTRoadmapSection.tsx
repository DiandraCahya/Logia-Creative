"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  AlertOctagon,
  Milestone,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// SWOT Data
const swotQuadrants = [
  {
    type: "Strengths (Kekuatan)",
    id: "strengths",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    summary: "Tanpa birokrasi lapis empat. Desain dan kode dieksekusi di satu meja.",
    points: [
      "Klien berdiskusi langsung dengan orang yang memegang Figma dan menulis kode, bukan perantara akun manajer.",
      "Desain yang disetujui dijamin 100% presisi saat online di browser, bukan sekadar gambar mockup statis.",
      "Kecepatan iterasi tinggi; revisi tata letak dan pengujian kode dilakukan paralel tanpa oper-operan tiket.",
      "Transparansi total atas aset sumber; semua file master vector dan repositori kode diserahkan penuh ke klien.",
    ],
  },
  {
    type: "Weaknesses (Kelemahan)",
    id: "weaknesses",
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    summary: "Kapasitas tim terkurasi, menolak model pabrik massal.",
    points: [
      "Slot proyek dibatasi maksimal 4-6 klien aktif per bulan demi menjaga ketelitian pengerjaan.",
      "Portofolio agensi fokus pada brand berkembang dan UMKM progresif, belum menyasar konglomerasi multinasional.",
      "Belum menyediakan layanan operasional offline seperti penyewaan booth fisik atau kru event di lapangan.",
    ],
  },
  {
    type: "Opportunities (Peluang)",
    id: "opportunities",
    icon: Lightbulb,
    color: "text-brand-aqua",
    bgColor: "bg-brand-aqua/10",
    borderColor: "border-brand-aqua/30",
    summary: "Ratusan brand lokal butuh naik kelas dari visual amatir.",
    points: [
      "Banyak brand lokal beromset ratusan juta yang kemasan dan webnya masih memakai template gratisan rentan pecah.",
      "Software house teknis kerap kekurangan desainer antarmuka (UI/UX) khusus untuk produk digital klien mereka.",
      "Kebutuhan sistem registrasi tiket online dan dashboard kuota mandiri untuk event komunitas dan pameran kreatif.",
      "Tingginya permintaan kontrak pemeliharaan bulanan agar website tidak usang dan terhindar dari malware.",
    ],
  },
  {
    type: "Threats (Ancaman)",
    id: "threats",
    icon: AlertOctagon,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    summary: "Perang harga template bajakan dan konten AI instan tanpa jiwa.",
    points: [
      "Jasa instan serba 500 ribu yang memakai tema bajakan; klien sering merugi dan akhirnya keluar biaya renovasi lebih mahal.",
      "Banjir gambar AI generatif instan yang terlihat ramai tetapi tidak memiliki panduan karakter merek yang konsisten.",
      "Fluktuasi alokasi anggaran klien saat menghadapi ketidakpastian pasar musiman.",
    ],
  },
];

// 5-Year Roadmap Data
const roadmapYears = [
  {
    year: "Tahun 1",
    phase: "Inkubasi & Validasi Pasar",
    targetKPI: "20+ Proyek Terlayani",
    focus: "Membangun kredibilitas, validasi product-market fit, dan portofolio awal.",
    milestones: [
      "Akuisisi 20+ klien perdana dari segmen UMKM lokal dan startup tahap awal.",
      "Standardisasi SOP integrasi pengerjaan Creative + Web Development.",
      "Peluncuran landing page resmi Logia Creative dan lead funnel otomatis.",
      "Memperoleh tingkat kepuasan klien (CSAT) di atas 95%.",
    ],
  },
  {
    year: "Tahun 2",
    phase: "Ekspansi Layanan & Penetrasi",
    targetKPI: "50+ Klien & Retainer Aktif",
    focus: "Menambah vertikal layanan komersial bernilai tinggi.",
    milestones: [
      "Ekspansi ke produksi video komersial, motion graphics, dan digital performance ads.",
      "Mengonversi 35% klien proyek menjadi kontrak retainer tahunan berkelanjutan.",
      "Perekrutan spesialis UI/UX desainer dan senior frontend developer tambahan.",
      "Membangun dashboard klien terpadu untuk monitoring revisi proyek secara mandiri.",
    ],
  },
  {
    year: "Tahun 3",
    phase: "Skalabilitas Tim & Studio Fisik",
    targetKPI: "Studio Fisik & 15+ Core Members",
    focus: "Mendirikan ruang kreatif fisik dan memperluas kapasitas tampung proyek.",
    milestones: [
      "Pendirian studio fisik Logia Creative sebagai creative hub & production lab.",
      "Kemitraan strategis dengan institusi pendidikan untuk program magang talenta muda.",
      "Ekspansi menangani klien tingkat korporat menengah dan instansi swasta nasional.",
      "Peningkatan infrastruktur komputasi dan lisensi software enterprise.",
    ],
  },
  {
    year: "Tahun 4",
    phase: "Diversifikasi Produk Kreatif",
    targetKPI: "Multiple Revenue Streams",
    focus: "Menciptakan recurring income non-layanan langsung.",
    milestones: [
      "Peluncuran digital asset marketplace (UI kit, mockup library, template siap pakai).",
      "Penyelenggaraan workshop branding & coding intensif untuk talenta lokal.",
      "Pengembangan micro-SaaS untuk automasi pelaporan bisnis UMKM.",
      "Membuka cabang representatif layanan di kota besar sekunder.",
    ],
  },
  {
    year: "Tahun 5",
    phase: "Konsolidasi Industri Nasional",
    targetKPI: "Top-Tier Agency Benchmark",
    focus: "Menjadi tolok ukur agensi kreatif & teknologi di Indonesia.",
    milestones: [
      "Menjadi rujukan agensi kreatif & teknologi terkemuka dengan reputasi nasional.",
      "Penghargaan industri pada kompetisi desain dan inovasi web bergengsi.",
      "Portofolio terverifikasi melayani lebih dari 300+ entitas bisnis lintas sektor.",
      "Inisiasi ekspansi proyek remote untuk klien mancanegara (Asia Tenggara).",
    ],
  },
];

export function SWOTRoadmapSection() {
  const [selectedYear, setSelectedYear] = useState(0);
  const [expandedSWOT, setExpandedSWOT] = useState<string | null>("strengths");
  const { ref: headerRef, isInView: headerVisible } = useScrollReveal();
  const { ref: swotRef, isInView: swotVisible } = useScrollReveal();
  const { ref: roadmapRef, isInView: roadmapVisible } = useScrollReveal();

  return (
    <section id="swot-roadmap" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto space-y-4 mb-16 heading-entrance ${headerVisible ? 'revealed' : ''}`}>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass border border-brand-primary/20 text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-brand-aqua">
            <Milestone className="w-3.5 h-3.5" />
            Proposal Poin 4 • Analisis SWOT & Peta Jalan 5 Tahun
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Analisis Posisi Strategis &{" "}
            <span className="text-gradient-brand">Rencana 5 Tahun</span>
          </h2>
          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
            Menghadapi dinamika pasar dengan pemahaman objektif atas kekuatan, kelemahan, peluang, dan ancaman, dipandu tahapan pertumbuhan bisnis yang terukur hingga 5 tahun ke depan.
          </p>
        </div>

        {/* PART 1: Interactive SWOT Matrix */}
        <div className="mb-24 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Matriks Analisis SWOT Interaktif
              </h3>
              <p className="text-xs sm:text-sm text-foreground/70">
                Klik kuadran untuk mengeksplorasi poin rincian mitigasi dan strategi agensi.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-primary font-medium">
              <Sparkles className="w-4 h-4" />
              <span>4-Quadrant Evaluated Matrix</span>
            </div>
          </div>

          <div ref={swotRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {swotQuadrants.map((q, idx) => {
              const Icon = q.icon;
              const isExpanded = expandedSWOT === q.id;

              return (
                <div
                  key={q.id}
                  onClick={() => setExpandedSWOT(isExpanded ? null : q.id)}
                  className={`p-6 sm:p-7 rounded-3xl liquid-glass border transition-all cursor-pointer micro-lift morph-card-hover scroll-reveal stagger-${idx + 1} ${swotVisible ? 'revealed' : ''} ${
                    isExpanded
                      ? `${q.borderColor} shadow-lg shadow-black/5`
                      : "border-foreground/10 dark:border-white/10 hover:border-foreground/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl ${q.bgColor} ${q.color} flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground">
                        {q.type}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-foreground/[0.04] dark:bg-white/[0.05] text-foreground/70">
                      {isExpanded ? "Tutup" : "Buka Detail"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/80 font-medium mb-3">
                    {q.summary}
                  </p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2.5 pt-3 border-t border-foreground/10 dark:border-white/10 overflow-hidden"
                      >
                        {q.points.map((pt, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs text-foreground/75 leading-relaxed"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${q.bgColor}`} />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* PART 2: 5-Year Roadmap Scrollytelling */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-aqua">
              Strategic Timeline
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              Peta Jalan Pertumbuhan 5 Tahun (5-Year Roadmap)
            </h3>
            <p className="text-xs sm:text-sm text-foreground/70">
              Tahapan evolusi terencana dari validasi awal hingga menjadi entitas rujukan nasional.
            </p>
          </div>

          {/* Year Buttons / Stepper */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {roadmapYears.map((ry, index) => {
              const active = selectedYear === index;
              return (
                <button
                  key={ry.year}
                  onClick={() => setSelectedYear(index)}
                  className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    active
                      ? "bg-gradient-to-r from-brand-primary to-brand-aqua text-white shadow-md shadow-brand-primary/30 scale-105"
                      : "liquid-glass text-foreground/70 hover:text-foreground border border-foreground/10 dark:border-white/10"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ry.year}</span>
                </button>
              );
            })}
          </div>

          {/* Active Year Detail Showcase Card */}
          <div ref={roadmapRef} className={`p-8 sm:p-10 rounded-3xl liquid-glass-card border border-brand-primary/30 max-w-4xl mx-auto shadow-glass-glow relative overflow-hidden scroll-reveal-scale ${roadmapVisible ? 'revealed' : ''}`}>
            {/* Background year watermark */}
            <span className="absolute -right-6 -bottom-8 text-8xl sm:text-9xl font-extrabold text-foreground/[0.03] dark:text-white/[0.03] select-none pointer-events-none">
              0{selectedYear + 1}
            </span>

            <div className="space-y-6 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-foreground/10 dark:border-white/10">
                <div>
                  <span className="text-xs font-bold text-brand-primary dark:text-brand-aqua uppercase tracking-widest">
                    {roadmapYears[selectedYear].year}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                    {roadmapYears[selectedYear].phase}
                  </h4>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-brand-aqua/15 text-brand-aqua border border-brand-aqua/30 text-xs font-bold self-start sm:self-center">
                  Target KPI: {roadmapYears[selectedYear].targetKPI}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed italic bg-foreground/[0.02] dark:bg-white/[0.03] p-4 rounded-2xl border border-foreground/5 dark:border-white/5">
                Fokus Utama: &ldquo;{roadmapYears[selectedYear].focus}&rdquo;
              </p>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-3">
                  Key Milestone & Deliverables:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roadmapYears[selectedYear].milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/10 dark:border-white/10 flex items-start gap-3 text-xs text-foreground/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-aqua mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
