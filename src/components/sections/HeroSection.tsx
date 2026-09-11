"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Palette,
  Code2,
  CheckCircle2,
} from "lucide-react";

interface HeroSectionProps {
  onOpenCollaboration?: () => void;
}

const pillBadges = [
  { label: "Modern", icon: Zap, color: "text-amber-400" },
  { label: "Kreatif", icon: Palette, color: "text-brand-aqua" },
  { label: "Profesional", icon: ShieldCheck, color: "text-emerald-400" },
  { label: "Inovatif", icon: Layers, color: "text-brand-mint" },
];

export function HeroSection({ onOpenCollaboration }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative min-h-screen pt-32 pb-20 sm:pt-40 sm:pb-32 flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Ambient Background Lights — now with morphing blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-32 w-96 h-96 sm:w-[520px] sm:h-[520px] morph-blob bg-brand-primary/20 dark:bg-brand-primary/25 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-32 w-96 h-96 sm:w-[560px] sm:h-[560px] morph-blob-alt bg-brand-aqua/20 dark:bg-brand-aqua/20 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] morph-blob bg-brand-mint/15 dark:bg-brand-slate/40 blur-[140px]"
        />

        {/* Background decoration image */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.05]">
          <Image
            src="/Group 3.png"
            alt=""
            fill
            className="object-contain"
            loading="lazy"
            aria-hidden="true"
          />
        </div>

        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e90a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e90a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Kinetic Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Top Announcement Chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-brand-primary/30 text-xs font-semibold tracking-wide text-brand-primary dark:text-brand-aqua shadow-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-aqua opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary" />
              </span>
              <span>Ideas into Impact • Creative & Technology Agency</span>
            </motion.div>

            {/* Kinetic Typography Headline — word-by-word reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground"
            >
              Innovative Branding &{" "}
              <span className="text-gradient-brand drop-shadow-sm">
                Digital Solutions
              </span>{" "}
              Provider
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg xl:text-xl text-foreground/80 font-normal leading-relaxed max-w-2xl"
            >
              Mengintegrasikan Kreativitas dan Teknologi untuk Pertumbuhan Bisnis Anda. Kami merancang identitas visual yang tajam sekaligus membangun website cepat yang siap menampung lonjakan pesanan klien Anda tanpa drama sistem tumbang.
            </motion.p>

            {/* 4 Brand Pillars / Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap gap-2.5 pt-2"
            >
              {pillBadges.map((pill) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={pill.label}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-foreground/[0.04] dark:bg-white/[0.05] border border-foreground/10 dark:border-white/10 text-xs font-medium text-foreground/90 backdrop-blur-sm micro-lift"
                  >
                    <Icon className={`w-3.5 h-3.5 ${pill.color}`} />
                    <span>{pill.label}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-4 w-full sm:w-auto"
            >
              <button
                onClick={onOpenCollaboration}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-primary via-brand-aqua to-brand-slate text-white text-sm font-semibold shadow-[0_10px_25px_rgba(14,165,233,0.4)] hover:shadow-[0_15px_35px_rgba(14,165,233,0.55)] transition-all flex items-center justify-center gap-2 group micro-glow"
              >
                <Sparkles className="w-4 h-4 text-brand-mint animate-pulse" />
                <span>Mulai Diskusi Proyek</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#layanan"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("layanan");
                  if (el) {
                    window.scrollTo({
                      top: el.getBoundingClientRect().top + window.scrollY - 96,
                      behavior: "smooth",
                    });
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-foreground/[0.05] dark:bg-white/[0.06] hover:bg-foreground/[0.08] dark:hover:bg-white/[0.1] text-foreground text-sm font-semibold border border-foreground/15 dark:border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2 micro-glow"
              >
                <span>Lihat Hasil Kerja</span>
              </a>
            </motion.div>

            {/* Quick Proof Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="pt-6 border-t border-foreground/10 dark:border-white/10 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-foreground/75"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-aqua" />
                <span>Satu Meja: Desainer & Web Developer Langsung</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                <span>Estimasi & Ruang Lingkup Transparan</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Interactive Mockup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
            style={{ perspective: 1000 }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Liquid Glass Showcase Card */}
              <div className="relative rounded-3xl p-6 sm:p-8 liquid-glass-card shadow-glass-glow border border-white/40 dark:border-brand-aqua/30 overflow-hidden group micro-lift">
                {/* Specular Glare overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-brand-aqua/10 pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-6 border-b border-foreground/10 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-aqua p-2 flex items-center justify-center text-white shadow-md">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Logia Convergence Engine</h4>
                      <p className="text-[11px] text-foreground/60">Creative & Technology Convergence</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20">
                    Live Ecosystem
                  </span>
                </div>

                {/* Visual Identity Image Preview from brand board */}
                <div className="relative w-full h-52 sm:h-60 my-6 rounded-2xl overflow-hidden border border-foreground/10 dark:border-white/10 shadow-inner">
                  <Image
                    src="/image 2.png"
                    alt="Logia Creative Brand Identity"
                    fill
                    className="object-cover object-top micro-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-semibold tracking-wide">
                      Brand Strategy & Visual Guidelines • Proposal Showcase
                    </span>
                  </div>
                </div>

                {/* Convergence Features Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-foreground/[0.03] dark:bg-white/[0.04] border border-foreground/10 dark:border-white/10 micro-lift">
                    <div className="flex items-center gap-2 text-brand-primary text-xs font-bold mb-1">
                      <Palette className="w-4 h-4" />
                      <span>Creative Stream</span>
                    </div>
                    <p className="text-[11px] text-foreground/70">
                      Brand Identity, Visual Assets, Social Content & Campaigns
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-foreground/[0.03] dark:bg-white/[0.04] border border-foreground/10 dark:border-white/10 micro-lift">
                    <div className="flex items-center gap-2 text-brand-aqua text-xs font-bold mb-1">
                      <Code2 className="w-4 h-4" />
                      <span>Tech Stream</span>
                    </div>
                    <p className="text-[11px] text-foreground/70">
                      High-Performance Web, UI/UX, Workflow Automation
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Floating Stat Badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 sm:-right-6 px-4 py-2.5 rounded-2xl liquid-glass-pill shadow-xl border border-brand-mint/40 hidden sm:flex items-center gap-3"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-brand-mint animate-pulse" />
                <div className="text-left">
                  <p className="text-[10px] text-foreground/60 font-medium">Integrasi Sistem</p>
                  <p className="text-xs font-bold text-foreground">100% Terpadu</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-5 -left-4 sm:-left-6 px-4 py-2.5 rounded-2xl liquid-glass-pill shadow-xl border border-brand-primary/40 hidden sm:flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-foreground/60 font-medium">Target Efisiensi</p>
                  <p className="text-xs font-bold text-brand-primary">Hemat Waktu & Biaya</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
