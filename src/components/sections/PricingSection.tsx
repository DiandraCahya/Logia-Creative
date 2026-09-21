"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { Check } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    forWho: "Untuk UMKM & Bisnis Baru",
    price: "Rp 3.500.000",
    features: [
      "Brand Identity Package (Logo + Basic Guideline)",
      "5 Social Media Templates",
      "1 Landing Page Design",
      "Revisi Minor 2x",
    ],
    cta: "Pilih Starter",
    highlight: false,
  },
  {
    name: "Growth",
    forWho: "Untuk Bisnis Berkembang",
    price: "Rp 12.000.000",
    features: [
      "Full Brand Identity System",
      "Social Media Management (1 Bulan)",
      "Company Profile Website (Next.js)",
      "Content Strategy Document",
      "Revisi Minor 3x",
    ],
    cta: "Pilih Growth",
    highlight: true,
  },
  {
    name: "Premium",
    forWho: "Untuk Enterprise & Korporat",
    price: "Custom",
    features: [
      "Complete Brand Overhaul",
      "Web Application Development",
      "Workflow Automation System",
      "Creative Campaign (3 Bulan)",
      "Dedicated Project Manager",
    ],
    cta: "Hubungi Kami",
    highlight: false,
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function PricingSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section id="pricing" className="py-24 sm:py-32 relative bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-black dark:text-white mb-4"
          >
            Investasi Transparan
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease, delay: 0.2 + idx * 0.1 }}
              className={`relative flex flex-col p-8 sm:p-10 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
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
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${tier.highlight ? "text-white/70 dark:text-black/70" : "text-[#666666] dark:text-[#999999]"}`}>
                  {tier.forWho}
                </p>
                <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  {tier.price !== "Custom" && <span className="text-sm font-semibold">Mulai</span>}
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${tier.highlight ? "text-white dark:text-black" : "text-black dark:text-white"}`} />
                    <span className={`text-sm ${tier.highlight ? "text-white/90 dark:text-black/90" : "text-[#444444] dark:text-[#BBBBBB]"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-full text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                  tier.highlight
                    ? "bg-white dark:bg-black text-black dark:text-white"
                    : "bg-black dark:bg-white text-white dark:text-black"
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
