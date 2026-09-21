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
    <section id="layanan" className="py-24 sm:py-32 relative bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div ref={ref} className="max-w-3xl mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease }}
            className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[-0.02em] text-black dark:text-white leading-[1.1] mb-6"
          >
            Layanan Kami
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="text-base sm:text-lg text-[#1A1A1A] dark:text-[#999999] max-w-xl leading-relaxed"
          >
            Satu pintu untuk kebutuhan visual dan teknologi. Tidak perlu repot
            mencari banyak vendor berbeda.
          </motion.p>
        </div>

        {/* Grid 2 Kolom - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
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
                  className="flex gap-6 items-start"
                >
                  <div className="w-14 h-14 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05] flex items-center justify-center shrink-0 group-hover:bg-black group-hover:dark:bg-white transition-colors duration-300">
                    <Icon className="w-6 h-6 text-black dark:text-white group-hover:text-white group-hover:dark:text-black transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2 tracking-tight">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed">
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
