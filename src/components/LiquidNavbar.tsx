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
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

const sectionIds = ["home", "about", "services", "contact"];

export function LiquidNavbar({ onOpenCollaboration }: LiquidNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll spy
  useEffect(() => {
    const NAVBAR_OFFSET = 80;

    const handleScroll = () => {
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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
        className="fixed top-4 sm:top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
      >
        <div
          className={`glass-container pointer-events-auto w-full max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 !rounded-full`}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
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
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`
                    link-slide px-4 py-2 text-sm font-medium transition-colors
                    ${isActive ? "text-accent-primary font-semibold active" : "text-text-primary hover:text-accent-primary"}
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
              className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold btn-interactive btn-collaborate"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kolaborasi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-text-primary hover:bg-bg-secondary btn-press"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-30 lg:hidden"
          >
            <div className="glass-container p-6 !rounded-3xl flex flex-col gap-4 shadow-xl">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === link.href
                        ? "text-accent-primary bg-accent-primary/5"
                        : "text-text-primary hover:bg-bg-secondary"
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenCollaboration) onOpenCollaboration();
                }}
                className="w-full py-3 rounded-xl text-center text-sm font-semibold btn-press flex items-center justify-center gap-2 btn-collaborate"
              >
                <Sparkles className="w-4 h-4" />
                Mulai Kolaborasi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}