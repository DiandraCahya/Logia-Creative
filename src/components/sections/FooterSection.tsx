"use client";

import React, { useState, useEffect } from "react";
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
    <footer id="kontak" className="relative pt-20 pb-12 overflow-hidden border-t border-foreground/10 dark:border-white/10 bg-background">
      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-brand-primary/10 via-brand-aqua/5 to-transparent blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Closing Impact CTA Banner */}
        <div className="p-8 sm:p-14 rounded-3xl liquid-glass border border-brand-primary/30 relative overflow-hidden shadow-glass-glow text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-primary dark:text-brand-aqua text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Proposal Poin 7 • Penutup & Kolaborasi
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto leading-tight">
            Siap Berkolaborasi Mengaktualisasikan{" "}
            <span className="text-gradient-brand">Potensi Bisnis Anda?</span>
          </h2>

          <p className="text-sm sm:text-base text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            Mari diskusikan tantangan bisnis Anda hari ini. Dari perumusan identitas visual hingga implementasi website performa tinggi, Logia Creative siap menjadi mitra andalan Anda.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onOpenCollaboration}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-primary via-brand-aqua to-brand-slate text-white font-bold text-sm shadow-[0_10px_30px_rgba(14,165,233,0.4)] hover:shadow-[0_15px_40px_rgba(14,165,233,0.6)] transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-brand-mint" />
              <span>Mulai Diskusi Proyek Sekarang</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-full liquid-glass border border-foreground/15 dark:border-white/15 text-foreground font-semibold text-sm hover:bg-foreground/[0.04] transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-aqua" />
              <span>Chat WhatsApp Langsung</span>
            </a>
          </div>
        </div>

        {/* Multi-Column Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-8 border-t border-foreground/10 dark:border-white/10">
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
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed max-w-sm">
              Agensi kreatif dan teknologi terintegrasi yang menghadirkan solusi branding, perancangan antarmuka pengguna interaktif, dan automasi sistem kerja digital bagi UMKM, startup, dan organisasi.
            </p>

            {/* Live WIB Clock */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/[0.03] dark:bg-white/[0.04] border border-foreground/10 text-xs font-mono text-foreground/80">
              <Clock className="w-3.5 h-3.5 text-brand-aqua animate-pulse" />
              <span>Studio Time: {wibTime || "17:00:00"} WIB (UTC+7)</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-foreground/70">
              <li>
                <Link href="#tentang" className="hover:text-brand-primary transition-colors">
                  Tentang & Latar Belakang
                </Link>
              </li>
              <li>
                <Link href="#tentang" className="hover:text-brand-primary transition-colors">
                  Segmentasi Target Pasar
                </Link>
              </li>
              <li>
                <Link href="#swot-roadmap" className="hover:text-brand-primary transition-colors">
                  Analisis SWOT
                </Link>
              </li>
              <li>
                <Link href="#swot-roadmap" className="hover:text-brand-primary transition-colors">
                  5-Year Strategic Roadmap
                </Link>
              </li>
              <li>
                <Link href="#keberlanjutan" className="hover:text-brand-primary transition-colors">
                  Model Keberlanjutan Usaha
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Index */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-foreground/70">
              <li>
                <Link href="#layanan" className="hover:text-brand-primary transition-colors">
                  Brand Identity & Guidelines
                </Link>
              </li>
              <li>
                <Link href="#layanan" className="hover:text-brand-primary transition-colors">
                  Social Media Content & Motion
                </Link>
              </li>
              <li>
                <Link href="#layanan" className="hover:text-brand-primary transition-colors">
                  UI/UX Design & Web App
                </Link>
              </li>
              <li>
                <Link href="#layanan" className="hover:text-brand-primary transition-colors">
                  Workflow Automation
                </Link>
              </li>
              <li>
                <Link href="#layanan" className="hover:text-brand-primary transition-colors">
                  Integrated Creative + Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">
              Kontak & Kanal
            </h4>
            <ul className="space-y-2 text-foreground/70">
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
                className="w-8 h-8 rounded-xl bg-foreground/[0.04] dark:bg-white/[0.05] border border-foreground/10 flex items-center justify-center text-foreground/70 hover:text-brand-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-foreground/[0.04] dark:bg-white/[0.05] border border-foreground/10 flex items-center justify-center text-foreground/70 hover:text-brand-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Massive Stylized Typography Watermark */}
        <div className="relative py-4 select-none pointer-events-none overflow-hidden text-center">
          <span className="block text-4xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground/[0.08] to-transparent dark:from-white/[0.09] dark:to-transparent whitespace-nowrap">
            LOGIA CREATIVE
          </span>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 border-t border-foreground/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} Logia Creative Agency. All rights reserved. Mengintegrasikan Kreativitas dan Teknologi.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-foreground/10 text-foreground/80 hover:text-brand-primary hover:border-brand-primary transition-all group"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
