"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";

const tabs = [
  { id: "visi", label: "Visi" },
  { id: "misi", label: "Misi" },
  { id: "filosofi", label: "Filosofi" },
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
      desc: "Menyederhanakan alur kerja kompleks menjadi sistem terotomasi.",
    },
  ];

  const brandPillars = [
    {
      title: "Logika & Kreativitas",
      desc: "Menggabungkan daya nalar logis sistemik dan kebebasan ekspresi visual.",
    },
    {
      title: "Tetesan Ide",
      desc: "Gagasan kreatif murni yang menetes dan berkembang menjadi dampak nyata.",
    },
    {
      title: "Dinamis Adaptif",
      desc: "Representasi fleksibilitas terhadap dinamika kebutuhan klien.",
    },
  ];

  return (
    <section id="about" className="py-12 md:py-20 relative bg-transparent border-t border-black/[0.05] dark:border-white/[0.05]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          {/* Left Column: Heading & Tabs */}
          <div
            className={`lg:col-span-4 lg:sticky lg:top-32 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-10">
              <h2 className="font-display font-medium text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-black dark:text-white mb-4">
                Logia Creative Agency
              </h2>
              <p className="text-[#666666] dark:text-[#999999] text-base leading-relaxed">
                Kami membangun keseimbangan antara kreativitas visual dan ketangguhan teknologi.
              </p>
            </div>

            {/* Tab Interface */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible hide-scrollbar pb-4 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full lg:rounded-xl text-left text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-black/[0.03] dark:bg-white/[0.03] text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Content Panel */}
          <div className="lg:col-span-8">
            <div>
              {activeTab === "visi" && (
                <div className="p-5 sm:p-12 glass-card rounded-3xl animate-fade-up">
                  <h3 className="text-xl sm:text-2xl font-bold leading-[1.5] text-black dark:text-white mb-8">
                    &ldquo;Menjadi mitra kreatif dan teknologi terdepan yang memberdayakan bisnis di Indonesia melalui integrasi identitas visual yang berkarakter dan solusi digital yang berdampak nyata.&rdquo;
                  </h3>
                  <div className="flex justify-center items-center pt-2">
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#666666] dark:text-[#999999] text-center">
                      Logia Creative
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "misi" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 animate-fade-up">
                  {missions.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-5 sm:p-8 glass-card rounded-3xl ${
                        idx === 2 ? "sm:col-span-2" : ""
                      }`}
                    >
                      <span className="text-black/10 dark:text-white/10 font-black text-4xl block mb-4">
                        0{idx + 1}
                      </span>
                      <h4 className="text-lg font-bold mb-2 text-black dark:text-white">
                        {m.title}
                      </h4>
                      <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "filosofi" && (
                <div className="space-y-6 animate-fade-up">
                  <div className="p-5 sm:p-10 glass-card rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="relative w-32 h-16">
                      <Image
                        src="/LOGO.webp"
                        alt="Logo Logia"
                        fill
                        loading="lazy"
                        decoding="async"
                        sizes="128px"
                        className="object-contain"
                      />
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-black/10 dark:bg-white/10" />
                    <div className="relative w-24 h-6">
                      <Image
                        src="/Group 1.webp"
                        alt="Creative Wordmark"
                        fill
                        loading="lazy"
                        decoding="async"
                        sizes="96px"
                        className="object-contain dark:invert-0 invert"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {brandPillars.map((bp, idx) => (
                      <div
                        key={idx}
                        className="p-5 glass-card rounded-2xl flex flex-col gap-2"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-black dark:text-white mb-2">
                            {bp.title}
                          </h4>
                          <p className="text-xs text-[#666666] dark:text-[#999999] leading-relaxed">
                            {bp.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
