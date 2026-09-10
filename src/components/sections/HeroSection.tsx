"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface HeroSectionProps {
  onOpenCollaboration?: () => void;
}

export function HeroSection({ onOpenCollaboration }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 sm:pt-40 sm:pb-32 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          {/* Left Column: Clean Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-container inline-flex items-center gap-2 px-4 py-2 !rounded-full text-xs font-semibold tracking-wide text-accent-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Logia Creative Agency</span>
              </div>
            </motion.div>

            {/* Headline: Max 5 words */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-display"
            >
              Solusi Digital & <span className="text-accent-primary">Kreatif</span> Terpadu
            </motion.h1>

            {/* Subheadline: Max 1 sentence */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-subheadline text-text-secondary font-normal max-w-2xl"
            >
              Kami mengintegrasikan kreativitas visual dan teknologi mutakhir untuk mempercepat pertumbuhan bisnis Anda.
            </motion.p>

            {/* CTA Buttons: Max 2 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4 pt-4 w-full sm:w-auto"
            >
              <button
                onClick={onOpenCollaboration}
                className="w-full sm:w-auto px-8 py-4 rounded-full btn-collaborate text-sm font-semibold btn-interactive flex items-center justify-center gap-2 group"
              >
                <span>Mulai Diskusi Proyek</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("services");
                  if (el) {
                    window.scrollTo({
                      top: el.getBoundingClientRect().top + window.scrollY - 80,
                      behavior: "smooth",
                    });
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent text-text-primary text-sm font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center justify-center btn-interactive"
              >
                Lihat Layanan
              </a>
            </motion.div>
          </div>

          {/* Right Column: Clean Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex justify-center"
          >
            <div className="glass-container relative w-full max-w-lg aspect-[4/3] !rounded-3xl overflow-hidden card-interactive p-0">
              <Image
                src="/image 2.png"
                alt="Logia Creative Brand Identity"
                fill
                className="object-cover image-zoom"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 pointer-events-none">
                 <span className="text-white text-sm font-semibold tracking-wide">
                   Brand Strategy & Visual Guidelines
                 </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
