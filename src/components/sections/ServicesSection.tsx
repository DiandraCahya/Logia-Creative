"use client";

import React from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import {
  Palette,
  Code2,
  Share2,
  Megaphone,
  MonitorCheck,
  Cpu,
} from "lucide-react";

/* ── Services Data (Simplified) ── */
const services = [
  {
    title: "Brand Identity",
    icon: Palette,
    desc: "Logo tajam, sistem warna rapi, dan berkas siap cetak.",
  },
  {
    title: "UI/UX & Web Dev",
    icon: MonitorCheck,
    desc: "Website responsif dan elegan dengan performa kilat.",
  },
  {
    title: "Social Media",
    icon: Share2,
    desc: "Desain konten yang terarah untuk membangun trust audiens.",
  },
  {
    title: "Workflow Automation",
    icon: Cpu,
    desc: "Integrasi sistem dan form untuk pangkas tugas admin manual.",
  },
  {
    title: "Creative Campaign",
    icon: Megaphone,
    desc: "Materi promosi terpadu untuk momen peluncuran atau event.",
  },
  {
    title: "Tech Convergence",
    icon: Code2,
    desc: "Sinkronisasi desain antarmuka dan basis kode tanpa friksi.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function ServicesSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section id="layanan" className="py-12 sm:py-20 relative bg-transparent border-t border-black/5 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div ref={ref} className="max-w-3xl mb-5 sm:mb-10">
          <h2
            className={`text-[clamp(1.65rem,5vw,3.25rem)] font-extrabold tracking-[-0.02em] text-black dark:text-white leading-[1.12] mb-2.5 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Layanan Kami
          </h2>
          <p
            className={`text-sm sm:text-base text-[#1A1A1A] dark:text-[#999999] max-w-xl leading-[1.55] transition-all duration-700 delay-150 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Satu pintu untuk kebutuhan visual dan teknologi. Tidak perlu repot
            mencari banyak vendor berbeda.
          </p>
        </div>

        {/* Daftar layanan. Di ponsel: satu kolom, ikon di kiri, tanpa kotak -
            grid 2 kolom membuat tiap kartu cuma 169px dan teksnya terlipat 5 baris. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="group cursor-default transition-all duration-700"
                style={{
                  transitionDelay: `${isInView ? idx * 90 : 0}ms`,
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(40px)",
                }}
              >
                {/* Tilt ringan via CSS hover - tanpa runtime framer */}
                <div className="glass-card rounded-2xl sm:rounded-3xl px-4 py-3.5 sm:p-8 flex flex-row items-center gap-3.5 sm:gap-6 sm:items-start h-full transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm group-hover:bg-black group-hover:border-black dark:group-hover:bg-white dark:group-hover:border-white">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white transition-colors duration-300 group-hover:text-white dark:group-hover:text-black" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-black dark:text-white mb-0.5 sm:mb-2 tracking-tight">
                      {srv.title}
                    </h3>
                    <p className="text-[13px] sm:text-sm text-[#555555] dark:text-[#999999] leading-[1.45] sm:leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
