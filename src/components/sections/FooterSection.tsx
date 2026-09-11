"use client";

import React, { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Globe,
  ArrowUpRight,
} from "lucide-react";

interface FooterSectionProps {
  onOpenCollaboration?: () => void;
}

export function FooterSection({ onOpenCollaboration }: FooterSectionProps) {
  const [wibTime, setWibTime] = useState<string>("");
  const { ref: ctaRef, isInView: ctaVisible } = useScrollReveal();
  const { ref: contactRef, isInView: contactVisible } = useScrollReveal();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatter in WIB (Asia/Jakarta)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeStr = new Intl.DateTimeFormat("id-ID", options).format(now);
      setWibTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="kontak" className="relative pt-20 pb-12 overflow-hidden border-t border-slate-200 dark:border-white/10 bg-transparent">
      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-brand-primary/10 via-brand-aqua/5 to-transparent blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Closing Impact CTA Banner */}
        <div ref={ctaRef} className={`p-8 sm:p-14 rounded-3xl glass-container border border-brand-primary/30 relative overflow-hidden shadow-glass-glow text-center space-y-6 transition-all duration-700 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-aqua/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-primary dark:text-brand-aqua text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Proposal Poin 7 • Penutup & Kolaborasi
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight mb-6">
              Siap Berkolaborasi Mengaktualisasikan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Potensi Bisnis Anda?</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Mari diskusikan tantangan bisnis Anda hari ini. Dari perumusan identitas visual hingga implementasi website performa tinggi, Logia Creative siap menjadi mitra andalan Anda.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={onOpenCollaboration}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Mulai Diskusi Proyek</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-container border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-brand-aqua" />
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Multi-Column Links & Info */}
        <div ref={contactRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-8 border-t border-slate-200 dark:border-white/10 transition-all duration-700 ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-32 h-9">
              <Image
                src="/LOGO.png"
                alt="Logia Creative Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              Agensi kreatif dan teknologi terintegrasi yang menghadirkan solusi branding, perancangan antarmuka pengguna interaktif, dan automasi sistem kerja digital bagi UMKM, startup, dan organisasi.
            </p>

            {/* Live WIB Clock */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-brand-aqua animate-pulse" />
              <span>Studio Time: {wibTime || "17:00:00"} WIB (UTC+7)</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <a href="#tentang" className="hover:text-brand-primary transition-colors">
                  Tentang & Latar Belakang
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-brand-primary transition-colors">
                  Segmentasi Target Pasar
                </a>
              </li>
              <li>
                <a href="#swot-roadmap" className="hover:text-brand-primary transition-colors">
                  Analisis SWOT
                </a>
              </li>
              <li>
                <a href="#swot-roadmap" className="hover:text-brand-primary transition-colors">
                  5-Year Strategic Roadmap
                </a>
              </li>
              <li>
                <a href="#keberlanjutan" className="hover:text-brand-primary transition-colors">
                  Model Keberlanjutan Usaha
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Index */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <a href="#layanan" className="hover:text-brand-primary transition-colors">
                  Brand Identity & Guidelines
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-brand-primary transition-colors">
                  Social Media Content & Motion
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-brand-primary transition-colors">
                  UI/UX Design & Web App
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-brand-primary transition-colors">
                  Workflow Automation
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-brand-primary transition-colors">
                  Integrated Creative + Tech
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Kontak & Kanal
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-primary" />
                <a href="mailto:hello@logia.id" className="hover:text-brand-primary">
                  hello@logia.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-aqua" />
                <a href="tel:+6281234567890" className="hover:text-brand-primary">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-brand-mint" />
                <span>www.logia.id</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Indonesia</span>
              </li>
            </ul>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Massive Stylized Typography Watermark */}
        <div className="relative py-4 select-none pointer-events-none overflow-hidden text-center">
          <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-black tracking-tighter text-slate-900/10 dark:text-white/10 whitespace-nowrap">
            LOGIA CREATIVE
          </span>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Logia Creative Agency. All rights reserved. Mengintegrasikan Kreativitas dan Teknologi.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-container border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-brand-primary hover:border-brand-primary transition-all group"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
