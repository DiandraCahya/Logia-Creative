"use client";

import React from "react";
import { motion } from "framer-motion";
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease }}
            className="text-[clamp(1.65rem,5vw,3.25rem)] font-extrabold tracking-[-0.02em] text-black dark:text-white leading-[1.12] mb-2.5"
          >
            Layanan Kami
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="text-sm sm:text-base text-[#1A1A1A] dark:text-[#999999] max-w-xl leading-[1.55]"
          >
            Satu pintu untuk kebutuhan visual dan teknologi. Tidak perlu repot
            mencari banyak vendor berbeda.
          </motion.p>
        </div>

        {/* Grid 2 Kolom - Responsive */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease, delay: idx * 0.1 }}
                className="group cursor-default"
                style={{ perspective: 1000 }}
              >
                {/* 3D Tilt Wrapper */}
                <motion.div
                  whileHover={{ rotateX: 2, rotateY: -2, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start h-full"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm group-hover:bg-black group-hover:border-black dark:group-hover:bg-white dark:group-hover:border-white">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white transition-colors duration-300 group-hover:text-white dark:group-hover:text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-xl font-bold text-black dark:text-white mb-1 sm:mb-2 tracking-tight">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] dark:text-[#999999] leading-[1.5] sm:leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
