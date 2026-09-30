"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
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

        setActiveSection(currentSection);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
                src="/Group 3.png"
                alt="Logia Logo"
                fill
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
      </motion.header>

      {/* Mobile Menu — full-screen sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 lg:hidden bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-3 top-2 max-h-[70dvh] overflow-y-auto rounded-2xl bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 shadow-xl pt-[max(3.5rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] px-4"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-4 py-3 min-h-[48px] flex items-center rounded-xl text-base font-medium transition-colors ${
                      activeSection === link.href
                        ? "text-black dark:text-white bg-black/5 dark:bg-white/10"
                        : "text-neutral-600 dark:text-neutral-300 active:bg-black/5 dark:active:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1">
                  <ThemeToggle />
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Ganti tema</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenCollaboration) onOpenCollaboration();
                }}
                className="mt-4 w-full py-3.5 min-h-[52px] rounded-2xl text-center text-sm font-semibold active:scale-[0.98] flex items-center justify-center gap-2 grad-cta"
              >
                <Sparkles className="w-4 h-4" />
                Mulai Kolaborasi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}