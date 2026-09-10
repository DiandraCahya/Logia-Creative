"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  AlertOctagon,
  Calendar,
} from "lucide-react";

// SWOT Data
const swotQuadrants = [
  {
    type: "Strengths",
    id: "strengths",
    icon: ShieldCheck,
    summary: "Tanpa birokrasi, eksekusi desain dan kode di satu meja secara langsung.",
    points: [
      "Klien berdiskusi langsung dengan desainer dan developer.",
      "Hasil desain dijamin presisi saat direalisasikan menjadi website.",
      "Transparansi total atas aset sumber desain dan kode."
    ],
  },
  {
    type: "Weaknesses",
    id: "weaknesses",
    icon: AlertTriangle,
    summary: "Kapasitas tim terkurasi untuk kualitas maksimal.",
    points: [
      "Slot pengerjaan proyek dibatasi (4-6 klien aktif) demi menjaga ketelitian.",
      "Fokus pada bisnis berkembang, bukan pabrik massal.",
      "Belum melayani eksekusi fisik (contoh: cetak massal)."
    ],
  },
  {
    type: "Opportunities",
    id: "opportunities",
    icon: Lightbulb,
    summary: "Peluang besar dari brand lokal yang butuh standar profesional.",
    points: [
      "Banyak brand lokal yang butuh naik kelas dari visual amatir.",
      "Tingginya permintaan sistem pendaftaran digital untuk event.",
      "Peluang retainer bulanan pemeliharaan aset digital klien."
    ],
  },
  {
    type: "Threats",
    id: "threats",
    icon: AlertOctagon,
    summary: "Perang harga pasar bawah dan kompetisi AI instan.",
    points: [
      "Gempuran jasa instan template bajakan berbiaya rendah.",
      "Konten AI generatif instan tanpa identitas unik.",
      "Fluktuasi alokasi anggaran klien pada musim krisis."
    ],
  },
];

// Roadmap Data
const roadmapYears = [
  {
    year: "Tahun 1",
    phase: "Inkubasi & Validasi",
    focus: "Membangun kredibilitas dan portofolio awal.",
  },
  {
    year: "Tahun 2",
    phase: "Ekspansi Layanan",
    focus: "Menambah layanan dan klien retainer bulanan.",
  },
  {
    year: "Tahun 3",
    phase: "Skalabilitas Tim",
    focus: "Mendirikan ruang kreatif fisik dan memperluas kapasitas tim.",
  },
  {
    year: "Tahun 4",
    phase: "Diversifikasi Produk",
    focus: "Menciptakan recurring income non-layanan langsung.",
  },
  {
    year: "Tahun 5",
    phase: "Top-Tier Agency",
    focus: "Menjadi rujukan nasional agensi kreatif & teknologi.",
  },
];

export function SWOTRoadmapSection() {
  const [expandedSWOT, setExpandedSWOT] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<number>(0);
  const { ref, isInView } = useScrollReveal();

  return (
    <section id="swot-roadmap" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" ref={ref}>
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto space-y-4 mb-24 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-primary mb-4 block">
            Analisis & Strategi
          </span>
          <h2 className="text-headline mb-6">SWOT & 5-Year Roadmap</h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Kami memetakan posisi strategis perusahaan secara objektif untuk memastikan keberlanjutan solusi yang kami berikan.
          </p>
        </div>

        {/* SWOT Section */}
        <div className="mb-32">
          <h3 className="text-2xl font-bold mb-8 text-center">Matriks SWOT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {swotQuadrants.map((q) => {
              const Icon = q.icon;
              const isExpanded = expandedSWOT === q.id;

              return (
                <div
                  key={q.id}
                  className={`glass-container p-8 !rounded-3xl cursor-pointer card-interactive ${
                    isExpanded ? 'ring-1 ring-accent-primary' : ''
                  }`}
                >
                  <div onClick={() => setExpandedSWOT(isExpanded ? null : q.id)}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold">{q.type}</h4>
                      </div>
                      <button className="text-sm font-semibold text-text-tertiary">
                        {isExpanded ? 'Tutup ↑' : 'Buka ↓'}
                      </button>
                    </div>
                    <p className="text-sm text-text-secondary">{q.summary}</p>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                          {q.points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0 mt-2" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap Section */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center">Peta Jalan 5 Tahun</h3>
          <div className="max-w-4xl mx-auto">
            {/* Year Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {roadmapYears.map((ry, index) => (
                <button
                  key={ry.year}
                  onClick={() => setActiveYear(index)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all btn-press flex items-center gap-2 ${
                    activeYear === index
                      ? "btn-collaborate shadow-md"
                      : "bg-transparent text-text-secondary hover:text-text-primary border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{ry.year}</span>
                </button>
              ))}
            </div>

            {/* Active Year Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-container p-10 md:p-12 !rounded-3xl text-center relative overflow-hidden">
                  <span className="absolute -right-4 -bottom-6 text-9xl font-black text-gray-200 dark:text-gray-800 opacity-30 select-none pointer-events-none">
                    0{activeYear + 1}
                  </span>

                  <div className="relative z-10">
                    <span className="text-sm font-bold text-accent-primary uppercase tracking-widest block mb-2">
                      {roadmapYears[activeYear].year}
                    </span>
                    <h4 className="text-2xl font-bold mb-6">
                      {roadmapYears[activeYear].phase}
                    </h4>
                    <p className="text-sm text-text-secondary max-w-xl mx-auto italic">
                      Fokus Utama: "{roadmapYears[activeYear].focus}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
