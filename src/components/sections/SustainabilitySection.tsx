"use client";

import React from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import {
  Bot,
  Handshake,
  Repeat,
} from "lucide-react";

const sustainabilityPillars = [
  {
    title: "Model Retainer Bulanan",
    icon: Repeat,
    desc: "Menjamin arus kas yang stabil sekaligus memberikan kepastian perawatan aset digital rutin untuk klien kami.",
    points: [
      "Perawatan rutin & keamanan web",
      "Pasokan konten sosial media rutin",
      "Prioritas revisi cepat"
    ],
  },
  {
    title: "AI sebagai Asisten Nyata",
    icon: Bot,
    desc: "Kami menggunakan AI untuk mempercepat riset dan pengecekan kode, namun kurasi estetika tetap di tangan manusia.",
    points: [
      "Riset referensi lebih efisien",
      "Automasi pengujian kode",
      "Eksplorasi visual instan"
    ],
  },
  {
    title: "Kemitraan Ekosistem",
    icon: Handshake,
    desc: "Berkolaborasi dengan Software House dan EO untuk saling melengkapi layanan dan memperluas jangkauan pasar.",
    points: [
      "Mitra resmi UI/UX Software House",
      "Dukungan pendaftaran acara (EO)",
      "Sistem rujukan kolaboratif"
    ],
  },
];

export function SustainabilitySection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section id="sustainability" className="py-24 md:py-32 lg:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" ref={ref}>
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto space-y-4 mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-primary mb-4 block">
            Ketahanan Usaha
          </span>
          <h2 className="text-headline mb-6">
            Strategi Keberlanjutan Bisnis
          </h2>
          <p className="text-body text-text-secondary mx-auto max-w-2xl">
            Tiga pilar utama untuk menjaga stabilitas operasional jangka panjang dan memastikan kualitas layanan kami tetap konsisten.
          </p>
        </div>

        {/* 3 Pillars Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {sustainabilityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="glass-container p-8 !rounded-3xl card-interactive flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-grow">
                  {pillar.desc}
                </p>

                <ul className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                  {pillar.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0 mt-2" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
