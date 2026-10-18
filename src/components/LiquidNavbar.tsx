"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface LiquidNavbarProps {
  onOpenCollaboration?: () => void;
}

const navLinks = [
  { name: "Home", href: "#top" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#layanan" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#kontak" },
];

const sectionIds = ["top", "about", "layanan", "portfolio", "pricing", "kontak"];

export function LiquidNavbar({ onOpenCollaboration }: LiquidNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSection && navContainerRef.current) {
      const activeLink = navContainerRef.current.querySelector(`[data-href="${activeSection}"]`) as HTMLElement;
      if (activeLink) {
        setIndicatorStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
          opacity: 1,
        });
      }
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection]);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let raf = 0;
    const NAVBAR_OFFSET = 80;

    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 20);

        let currentSection = "";
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= NAVBAR_OFFSET + 2) {
              currentSection = `#${sectionIds[i]}`;
              break;
            }
          }
        }

        setActiveSection((prev) => (prev !== currentSection ? currentSection : prev));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (window.scrollY > 20) {
      handleScroll();
    }
    return () => { window.removeEventListener("scroll", handleScroll); cancelAnimationFrame(raf); };
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const NAVBAR_OFFSET = 80;
        const elementTop = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementTop - NAVBAR_OFFSET,
          behavior: "smooth",
        });
      }
      setMobileMenuOpen(false);
    },
    []
  );

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex justify-center px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pointer-events-none"
      >
        <div
          className={`glass-container pointer-events-auto w-fit max-w-[95vw] mx-auto flex items-center justify-between sm:justify-center gap-2 sm:gap-6 lg:gap-8 px-3 sm:px-6 py-1.5 sm:py-2.5 !rounded-full shadow-lg transition-all duration-300 min-h-[52px] max-h-[56px] ${
            scrolled ? "shadow-xl border-black/10 dark:border-white/15 bg-white/80 dark:bg-black/80" : ""
          }`}
        >
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "#top")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative w-20 sm:w-28 h-6 sm:h-8 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/Group 3.webp"
                alt="Logia Logo"
                fill
                sizes="(max-width: 640px) 80px, 112px"
                className="object-contain"
                priority
              />
            </div>
          </a>

          {/* Desktop Nav */}
          <div ref={navContainerRef} className="hidden lg:flex items-center gap-1 xl:gap-2 relative">
            <span
              className="absolute bottom-0 h-0.5 bg-black dark:bg-white rounded-full transition-all duration-300 pointer-events-none"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
                transform: `translateX(0px)` // Can be optimized more if needed
              }}
            />
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  data-href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`
                    link-slide relative px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95
                    ${isActive ? "text-black dark:text-white font-semibold" : "text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"}
                  `}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* CTA */}
            <button
              onClick={onOpenCollaboration}
              className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold grad-cta"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kolaborasi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ color: "var(--text-primary)" }}
              aria-label="Toggle Mobile Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu modal */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/60 backdrop-blur-md touch-none overscroll-contain transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-[min(340px,calc(100vw-2rem))] max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain m-auto rounded-3xl p-5 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-2xl border border-white/60 dark:border-white/15 shadow-2xl shadow-black/40 ring-1 ring-black/5 dark:ring-white/10"
              style={{
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`px-4 py-2.5 min-h-[44px] flex items-center justify-between rounded-2xl text-[15px] font-semibold transition-all duration-200 active:scale-[0.98] ${
                        isActive
                          ? "text-black dark:text-white bg-black/10 dark:bg-white/15 shadow-sm font-bold"
                          : "text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bronze)]" aria-hidden="true" />
                      )}
                    </a>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 mt-4 pt-3.5 border-t border-black/10 dark:border-white/10">
                <span className="text-xs font-semibold tracking-wide text-neutral-800 dark:text-neutral-200">
                  Ganti tema
                </span>
                <ThemeToggle />
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenCollaboration) onOpenCollaboration();
                }}
                className="mt-4 w-full py-3 min-h-[46px] rounded-2xl text-center text-sm font-bold active:scale-[0.98] flex items-center justify-center gap-2 grad-cta shadow-md transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mulai Kolaborasi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}