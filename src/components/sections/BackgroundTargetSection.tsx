"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Rocket,
  CalendarCheck,
} from "lucide-react";

const targetMarkets = [
  {
    id: "umkm",
    title: "UMKM & Brand Lokal",
    icon: Store,
    problemText: "Produk laku keras, namun kemasan dan logo belum profesional. Sulit masuk retail karena kurangnya identitas visual yang konsisten.",
    solutions: [
      "Logo vector & panduan warna",
      "Katalog produk digital",
      "Template sosial media"
    ],
  },
  {
    id: "startup",
    title: "Startup & Growing Businesses",
    icon: Rocket,
    problemText: "Butuh website rilis cepat dengan UI/UX yang rapi dan terukur, serta optimasi kecepatan untuk performa terbaik.",
    solutions: [
      "Design system Figma komprehensif",
      "Pengembangan web modern (Next.js)",
      "Automasi formulir & integrasi API"
    ],
  },
  {
    id: "organisasi",
    title: "Event & Organisasi",
    icon: CalendarCheck,
    problemText: "Manajemen peserta manual yang merepotkan dan visual promosi event yang kurang terpadu dari online hingga offline.",
    solutions: [
      "Landing page event & registrasi",
      "Sistem tiket & notifikasi WhatsApp",
      "Aset visual event (backdrop, id card)"
    ],
  },
] as const;

export function BackgroundTargetSection() {
  const { ref, isInView } = useScrollReveal();
  const [activeTab, setActiveTab] = useState<typeof targetMarkets[number]["id"]>("umkm");

  return (
    <section id="portfolio" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" ref={ref}>
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-primary mb-4 block">
            Target Pasar
          </span>
          <h2 className="text-headline mb-6">
            Solusi Spesifik Untuk Kebutuhan Anda
          </h2>
          <p className="text-body text-text-secondary mx-auto max-w-2xl">
            Setiap industri memiliki tantangan unik. Kami mengadaptasi layanan kami untuk memberikan dampak maksimal pada skala bisnis Anda.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="glass-container flex items-center gap-2 p-1.5 !rounded-full">
            {targetMarkets.map((market) => (
              <button
                key={market.id}
                onClick={() => setActiveTab(market.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all btn-press flex items-center gap-2 ${
                  activeTab === market.id
                    ? "btn-collaborate shadow-md"
                    : "text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <market.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{market.title}</span>
                <span className="sm:hidden">{market.id.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Display */}
        <div className="max-w-4xl mx-auto min-h-[250px]">
          <AnimatePresence mode="wait">
            {targetMarkets.map((market) => {
              if (activeTab !== market.id) return null;

              const Icon = market.icon;
              return (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-container p-8 md:p-12 !rounded-3xl flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3">{market.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-accent-primary pl-4">
                          &ldquo;{market.problemText}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-text-primary">Fokus Solusi</h4>
                      <ul className="space-y-3">
                        {market.solutions.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/60 shrink-0 mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
