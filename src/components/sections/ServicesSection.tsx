"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import {
  Palette,
  Code2,
  Share2,
} from "lucide-react";

const mainServices = [
  {
    title: "Brand Identity & Visual Design",
    icon: Palette,
    desc: "Perancangan identitas merek yang kuat untuk meningkatkan kredibilitas bisnis Anda.",
    features: [
      "Logo & Sistem Visual",
      "Brand Guidelines",
      "Desain Kemasan"
    ],
  },
  {
    title: "UI/UX Design & Web Development",
    icon: Code2,
    desc: "Pembuatan website cepat dan responsif dengan desain antarmuka yang intuitif.",
    features: [
      "Company Profile",
      "Landing Page",
      "Web App & Integrasi"
    ],
  },
  {
    title: "Social Media & Content",
    icon: Share2,
    desc: "Strategi dan produksi konten yang relevan untuk membangun interaksi audiens.",
    features: [
      "Template Konten",
      "Video Pendek",
      "Kalender Editorial"
    ],
  },
];

interface ServicesSectionProps {
  onOpenCollaboration?: () => void;
}

export function ServicesSection({ onOpenCollaboration }: ServicesSectionProps) {
  const { ref, isInView } = useScrollReveal();
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="services" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" ref={ref}>
        {/* Header */}
        <span className="text-sm font-semibold uppercase tracking-wider text-accent-primary mb-4 block">
          Layanan Utama
        </span>
        <h2 className="text-headline mb-6 max-w-3xl">Solusi Digital Terpadu</h2>
        <p className="text-body text-text-secondary mb-16 max-w-2xl">
          Kami menggabungkan kreativitas visual dan teknologi modern untuk membantu bisnis Anda tumbuh dan beradaptasi di era digital.
        </p>

        {/* 3 Main Services Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {mainServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="glass-container p-8 !rounded-3xl card-interactive flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{srv.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-grow">
                  {srv.desc}
                </p>

                <ul className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                  {srv.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/60 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* See More Link */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="link-slide text-accent-primary font-semibold inline-flex items-center gap-2"
          >
            {showMore ? 'Tutup layanan lainnya ↑' : 'Lihat semua layanan →'}
          </button>

          {showMore && (
            <div className="glass-container mt-8 text-left p-6 !rounded-2xl max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
              <h4 className="font-bold text-accent-primary mb-2">Lainnya: Workflow Automation & Integrasi</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Menghapus rekap manual dan menghemat waktu admin Anda dengan integrasi otomatis ke Google Sheets, WhatsApp Notifikasi, dan Dashboard pemantauan operasional.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
