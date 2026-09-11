"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Code2,
  Sparkles,
  Layers,
  Share2,
  Megaphone,
  MonitorCheck,
  Cpu,
  CheckCircle2,
  Coins,
  ArrowRight,
  Workflow,
  PieChart,
} from "lucide-react";

const creativeServices = [
  {
    title: "Brand Identity & Visual Design",
    icon: Palette,
    tagline: "Logo Tajam, Aturan Warna Rapi, Berkas Siap Cetak",
    desc: "Perancangan identitas merek dari nol atau perapian logo lama agar bisnis Anda terlihat kredibel di mata pembeli dan calon investor.",
    deliverables: [
      "File master vector SVG & PDF (garansi tajam di layar HP hingga spanduk 5 meter)",
      "Buku pedoman merek (aturan warna RGB/CMYK, tipografi, dan larangan penggunaan)",
      "Desain kemasan produk fisik (box, pouch, label stiker, pita unboxing)",
      "Aset kartu nama dan amplop resmi siap kirim ke vendor percetakan",
    ],
    tags: ["Illustrator", "Photoshop", "Brand Book", "Vector"],
  },
  {
    title: "Social Media & Content Production",
    icon: Share2,
    tagline: "Konten yang Terarah, Bukan Sekadar Ramai Feed",
    desc: "Materi visual yang dirancang untuk membangun kepercayaan calon pembeli, menjelaskan keunggulan produk tanpa teks yang membosankan.",
    deliverables: [
      "Paket template carousel edukasi dan promo produk siap pakai",
      "Editing video pendek (Reels / TikTok) dengan subtitle dinamis",
      "Kalender editorial bulanan agar tim Anda tidak bingung mau posting apa",
      "Format micro-copy visual yang to the point dan mudah dibaca cepat",
    ],
    tags: ["After Effects", "Premiere", "Social Grid", "Motion"],
  },
  {
    title: "Creative Campaign & Brand Activation",
    icon: Megaphone,
    tagline: "Materi Promosi Terpadu untuk Momen Penting",
    desc: "Persiapan materi promosi untuk peluncuran menu baru, diskon tanggal kembar, hingga kebutuhan visual pameran atau bazaar.",
    deliverables: [
      "Konsep visual kampanye tematik (promo hari raya, seasonal launch)",
      "Banner iklan siap tayang untuk Meta Ads (IG/FB) dan Google Display",
      "Desain backdrop panggung, roll-up banner, dan x-banner bazaar",
      "Pitch deck presentasi penawaran kerja sama yang meyakinkan",
    ],
    tags: ["Campaign Strategy", "Meta Ads", "Event Kit", "Pitch Deck"],
  },
];

const technologyServices = [
  {
    title: "UI/UX Design & Modern Web Apps",
    icon: MonitorCheck,
    tagline: "Website Next.js Cepat, Lolos Uji Google PageSpeed",
    desc: "Kami merancang antarmuka di Figma dan langsung mengembangkannya dengan Next.js modern. Hasilnya: halaman dimuat instan tanpa jeda lemot.",
    deliverables: [
      "Desain antarmuka interaktif Figma dengan sistem komponen rapi",
      "Company profile & landing page penawaran dengan konversi tinggi",
      "Kode bersih Next.js, React, dan Tailwind CSS tanpa plugin sampah",
      "Optimasi tampilan mobile dan kecepatan respon di jaringan 4G",
    ],
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Figma"],
  },
  {
    title: "Reporting & Workflow Automation",
    icon: Cpu,
    tagline: "Hapus Rekap Manual, Hemat Waktu Admin Anda",
    desc: "Admin Anda tidak perlu lagi begadang menyalin puluhan chat WhatsApp ke Excel. Pesanan atau data pendaftaran langsung tersinkronisasi otomatis.",
    deliverables: [
      "Penyambungan form pendaftaran langsung ke Google Sheets / Airtable",
      "Notifikasi WhatsApp dan email otomatis saat ada transaksi masuk",
      "Sistem verifikasi tiket acara dan rekap kehadiran tanpa kertas",
      "Dashboard pemantauan data sederhana yang mudah diakses dari HP",
    ],
    tags: ["Automation", "Webhooks", "API Integration", "Dashboards"],
  },
];

const investmentBreakdown = [
  {
    category: "Hardware & Production Rig",
    percentage: "40%",
    amount: "Workstation & Display",
    desc: "Perangkat komputasi spek tinggi untuk rendering desain, editing video, dan server development lokal.",
  },
  {
    category: "Software & Cloud Licenses",
    percentage: "25%",
    amount: "Adobe CC, Figma, Cloud",
    desc: "Langganan lisensi resmi software desain profesional, domain, hosting, dan database cloud terkelola.",
  },
  {
    category: "Pemasaran & Portofolio",
    percentage: "20%",
    amount: "Paid Ads & Showcase",
    desc: "Aktivasi promosi berbayar, kurasi studi kasus proyek, serta pencetakan sampel mockup fisik klien.",
  },
  {
    category: "Cadangan & Legalitas",
    percentage: "15%",
    amount: "Operasional Awal",
    desc: "Pengurusan legalitas usaha, rekening bisnis, dan dana talangan operasional fase inkubasi.",
  },
];

interface ServicesSectionProps {
  onOpenCollaboration?: () => void;
}

export function ServicesSection({ onOpenCollaboration }: ServicesSectionProps) {
  const [activeStream, setActiveStream] = useState<"creative" | "tech">("creative");
  const { ref: headerRef, isInView: headerVisible } = useScrollReveal();
  const { ref: cardsRef, isInView: cardsVisible } = useScrollReveal();
  const { ref: investRef, isInView: investVisible } = useScrollReveal();

  return (
    <section id="layanan" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto space-y-4 mb-16 heading-entrance ${headerVisible ? 'revealed' : ''}`}>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass border border-brand-primary/20 text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-brand-aqua">
            <Layers className="w-3.5 h-3.5" />
            Proposal Poin 5 • Rumpun Layanan & Proyeksi Infrastruktur
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Spektrum Solusi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Kreatif & Teknologi</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Dua rumpun kapabilitas utama yang dapat diakses secara terpisah maupun sebagai satu kesatuan solusi komprehensif.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex justify-center mb-14">
          <div className="p-1.5 rounded-full glass-container flex items-center gap-2">
            <button
              onClick={() => setActiveStream("creative")}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeStream === "creative"
                  ? "bg-gradient-to-r from-blue-600 to-brand-aqua text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Creative Solutions</span>
            </button>

            <button
              onClick={() => setActiveStream("tech")}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeStream === "tech"
                  ? "bg-gradient-to-r from-brand-primary to-brand-slate text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Technology Solutions</span>
            </button>
          </div>
        </div>

        {/* Services Showcase Cards */}
        <AnimatePresence mode="wait">
          {activeStream === "creative" && (
            <motion.div
              key="creative"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {creativeServices.map((srv) => {
                const Icon = srv.icon;
                return (
                  <div
                    key={srv.title}
                    className="p-7 rounded-3xl glass-container border border-slate-200 dark:border-white/10 hover:border-brand-aqua/40 transition-all flex flex-col justify-between group micro-lift"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary dark:text-brand-aqua flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-brand-aqua uppercase tracking-wider">
                          {srv.tagline}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                          {srv.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {srv.desc}
                      </p>

                      <div className="pt-2 space-y-2">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                          Deliverables:
                        </p>
                        <ul className="space-y-1.5">
                          {srv.deliverables.map((d, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-aqua mt-0.5 shrink-0" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-1.5">
                      {srv.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeStream === "tech" && (
            <motion.div
              key="tech"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            >
              {technologyServices.map((srv) => {
                const Icon = srv.icon;
                return (
                  <div
                    key={srv.title}
                    className="p-8 rounded-3xl glass-container border border-slate-200 dark:border-white/10 hover:border-brand-primary/40 transition-all flex flex-col justify-between group micro-lift"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-aqua/10 text-brand-aqua flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-brand-primary dark:text-brand-aqua uppercase tracking-wider">
                          {srv.tagline}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                          {srv.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {srv.desc}
                      </p>

                      <div className="pt-2 space-y-2">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                          Deliverables & Spesifikasi:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {srv.deliverables.map((d, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02]"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary mt-0.5 shrink-0" />
                              <span>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-2">
                      {srv.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary dark:text-brand-aqua font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Integrated Solutions Highlight Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-navy via-brand-slate to-brand-navy border border-brand-aqua/30 text-white shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-brand-aqua/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-aqua/20 border border-brand-aqua/40 text-brand-mint text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                The Power of Integrated Synergy
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Paket Solusi Terpadu: Mengapa Memadukan Creative + Tech?
              </h3>
              <p className="text-xs sm:text-sm text-brand-light/80 leading-relaxed max-w-2xl">
                Menghindari friksi komunikasi antara agensi desain dan programmer pihak ketiga. Ketika identitas visual dirancang oleh tim yang sama yang membangun website, hasil akhir bekerja dengan harmoni visual maksimal, performa kode optimal, serta kecepatan peluncuran 40% lebih cepat.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={onOpenCollaboration}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-aqua to-brand-primary text-white font-semibold text-xs sm:text-sm hover:opacity-95 shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Konsultasi Paket Terpadu</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Capital & Infrastructure Projection Card */}
        <div className="space-y-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 text-brand-aqua text-xs font-bold uppercase tracking-wider">
              <Coins className="w-4 h-4" />
              <span>Estimasi Alokasi Modal & Infrastruktur Awal</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Proyeksi Kesiapan Alat & Investasi Operasional
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Ringkasan alokasi investasi awal untuk menjamin kualitas standar studio dan kelancaran eksekusi proyek klien.
            </p>
          </div>

          <div ref={investRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentBreakdown.map((item, idx) => (
              <div
                key={item.category}
                className={`p-6 rounded-3xl glass-container border border-slate-200 dark:border-white/10 space-y-3 micro-lift morph-card-hover scroll-reveal-right stagger-${idx + 1} ${investVisible ? 'revealed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-brand-primary dark:text-brand-aqua">
                    {item.percentage}
                  </span>
                  <PieChart className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.category}</h4>
                <p className="text-[11px] font-semibold text-brand-aqua">
                  {item.amount}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
