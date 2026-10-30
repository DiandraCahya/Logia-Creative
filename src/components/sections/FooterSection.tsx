"use client";

import React, { useState, useEffect } from "react";
import { openCollaborationModal } from "@/components/CollaborationManager";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import {
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

const wibFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function FooterSection({ onOpenCollaboration }: FooterSectionProps) {
  const [wibTime, setWibTime] = useState<string>("");
  const { ref: ctaRef, isInView: ctaVisible } = useScrollReveal();
  const { ref: contactRef, isInView: contactVisible } = useScrollReveal();

  useEffect(() => {
    const updateTime = () => {
      if (document.hidden) return; // skip tick saat tab tak terlihat
      setWibTime(wibFormatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="kontak" className="relative pt-6 sm:pt-14 pb-6 sm:pb-10 overflow-hidden max-w-[100vw] bg-transparent">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-20">

        {/* Closing Impact CTA Banner - Glassmorphism (dark-tinted glass: permukaan tembus pandang + blur, kontrak teks putih dari .cta-dark) */}
        <div
          ref={ctaRef}
          className={`cta-dark p-6 sm:p-12 lg:p-20 rounded-[1.25rem] sm:rounded-[2rem] bg-black/80 dark:bg-black/70 supports-[backdrop-filter:blur(0px)]:bg-black/60 backdrop-blur-2xl text-white border border-white/10 dark:border-white/15 relative overflow-hidden shadow-2xl text-center space-y-4 sm:space-y-8 transition-all duration-700 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Pantulan cahaya di tepi atas kaca (1px), bahasa visual sama dengan modal */}
          <div className="absolute top-0 inset-x-0 h-px bg-white/25" aria-hidden="true" />
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-white font-righteous tracking-normal text-[clamp(1.75rem,7vw,4rem)] leading-[1.12] mb-4 sm:mb-6">
              Ready to elevate your brand?
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-7 sm:mb-10 max-w-xl leading-[1.55] sm:leading-relaxed">
              Mari diskusikan bagaimana kami bisa membantu mentransformasi identitas visual dan infrastruktur digital bisnis Anda ke level selanjutnya.
            </p>
            <button
              onClick={() => {
                if (onOpenCollaboration) onOpenCollaboration();
                else openCollaborationModal();
              }}
              className="w-full sm:w-auto justify-center px-6 sm:px-8 py-4 min-h-[48px] bg-white text-black text-sm font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 flex items-center gap-2 group shadow-lg"
            >
              <span className="text-black font-bold">Mulai Diskusi Proyek</span>
              <ArrowRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Multi-Column Links & Info - Frosted Glass Container to guarantee text readability in front of background */}
        <div
          ref={contactRef}
          className={`relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-black/55 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-xl text-[13px] sm:text-sm transition-all duration-700 ${
            contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Col 1: Brand Info (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-28 h-8">
              <Image
                src="/Group 3.webp"
                alt="Logia Creative Logo"
                fill
                loading="lazy"
                decoding="async"
                sizes="112px"
                className="object-contain"
              />
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-200 font-medium leading-relaxed max-w-sm">
              Agensi kreatif dan teknologi terintegrasi yang menghadirkan solusi branding, perancangan antarmuka pengguna interaktif, dan automasi sistem kerja digital bagi UMKM, startup, dan organisasi.
            </p>

            {/* Live WIB Clock */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-mono text-black dark:text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <Clock className="w-3.5 h-3.5 shrink-0 text-neutral-500 dark:text-neutral-400" />
              <span>Studio Time: {wibTime || "--:--:--"} WIB</span>
            </div>
          </div>

          {/* Quick Links Section: 2 cols side-by-side on mobile, individual on desktop */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Eksplorasi */}
            <div className="space-y-4">
              <h3 className="font-bold text-black dark:text-white uppercase tracking-widest text-xs">
                Eksplorasi
              </h3>
              <ul className="space-y-2.5 text-neutral-600 dark:text-neutral-300 font-medium">
                <li>
                  <a href="#about" className="hover:text-black dark:hover:text-white transition-colors block py-0.5">
                    Tentang Logia
                  </a>
                </li>
                <li>
                  <a href="#target-pasar" className="hover:text-black dark:hover:text-white transition-colors block py-0.5">
                    Target Pasar
                  </a>
                </li>
                <li>
                  <a href="#portfolio" className="hover:text-black dark:hover:text-white transition-colors block py-0.5">
                    Selected Work
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors block py-0.5">
                    Katalog Harga
                  </a>
                </li>
              </ul>
            </div>

            {/* Layanan Utama */}
            <div className="space-y-4">
              <h3 className="font-bold text-black dark:text-white uppercase tracking-widest text-xs">
                Layanan
              </h3>
              <ul className="space-y-2.5 text-neutral-600 dark:text-neutral-300 font-medium">
                <li>
                  <a href="#layanan" className="hover:text-black dark:hover:text-white transition-colors block py-0.5">
                    Brand Identity
                  </a>
                </li>
                <li>
                  <a href="#layanan" className="hover:text-black dark:hover:text-white transition-colors block py-0.5">
                    UI/UX Design
                  </a>
                </li>
                <li>
                  <a href="#layanan" className="hover:text-black dark:hover:text-white transition-colors block py-0.5">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="#layanan" className="hover:text-black dark:hover:text-white transition-colors block py-0.5">
                    Automation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 3: Contact & Social (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-bold text-black dark:text-white uppercase tracking-widest text-xs">
              Kontak &amp; Info
            </h3>
            <ul className="space-y-2.5 text-neutral-600 dark:text-neutral-300 font-medium">
              <li>
                <a
                  href="mailto:logiacreative.id@gmail.com"
                  className="inline-flex items-center gap-2.5 py-1 text-xs sm:text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-black dark:text-white shrink-0" />
                  <span className="break-all">logiacreative.id@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6289521375477"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 py-1 text-xs sm:text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-black dark:text-white shrink-0" />
                  <span>+62 895-2137-5477</span>
                </a>
              </li>
              <li>
                <a
                  href="https://logia-creative.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 py-1 text-xs sm:text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4 text-black dark:text-white shrink-0" />
                  <span className="break-all">https://logia-creative.vercel.app/</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 py-1 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-black dark:text-white shrink-0" />
                <span>Surabaya</span>
              </li>
            </ul>

            <div className="flex items-center gap-2.5 pt-3">
              <a
                href="https://www.instagram.com/logiacreative.studio/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Logia Creative"
                title="Instagram Logia Creative"
                className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                type="button"
                disabled
                aria-label="LinkedIn (segera hadir)"
                title="LinkedIn (segera hadir)"
                className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-black/40 dark:text-white/40 cursor-not-allowed"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Watermark Big Text: Logia Creative - elevated in front of background with high contrast */}
        <div className="relative z-10 py-4 select-none pointer-events-none overflow-hidden pt-8 sm:pt-14" aria-hidden="true">
          <p className="block w-full max-w-full text-center leading-none font-black tracking-tighter text-black/20 dark:text-white/25 sm:text-black/25 sm:dark:text-white/30 whitespace-nowrap text-[clamp(2.2rem,9vw,9.5rem)]">
            Logia Creative
          </p>
        </div>

        {/* Bottom Bar: Copyright (Centered) */}
        <div className="relative z-10 pb-4 sm:pb-8 flex items-center justify-center text-center text-[12px] font-semibold text-neutral-600 dark:text-neutral-300">
          <p>
            &copy; {new Date().getFullYear()} Logia Creative Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}