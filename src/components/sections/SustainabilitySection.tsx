"use client";

import React from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Bot,
  Handshake,
  Repeat,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const sustainabilityPillars = [
  {
    title: "Model Kontrak Retainer (6-12 Bulan)",
    icon: Repeat,
    badge: "Arus Kas Terprediksi",
    gradient: "from-brand-primary/15 to-transparent",
    desc: "Menghindari pola kerja 'panen di awal lalu kering di akhir'. Klien mendapatkan kepastian tim yang standby merawat aset digital mereka setiap bulan.",
    benefits: [
      "Perawatan rutin: update keamanan web, perpanjangan domain, dan backup data mingguan",
      "Pasokan konten berkala (12-16 materi grafis/bulan) dengan kalender posting terjadwal",
      "Prioritas pengerjaan revisi cepat dalam 1x24 jam kerja tanpa biaya tambahan per request",
      "Klien tenang karena punya divisi desain dan web pribadi tanpa beban gaji karyawan tetap",
    ],
  },
  {
    title: "AI untuk Tugas Rutin, Bukan Ganti Otak",
    icon: Bot,
    badge: "Efisiensi Nyata",
    gradient: "from-brand-aqua/15 to-transparent",
    desc: "Kami tidak pernah membiarkan generator AI membuat logo final. AI dipakai untuk mempercepat riset moodboard, generate data uji coba, dan mengecek error kode.",
    benefits: [
      "Riset referensi dan eksplorasi skema warna 3 kali lebih cepat",
      "Automasi pengujian bug browser mempercepat waktu deployment",
      "Kurasi manusia mutlak: Setiap piksel dan baris kode diperiksa desainer dan developer",
      "Biaya produksi ditekan tanpa menurunkan standar keunikan identitas klien",
    ],
  },
  {
    title: "Kemitraan Simbiosis Ekosistem",
    icon: Handshake,
    badge: "Saling Melengkapi",
    gradient: "from-brand-slate/15 to-transparent",
    desc: "Berkolaborasi dengan Software House dan Event Organizer untuk saling melengkapi kemampuan tanpa harus saling berebut pasar.",
    benefits: [
      "Menjadi mitra UI/UX resmi bagi Software House yang fokus pada logika backend dan database",
      "Menyediakan sistem tiket dan materi publikasi kilat bagi penyelenggara acara (EO)",
      "Peluang mengajukan proposal bersama untuk proyek skala menengah ke atas",
      "Kanal rujukan dua arah yang memangkas biaya promosi dan iklan berbayar",
    ],
  },
];

export function SustainabilitySection() {
  const { ref: headerRef, isInView: headerVisible } = useScrollReveal();
  const { ref: pillarsRef, isInView: pillarsVisible } = useScrollReveal();

  return (
    <section id="keberlanjutan" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto space-y-4 mb-16 heading-entrance ${headerVisible ? 'revealed' : ''}`}>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-container border border-brand-primary/20 text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-brand-aqua">
            <ShieldCheck className="w-3.5 h-3.5" />
            Proposal Poin 6 • Keberlanjutan & Ketahanan Usaha
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Strategi Keberlanjutan &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Skalabilitas Agensi</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Menjamin stabilitas operasional jangka panjang dan ketahanan bisnis melalui tiga pilar strategis: kontinuitas arus kas, kecepatan produksi cerdas, dan sinergi ekosistem.
          </p>
        </div>

        {/* 3 Pillars Cards */}
        <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {sustainabilityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`p-8 rounded-3xl glass-container border border-slate-200 dark:border-white/10 hover:border-brand-primary/40 transition-all flex flex-col justify-between group relative overflow-hidden micro-lift morph-card-hover scroll-reveal-rotate stagger-${idx + 1} ${pillarsVisible ? 'revealed' : ''}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${pillar.gradient} opacity-40 pointer-events-none`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary dark:text-brand-aqua flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary dark:text-brand-aqua border border-brand-primary/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>

                  <div className="pt-2 space-y-2.5">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      Mekanisme Operasional:
                    </p>
                    <ul className="space-y-2">
                      {pillar.benefits.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-aqua mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-brand-aqua">
                  <TrendingUp className="w-4 h-4" />
                  <span>Jaminan Kontinuitas Layanan</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Callout Card */}
        <div className="p-6 sm:p-8 rounded-3xl glass-container border border-brand-aqua/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Kesiapan Menghadapi Disrupsi AI & Industri Kreatif
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Alih-alih terancam oleh perkembangan teknologi, Logia Creative menjadikannya pendorong efisiensi agar klien mendapatkan hasil lebih cepat dengan akurasi lebih tinggi.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary dark:text-brand-aqua text-xs font-bold border border-brand-primary/20">
              Future-Proof Framework
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
