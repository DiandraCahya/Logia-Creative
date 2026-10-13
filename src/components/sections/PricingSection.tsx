"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { Check, ChevronDown } from "lucide-react";
import { PACKAGES, SINGLE_SERVICES, TERMS } from "@/lib/rate-card";

const ease = [0.22, 1, 0.36, 1] as const; // --ease-out-expo, satu easing global

type Tab = "paket" | "satuan";

export function PricingSection() {
  const { ref, isInView } = useScrollReveal();
  const [tab, setTab] = useState<Tab>("paket");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [openTerm, setOpenTerm] = useState<number | null>(0);

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 relative bg-transparent border-t border-black/5 dark:border-white/5"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease }}
            className="font-display font-medium tracking-[-0.02em] text-[clamp(2rem,4vw,3.5rem)] text-black dark:text-white mb-4"
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

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12" role="tablist" aria-label="Jenis layanan">
          {(["paket", "satuan"] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                tab === t
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                  : "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white"
              }`}
            >
              {t === "paket" ? "Paket Terintegrasi" : "Layanan Satuan"}
            </button>
          ))}
        </div>

        {tab === "paket" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PACKAGES.map((pkg, idx) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, ease, delay: 0.2 + idx * 0.1 }}
                className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                  pkg.badge
                    ? "bg-black dark:bg-white border-2 border-black dark:border-white text-white dark:text-black shadow-xl"
                    : "glass-card"
                }`}
              >
                {pkg.badge === "Most Popular" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white dark:bg-black text-black dark:text-white text-xs font-bold uppercase tracking-wider rounded-full border border-black/10 dark:border-white/10 shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-display font-medium mb-1">{pkg.name}</h3>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                      pkg.badge
                        ? "text-white/70 dark:text-black/70"
                        : "text-[#666666] dark:text-[#999999]"
                    }`}
                  >
                    {pkg.period}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      pkg.badge
                        ? "text-white/70 dark:text-black/70"
                        : "text-[#666666] dark:text-[#999999]"
                    }`}
                  >
                    {pkg.desc}
                  </p>
                  <p className="text-3xl font-extrabold tracking-tight mt-4">
                    {pkg.price}
                  </p>
                </div>

                <div className="flex-grow mb-6">
                  <button
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    aria-expanded={expanded === idx}
                    className={`text-sm font-semibold underline underline-offset-2 ${
                      pkg.badge
                        ? "text-white/80 dark:text-black/80"
                        : "text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {expanded === idx ? "Sembunyikan rincian" : "Lihat rincian paket"}
                  </button>
                  <AnimatePresence>
                    {expanded === idx && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="mt-4 space-y-3 overflow-hidden"
                      >
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check
                              className={`w-5 h-5 shrink-0 ${
                                pkg.badge ? "text-white dark:text-black" : "text-black dark:text-white"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                pkg.badge
                                  ? "text-white/90 dark:text-black/90"
                                  : "text-[#444444] dark:text-[#BBBBBB]"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <a
                  href="#kontak"
                  className={`w-full py-4 rounded-full text-sm font-bold text-center transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                    pkg.badge
                      ? "bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20"
                      : "bg-black dark:bg-white text-white dark:text-black"
                  }`}
                >
                  Pilih {pkg.name}
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SINGLE_SERVICES.map((group) => (
              <div
                key={group.category}
                className="glass-card rounded-3xl p-8"
              >
                <h3 className="font-display text-xl font-medium text-black dark:text-white mb-6">
                  {group.category}
                </h3>
                <ul className="divide-y divide-black/5 dark:divide-white/10">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-4 py-3">
                      <span className="text-sm text-[#444444] dark:text-[#BBBBBB]">{item.name}</span>
                      <span className="text-sm font-bold text-black dark:text-white whitespace-nowrap">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Syarat & Ketentuan accordion */}
        <div className="max-w-3xl mx-auto mt-20">
          <h3 className="font-display text-2xl font-medium text-black dark:text-white text-center mb-8">
            Syarat & Ketentuan Layanan
          </h3>
          <div className="space-y-3">
            {TERMS.map((term, i) => (
              <div
                key={term.title}
                className="glass-accordion rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenTerm(openTerm === i ? null : i)}
                  aria-expanded={openTerm === i}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                >
                  <span className="font-semibold text-black dark:text-white">{term.title}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#666666] dark:text-[#999999] transition-transform duration-300 ${
                      openTerm === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openTerm === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="px-6 pb-5 space-y-2.5">
                        {term.body.map((b, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-sm text-[#444444] dark:text-[#BBBBBB] leading-relaxed"
                          >
                            <Check className="w-4 h-4 shrink-0 text-black dark:text-white mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease, delay: 0.7 }}
          className="mt-16 text-center space-y-6"
        >
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            Butuh layanan satuan? Logo, konten, hingga automation tersedia
            terpisah.
          </p>
          <div className="flex items-center justify-center">
            <a
              href="#kontak"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Diskusikan Kebutuhan Anda
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
