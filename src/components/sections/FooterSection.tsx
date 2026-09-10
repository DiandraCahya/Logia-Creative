"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
    <footer id="contact" className="relative pt-24 pb-12 overflow-hidden bg-transparent text-text-primary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 space-y-16">

        {/* Call to Action */}
        <div className="glass-container p-8 sm:p-14 text-center space-y-6">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-primary mb-4 block">
            Kolaborasi
          </span>
          <h2 className="text-headline max-w-3xl mx-auto">
            Siap Berkolaborasi Mengaktualisasikan <span className="text-accent-primary">Potensi Bisnis Anda?</span>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Dari perumusan identitas visual hingga implementasi website performa tinggi, Logia Creative siap menjadi mitra andalan Anda.
          </p>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onOpenCollaboration}
              className="px-8 py-4 rounded-full btn-collaborate btn-interactive flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Mulai Diskusi Proyek</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-full bg-transparent border border-gray-300 dark:border-gray-600 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 btn-interactive flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-accent-secondary" />
              <span>Chat WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Multi-Column Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-8 border-t border-gray-200 dark:border-gray-800">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-32 h-9">
              <Image
                src="/LOGO.png"
                alt="Logia Creative Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Agensi kreatif dan teknologi terintegrasi yang menghadirkan solusi branding, perancangan antarmuka pengguna interaktif, dan automasi sistem kerja digital.
            </p>

            <div className="glass-container inline-flex items-center gap-2 px-3 py-1.5 !rounded-full text-xs font-mono text-text-secondary">
              <Clock className="w-3.5 h-3.5 text-accent-primary animate-pulse" />
              <span>Studio Time: {wibTime || "17:00:00"} WIB</span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-4 text-sm">
            <h4 className="font-bold uppercase tracking-wider text-xs">Eksplorasi</h4>
            <ul className="space-y-3 text-text-secondary">
              <li><a href="#about" className="hover:text-accent-primary transition-colors">Tentang Kami</a></li>
              <li><a href="#services" className="hover:text-accent-primary transition-colors">Layanan Utama</a></li>
              <li><a href="#portfolio" className="hover:text-accent-primary transition-colors">Studi Kasus</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-4 text-sm">
            <h4 className="font-bold uppercase tracking-wider text-xs">Layanan</h4>
            <ul className="space-y-3 text-text-secondary">
              <li><a href="#services" className="hover:text-accent-primary transition-colors">Brand Identity</a></li>
              <li><a href="#services" className="hover:text-accent-primary transition-colors">UI/UX Design</a></li>
              <li><a href="#services" className="hover:text-accent-primary transition-colors">Web Development</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 text-sm">
            <h4 className="font-bold uppercase tracking-wider text-xs">Kontak</h4>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent-primary" />
                <a href="mailto:hello@logia.id" className="hover:text-accent-primary">hello@logia.id</a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-accent-secondary" />
                <span>www.logia.id</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent-primary" />
                <span>Indonesia</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 pt-2">
              <div className="glass-container w-8 h-8 !rounded-full flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="glass-container w-8 h-8 !rounded-full flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Big Watermark */}
        <div className="relative py-4 select-none pointer-events-none overflow-hidden text-center">
          <span className="block text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-gray-200 dark:text-gray-800 opacity-50 whitespace-nowrap">
            LOGIA CREATIVE
          </span>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Logia Creative Agency. All rights reserved.</p>
          <button onClick={scrollToTop} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 hover:text-accent-primary transition-all group">
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
