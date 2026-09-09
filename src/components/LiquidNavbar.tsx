"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface LiquidNavbarProps {
  onOpenCollaboration?: () => void;
}

const navLinks = [
  { name: "Tentang & Target", href: "#tentang" },
  { name: "Layanan & Solusi", href: "#layanan" },
  { name: "SWOT & Roadmap", href: "#swot-roadmap" },
  { name: "Keberlanjutan", href: "#keberlanjutan" },
];

export function LiquidNavbar({ onOpenCollaboration }: LiquidNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active link detection
      const sections = ["tentang", "layanan", "swot-roadmap", "keberlanjutan"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 sm:top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
      >
        <nav
          className={`
            pointer-events-auto w-full max-w-6xl mx-auto flex items-center justify-between
            px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-500
            ${
              scrolled
                ? "liquid-glass-pill shadow-[0_15px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                : "bg-white/40 dark:bg-brand-navy/50 backdrop-blur-lg border border-white/30 dark:border-brand-aqua/15"
            }
          `}
        >
          {/* Logo & Brand Mark */}
          <Link
            href="#top"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative w-24 sm:w-28 h-7 sm:h-8 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/LOGO.png"
                alt="Logia Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary dark:text-brand-aqua border border-brand-primary/20">
              Agency
            </span>
          </Link>

          {/* Desktop Navigation Links with Magnetic Hover */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200
                    ${
                      isActive
                        ? "text-brand-primary dark:text-brand-aqua font-semibold"
                        : "text-foreground/75 hover:text-brand-primary dark:hover:text-brand-mint"
                    }
                  `}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full bg-brand-primary/10 dark:bg-brand-aqua/15 border border-brand-primary/20 dark:border-brand-aqua/30 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Items: Theme Toggle & Collaboration CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenCollaboration}
              className="relative group overflow-hidden px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-primary via-brand-aqua to-brand-slate shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] transition-all"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kolaborasi</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl bg-white/50 dark:bg-brand-navy/60 border border-brand-primary/20 text-foreground"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-30 lg:hidden p-6 rounded-3xl liquid-glass-pill shadow-2xl flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-brand-primary/10 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCollaboration) onOpenCollaboration();
              }}
              className="w-full py-3 rounded-2xl text-center text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-aqua shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Mulai Kolaborasi Sekarang
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
