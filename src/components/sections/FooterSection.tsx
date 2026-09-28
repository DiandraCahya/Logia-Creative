"use client";

import React, { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import {
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Globe,
  ArrowRight,
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
    <footer id="kontak" className="relative pt-20 pb-12 overflow-hidden border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 space-y-20">

        {/* Closing Impact CTA Banner - Black Solid */}
        <div
          ref={ctaRef}
          className={`cta-dark p-6 sm:p-16 lg:p-24 rounded-[2rem] bg-black text-white relative overflow-hidden shadow-2xl text-center space-y-8 transition-all duration-700 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-white font-display font-medium tracking-[-0.02em] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] mb-6">
              Ready to elevate your brand?
            </h2>
            <p className="text-[#999999] text-base sm:text-lg mb-10 max-w-xl leading-relaxed">
              Mari diskusikan bagaimana kami bisa membantu mentransformasi identitas visual dan infrastruktur digital bisnis Anda ke level selanjutnya.
            </p>
            <button
              onClick={onOpenCollaboration}
              className="px-8 py-4 min-h-[48px] bg-white text-black text-sm font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 flex items-center gap-2 group"
            >
              <span>Mulai Diskusi Proyek</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Multi-Column Links & Info */}
        <div ref={contactRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-8 transition-all duration-700 ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative w-32 h-10">
              <Image
                src="/LOGO.png"
                alt="Logia Creative Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed max-w-sm">
              Agensi kreatif dan teknologi terintegrasi yang menghadirkan solusi branding, perancangan antarmuka pengguna interaktif, dan automasi sistem kerja digital bagi UMKM, startup, dan organisasi.
            </p>

            {/* Live WIB Clock */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-xs font-mono text-black dark:text-white">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Studio Time: {wibTime || "--:--:--"} WIB</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4 text-sm">
            <h4 className="font-bold text-black dark:text-white uppercase tracking-wider text-xs mb-6">
              Eksplorasi
            </h4>
            <ul className="space-y-3 text-[#666666] dark:text-[#999999]">
              <li>
                <a href="#about" className="hover:text-black dark:hover:text-white transition-colors">
                  Tentang Logia
                </a>
              </li>
              <li>
                <a href="#target-pasar" className="hover:text-black dark:hover:text-white transition-colors">
                  Target Pasar
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-black dark:hover:text-white transition-colors">
                  Selected Work
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">
                  Katalog Harga
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Index */}
          <div className="space-y-4 text-sm">
            <h4 className="font-bold text-black dark:text-white uppercase tracking-wider text-xs mb-6">
              Layanan Utama
            </h4>
            <ul className="space-y-3 text-[#666666] dark:text-[#999999]">
              <li>
                <a href="#layanan" className="hover:text-black dark:hover:text-white transition-colors">
                  Brand Identity & Visual Design
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-black dark:hover:text-white transition-colors">
                  UI/UX & Web Development
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-black dark:hover:text-white transition-colors">
                  Social Media Management
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-black dark:hover:text-white transition-colors">
                  Workflow Automation
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-4 text-sm">
            <h4 className="font-bold text-black dark:text-white uppercase tracking-wider text-xs mb-6">
              Kontak
            </h4>
            <ul className="space-y-3 text-[#666666] dark:text-[#999999]">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-black dark:text-white" />
                <a href="mailto:hello@logia.id" className="hover:text-black dark:hover:text-white transition-colors">
                  hello@logia.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-black dark:text-white" />
                <a href="tel:+6281234567890" className="hover:text-black dark:hover:text-white transition-colors">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-black dark:text-white" />
                <span>www.logia.id</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-black dark:text-white" />
                <span>Indonesia</span>
              </li>
            </ul>

            <div className="flex items-center gap-2 pt-4">
              <button
                type="button"
                disabled
                aria-label="Instagram — segera hadir"
                title="Instagram — segera hadir"
                className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 cursor-not-allowed"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled
                aria-label="LinkedIn — segera hadir"
                title="LinkedIn — segera hadir"
                className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 cursor-not-allowed"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="relative py-4 select-none pointer-events-none overflow-hidden border-t border-black/5 dark:border-white/5 pt-12" aria-hidden="true">
          <p className="block w-full max-w-full text-center leading-none font-black tracking-tighter text-black/5 dark:text-white/5 whitespace-nowrap text-[clamp(2rem,8.5vw,9rem)]">
            Logia Creative
          </p>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#666666] dark:text-[#999999]">
          <p>
            &copy; {new Date().getFullYear()} Logia Creative Agency. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all group"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}