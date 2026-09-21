"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { Check, Download, X } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter Brand",
    price: "Rp 350.000",
    period: "Project-Based",
    tagline: "Fondasi identitas visual bisnis yang profesional.",
    features: [
      "Desain Logo Utama & Alternatif",
      "Color Palette & Typography Guide",
      "Brand Mini Guideline",
      "3 Template Media Sosial (Editable)",
      "1 Desain Merchandise / Kemasan sederhana",
    ],
    cta: "Pilih Starter",
    highlight: false,
  },
  {
    name: "Digital Presence",
    price: "Rp 850.000",
    period: "Project-Based",
    tagline: "Identitas + kehadiran digital dalam satu paket.",
    features: [
      "Semua layanan Starter Brand",
      "Landing Page Website (1 Halaman, Template-Based)",
      "Setup Media Social Business",
      "6 Konten Awal (Desain + Copywriting)",
      "Optimasi Profil Digital (Bio & Link)",
    ],
    cta: "Pilih Digital Presence",
    highlight: false,
  },
  {
    name: "Growth Package",
    price: "Rp 1.500.000",
    period: "/bulan",
    tagline: "Konsistensi konten bulanan + GRATIS website.",
    features: [
      "Semua layanan Digital Presence",
      "GRATIS Website Company Profile (Basic, bulan pertama)",
      "Basic UI/UX Design",
      "12 Feed Design / bulan",
      "4 Reels / TikTok Videos / bulan",
      "Monthly Performance Report",
    ],
    cta: "Pilih Growth",
    highlight: true,
  },
  {
    name: "Smart Business",
    price: "Mulai Rp 2.750.000",
    period: "Project-Based",
    tagline: "Otomasi & dashboard untuk efisiensi operasional.",
    features: [
      "Dashboard Monitoring Bisnis (Sales/Operasional)",
      "Sistem Registrasi Digital (Event/Organisasi)",
      "Simple Workflow Automation",
      "Reporting Dashboard Terintegrasi",
      "1x Sesi Pelatihan Penggunaan Sistem",
    ],
    cta: "Konsultasi Dulu",
    highlight: false,
  },
];

const terms = [
  "DP 50% untuk memulai; pelunasan 50% sebelum handover/go-live.",
  "Maksimal 2x revisi minor; revisi ke-3+ atau ganti konsep: Rp 50.000/revisi.",
  "Website default CMS/No-Code builder; custom code = biaya terpisah.",
  "Harga belum termasuk domain & hosting premium tahunan.",
  "Retainer Growth dibayar di awal setiap bulan berjalan.",
  "Timeline: branding 3-7 hari kerja; website & otomasi 7-14 hari kerja.",
];

const ease = [0.16, 1, 0.3, 1] as const;

const checkIconColor = "text-black";
const highlightCheckIconColor = "text-white";

export function PricingSection() {
  const { ref, isInView } = useScrollReveal();
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const getCheckColor = (highlight: boolean) =>
    highlight ? highlightCheckIconColor : checkIconColor;

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 relative bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-black dark:text-white mb-4"
          >
            Rate Card
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="text-base text-[#666666] dark:text-[#999999]"
          >
            Pilih paket layanan yang sesuai dengan tahap pertumbuhan bisnis Anda.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease, delay: 0.2 + idx * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                tier.highlight
                  ? "bg-black dark:bg-white border-2 border-black dark:border-white text-white dark:text-black shadow-xl"
                  : "bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 shadow-sm"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white dark:bg-black text-black dark:text-white text-xs font-bold uppercase tracking-wider rounded-full border border-black/10 dark:border-white/10 shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                    tier.highlight
                      ? "text-white/70 dark:text-black/70"
                      : "text-[#666666] dark:text-[#999999]"
                  }`}
                >
                  {tier.period}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    tier.highlight
                      ? "text-white/70 dark:text-black/70"
                      : "text-[#666666] dark:text-[#999999]"
                  }`}
                >
                  {tier.tagline}
                </p>
                <div className="flex items-baseline gap-1 mt-4">
                  {tier.price !== "Custom" && (
                    <span className="text-sm font-semibold">Mulai</span>
                  )}
                  <span className="text-4xl font-extrabold tracking-tight">
                    {tier.price}
                  </span>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 shrink-0 ${getCheckColor(tier.highlight)}`}
                    />
                    <span
                      className={`text-sm ${
                        tier.highlight
                          ? "text-white/90 dark:text-black/90"
                          : "text-[#444444] dark:text-[#BBBBBB]"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-full text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                  tier.highlight
                    ? "bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20"
                    : "bg-black dark:bg-white text-white dark:text-black"
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease, delay: 0.7 }}
          className="mt-20 text-center space-y-6"
        >
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            Butuh layanan satuan? Logo, konten, hingga automation tersedia
            terpisah.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3 border border-black/20 dark:border-white/20 rounded-full text-sm font-bold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Rate Card Lengkap (PDF)
          </a>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-sm text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white transition-colors underline underline-offset-2"
          >
            Syarat & ketentuan berlaku
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isTermsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTermsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl z-10 my-8 bg-white dark:bg-[#111] rounded-3xl p-8 border border-black/10 dark:border-white/10 shadow-xl overflow-y-auto max-h-[80vh]"
            >
              <button
                onClick={() => setIsTermsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                Syarat & Ketentuan
              </h3>

              <ul className="space-y-4">
                {terms.map((term, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-[#444444] dark:text-[#BBBBBB] leading-relaxed"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Check className="w-4 h-5 shrink-0 text-black dark:text-white mt-0.5" />
                    <span>{term}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
