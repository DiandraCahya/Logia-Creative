"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";

const tabs = [
  { id: "visi", label: "Visi Perusahaan" },
  { id: "misi", label: "Misi Strategis" },
  { id: "filosofi", label: "Filosofi Identitas" }
] as const;

export function CompanyProfileSection() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]["id"]>("visi");
  const { ref, isInView } = useScrollReveal();

  const missions = [
    {
      title: "Desain Berdampak",
      desc: "Menghadirkan identitas visual yang profesional, berkarakter, dan berkesan.",
    },
    {
      title: "Teknologi Cerdas",
      desc: "Membangun sistem web modern yang cepat, andal, dan mudah dikelola.",
    },
    {
      title: "Otomasi Efisien",
      desc: "Menyederhanakan alur kerja kompleks menjadi sistem terotomasi yang menghemat waktu.",
    }
  ];

  const brandPillars = [
    {
      title: "Logika & Kreativitas",
      desc: "Menggabungkan daya nalar logis sistemik (Logic) dan kebebasan ekspresi visual.",
    },
    {
      title: "Tetesan Ide",
      desc: "Gagasan kreatif murni yang menetes dan berkembang menjadi dampak nyata bagi bisnis.",
    },
    {
      title: "Dinamis Adaptif",
      desc: "Representasi fleksibilitas agensi terhadap dinamika kebutuhan industri klien.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" ref={ref}>
        {/* Section Header */}
        <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-primary mb-4 block text-center">
            Profil Perusahaan
          </span>
          <h2 className="text-headline mb-16 max-w-3xl mx-auto text-center">
            Fondasi Nilai & Arah Langkah
          </h2>
        </div>

        {/* Tab Interface */}
        <div className="flex justify-center mb-12">
          <div className="glass-container flex items-center gap-2 p-1.5 !rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all btn-press ${
                  activeTab === tab.id
                    ? "btn-collaborate shadow-md"
                    : "text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === "visi" && (
              <motion.div
                key="visi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto text-center"
              >
                <div className="glass-container p-12 md:p-16 !rounded-3xl">
                  <h3 className="text-2xl md:text-3xl font-bold leading-relaxed mb-8">
                    &ldquo;Menjadi mitra kreatif dan teknologi terdepan yang memberdayakan bisnis di Indonesia melalui integrasi identitas visual yang berkarakter dan solusi digital yang berdampak nyata.&rdquo;
                  </h3>
                  <p className="text-accent-primary font-semibold uppercase tracking-widest text-sm">
                    Logia Creative
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "misi" && (
              <motion.div
                key="misi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {missions.map((m, idx) => (
                  <div key={idx} className="glass-container p-8 !rounded-3xl card-interactive">
                    <span className="text-accent-primary font-bold text-3xl block mb-4 opacity-50">
                      0{idx + 1}
                    </span>
                    <h4 className="text-lg font-bold mb-3">{m.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "filosofi" && (
              <motion.div
                key="filosofi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div className="glass-container p-12 !rounded-3xl flex flex-col items-center justify-center">
                  <div className="relative w-48 h-24 mb-6">
                    <Image src="/LOGO.png" alt="Logo Logia" fill className="object-contain" />
                  </div>
                  <div className="relative w-32 h-8">
                    <Image src="/Group 1.png" alt="Creative Wordmark" fill className="object-contain" />
                  </div>
                </div>

                <div className="space-y-6">
                  {brandPillars.map((bp, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 shrink-0" />
                      <div>
                        <h4 className="font-bold text-text-primary mb-1">{bp.title}</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">{bp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
