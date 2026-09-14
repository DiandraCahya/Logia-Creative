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
    <section id="about" className="py-24 md:py-32 lg:py-40 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Left Column: Heading & Tabs */}
          <div className={`lg:col-span-5 lg:sticky lg:top-32 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 block font-mono">
                01 — Profil Agency
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tighter text-slate-900 dark:text-white overflow-hidden pb-2">
                <span className="block translate-y-0">Fondasi Nilai</span>
                <span className="block text-blue-600 dark:text-blue-400">& Arah Langkah</span>
              </h2>
            </div>

            {/* Tab Interface */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible hide-scrollbar pb-4 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3.5 rounded-2xl text-left text-sm font-semibold transition-all duration-300 whitespace-nowrap min-w-max lg:min-w-0 flex items-center justify-between group ${
                    activeTab === tab.id
                      ? "grad-cta shadow-lg scale-[1.02]"
                      : "glass-container text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTab === tab.id ? "bg-white" : "bg-transparent group-hover:bg-blue-600/30 dark:group-hover:bg-blue-400/30"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Content Panel */}
          <div className="lg:col-span-7">
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "visi" && (
                  <motion.div
                    key="visi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="glass-container p-10 sm:p-14 lg:p-16 !rounded-[2.5rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 dark:bg-blue-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-600/10 dark:group-hover:bg-blue-400/10 transition-colors duration-700" />
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.4] mb-10 text-slate-800 dark:text-slate-100 relative z-10">
                        &ldquo;Menjadi mitra kreatif dan teknologi terdepan yang memberdayakan bisnis di Indonesia melalui integrasi identitas visual yang berkarakter dan solusi digital yang berdampak nyata.&rdquo;
                      </h3>
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-px bg-blue-600 dark:bg-blue-400" />
                        <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs">
                          Logia Creative
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "misi" && (
                  <motion.div
                    key="misi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {missions.map((m, idx) => (
                      <div key={idx} className={`glass-container p-8 !rounded-3xl hover:-translate-y-1 transition-transform duration-300 ${idx === 2 ? 'sm:col-span-2' : ''}`}>
                        <span className="text-blue-600/20 dark:text-blue-400/20 font-black text-5xl block mb-6">
                          0{idx + 1}
                        </span>
                        <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{m.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "filosofi" && (
                  <motion.div
                    key="filosofi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <div className="glass-container p-12 !rounded-3xl flex flex-col sm:flex-row items-center justify-center gap-8">
                      <div className="relative w-40 h-20">
                        <Image src="/LOGO.png" alt="Logo Logia" fill className="object-contain" />
                      </div>
                      <div className="hidden sm:block w-px h-16 bg-slate-200 dark:bg-white/10" />
                      <div className="relative w-28 h-8 text-slate-900 dark:text-white">
                        <Image src="/Group 1.png" alt="Creative Wordmark" fill className="object-contain dark:invert-0 invert" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {brandPillars.map((bp, idx) => (
                        <div key={idx} className="glass-container p-6 !rounded-2xl flex gap-5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">{bp.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{bp.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
