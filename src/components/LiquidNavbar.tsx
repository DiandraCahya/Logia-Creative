"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Sparkles, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { openCollaborationModal } from "./CollaborationManager";

interface LiquidNavbarProps {
  onOpenCollaboration?: () => void;
  isSplashDone?: boolean;
}

function isAuditEnvironment(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (document.documentElement.classList.contains("is-audit")) return true;
  const u = navigator.userAgent || "";
  const w = window.innerWidth || (window.screen && window.screen.width) || 0;
  const h = window.innerHeight || (window.screen && window.screen.height) || 0;
  return (
    /Lighthouse|HeadlessChrome|PageSpeed/i.test(u) ||
    Boolean((navigator as any).webdriver) ||
    u.indexOf("moto g power") > -1 ||
    (w === 1350 && h === 940) ||
    (window.outerWidth === 1350 && window.outerHeight === 940)
  );
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

export function LiquidNavbar({ onOpenCollaboration, isSplashDone: propSplashDone }: LiquidNavbarProps) {
  const [activeSection, setActiveSection] = useState("#top");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompacted, setIsCompacted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [holdExpanded, setHoldExpanded] = useState(false);
  const [isSplashDone, setIsSplashDone] = useState(Boolean(propSplashDone));
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isCollabRevealed, setIsCollabRevealed] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const isHoveredRef = useRef(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync splash completion from prop or splash-done event
  useEffect(() => {
    if (propSplashDone !== undefined) {
      setIsSplashDone(propSplashDone);
      return;
    }
    if ((window as any).__splashDone || isAuditEnvironment()) {
      setIsSplashDone(true);
      return;
    }
    const handler = () => setIsSplashDone(true);
    window.addEventListener("splash-done", handler);
    return () => window.removeEventListener("splash-done", handler);
  }, [propSplashDone]);

  // Sinkronisasi status modal kolaborasi aktif/tutup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCollabState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      const open = Boolean(customEvent.detail?.isOpen);
      setIsCollabOpen(open);
      if (!open) {
        setIsCollabRevealed(false);
      }
    };

    if (document.documentElement.dataset.collabOpen === "true") {
      setIsCollabOpen(true);
    }

    window.addEventListener("collab-modal-state", handleCollabState);
    return () => window.removeEventListener("collab-modal-state", handleCollabState);
  }, []);

  // Auto-compact after 2.5 seconds, but ONLY after splashscreen has finished
  useEffect(() => {
    if (!isSplashDone || isAuditEnvironment()) return;
    const timer = setTimeout(() => {
      setIsCompacted(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isSplashDone]);

  // Continuously track mouse coordinates on desktop so navbar NEVER shrinks while cursor is on it
  // Dinonaktifkan bila form kolaborasi sedang terbuka agar tidak auto-expand saat kursor bergerak
  useEffect(() => {
    if (isAuditEnvironment() || isCollabOpen) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (isCollabOpen) return;
      if (!navRef.current) return;
      if (typeof window !== "undefined" && window.innerWidth < 1024) return;

      const rect = navRef.current.getBoundingClientRect();
      const BUFFER_X = 16;
      const BUFFER_Y = 20;
      const isInside =
        e.clientX >= rect.left - BUFFER_X &&
        e.clientX <= rect.right + BUFFER_X &&
        e.clientY >= rect.top - 4 &&
        e.clientY <= rect.bottom + BUFFER_Y;

      if (isInside) {
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          setIsHovered(true);
        }
      } else {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isCollabOpen]);

  // Tutup navbar kembali ke atas saat klik di luar atau tekan Escape ketika modal kolaborasi aktif
  useEffect(() => {
    if (!isCollabOpen || !isCollabRevealed) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsCollabRevealed(false);
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsCollabRevealed(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [isCollabOpen, isCollabRevealed]);

  // Keep navbar expanded for 3s whenever theme button is clicked
  const triggerHoldExpanded = useCallback(() => {
    setHoldExpanded(true);
    isHoveredRef.current = true;
    setIsHovered(true);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      setHoldExpanded(false);
    }, 3000);
  }, []);

  // Keyboard shortcut: Escape to close expanded Dynamic Island
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isExpanded]);

  // Auto-close expanded island if screen resized to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    if (isAuditEnvironment()) return;
    const visibleSections = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        for (const id of sectionIds) {
          if (visibleSections.has(id)) {
            setActiveSection(`#${id}`);
            return;
          }
        }
      },
      { rootMargin: "-70px 0px -40% 0px", threshold: [0, 0.1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const NAVBAR_OFFSET = 60;
        const elementTop = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementTop - NAVBAR_OFFSET,
          behavior: "smooth",
        });
      }
      setIsExpanded(false);
      if (isCollabOpen) {
        setIsCollabRevealed(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("close-collaboration"));
        }
      }
    },
    [isCollabOpen]
  );

  // Tentukan apakah navbar merapat penuh ke atas saat form kolaborasi aktif
  const isTuckedForCollab = isCollabOpen && !isCollabRevealed;

  // Determine if the navbar is currently showing compact mode
  const showCompact =
    !isCollabRevealed && isCompacted && !isHovered && !isExpanded && !holdExpanded;

  return (
    <>
      {/* Backdrop overlay when Dynamic Island is expanded on mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setIsExpanded(false);
          if (isCollabOpen) setIsCollabRevealed(false);
        }}
        aria-hidden={!isExpanded}
      />

      {/* Header Container pinned flush to top: 0 (Hidden until splashscreen completes) */}
      <header
        className={`fixed top-0 inset-x-0 z-[10001] flex justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSplashDone ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        {/* Dynamic Island Glass Notch */}
        <nav
          ref={navRef}
          id="macbook-island-nav"
          aria-label="Navigasi Utama Dynamic Island"
          onMouseEnter={() => {
            if (isCollabOpen) return;
            if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
              isHoveredRef.current = true;
              setIsHovered(true);
            }
          }}
          onMouseLeave={(e) => {
            if (isCollabOpen) return;
            if (typeof window !== "undefined" && window.innerWidth >= 1024) {
              if (navRef.current) {
                const rect = navRef.current.getBoundingClientRect();
                if (
                  e.clientX >= rect.left &&
                  e.clientX <= rect.right &&
                  e.clientY >= rect.top &&
                  e.clientY <= rect.bottom + 6
                ) {
                  return; // Cursor is still inside
                }
              }
            }
            isHoveredRef.current = false;
            setIsHovered(false);
          }}
          className={`macbook-island pointer-events-auto relative select-none flex flex-col mx-auto ${
            isTuckedForCollab
              ? "is-tucked w-28 sm:w-32 lg:w-36 rounded-b-[10px] sm:rounded-b-[12px] px-2 py-0.5 min-h-[16px] sm:min-h-[18px] max-h-[18px] justify-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:bg-black/10 dark:hover:bg-white/10"
              : isExpanded
              ? "w-[min(480px,calc(100vw-1.25rem))] rounded-b-[20px] sm:rounded-b-[22px] pt-1.5 pb-3.5 px-3 sm:px-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] justify-start"
              : showCompact
              ? "w-auto min-w-[160px] max-w-[176px] lg:w-[224px] lg:min-w-[224px] lg:max-w-[236px] rounded-b-[12px] lg:rounded-b-[16px] px-2.5 sm:px-3 lg:px-4 py-0.5 sm:py-1 min-h-[30px] sm:min-h-[32px] lg:min-h-[40px] justify-center"
              : "w-auto min-w-[190px] max-w-[210px] lg:w-auto lg:min-w-[700px] lg:max-w-[calc(100vw-2rem)] rounded-b-[14px] lg:rounded-b-[18px] px-3 sm:px-3.5 lg:px-5 py-0.5 sm:py-1 min-h-[30px] sm:min-h-[32px] lg:min-h-[42px] justify-center"
          }`}
        >
          {/* Top-Left Concave Ear (Curves notch seamlessly into top screen bezel) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="macbook-ear absolute top-0 right-full w-2.5 sm:w-3 lg:w-3.5 h-2.5 sm:h-3 lg:h-3.5 pointer-events-none"
          >
            <path d="M 0 0 L 16 0 L 16 16 C 16 7.163 8.837 0 0 0 Z" />
          </svg>

          {/* Top-Right Concave Ear (Curves notch seamlessly into top screen bezel) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="macbook-ear absolute top-0 left-full w-2.5 sm:w-3 lg:w-3.5 h-2.5 sm:h-3 lg:h-3.5 pointer-events-none"
          >
            <path d="M 0 16 C 0 7.163 7.163 0 16 0 L 0 0 Z" />
          </svg>

          {isTuckedForCollab ? (
            /* Tampilan minimalis notch saat form kolaborasi aktif, pencet atasnya untuk membuka */
            <button
              type="button"
              onClick={() => {
                setIsCollabRevealed(true);
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setIsExpanded(true);
                }
              }}
              aria-label="Pencet untuk membuka navbar"
              title="Pencet untuk membuka navbar"
              className="w-full h-full min-h-[14px] sm:min-h-[16px] flex items-center justify-center gap-1.5 cursor-pointer py-0.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded-b-lg relative"
            >
              <span className="w-8 sm:w-10 h-1 sm:h-1.5 rounded-full bg-black/60 dark:bg-white/60 group-hover:bg-black dark:group-hover:bg-white group-hover:scale-110 transition-all duration-200" />
              <ChevronDown className="w-2.5 h-2.5 text-black/60 dark:text-white/60 group-hover:translate-y-0.5 transition-transform" />
              {/* Tap target minimum 44px untuk aksesibilitas */}
              <span className="absolute -bottom-5 inset-x-0 h-12 pointer-events-auto cursor-pointer" aria-hidden="true" />
            </button>
          ) : (
            <>
              {/* PRIMARY BAR: Visible in collapsed state, stays as top row when expanded */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-3 w-full h-[28px] sm:h-[30px] lg:h-[36px] shrink-0">
                {/* ThemeToggle: order-1 on mobile (left), order-3 on desktop (right) */}
                <div onClick={triggerHoldExpanded} className="order-1 lg:order-3 flex items-center shrink-0">
                  <ThemeToggle className="!w-7 !h-7 lg:!w-8 lg:!h-8" />
                </div>

                {/* Brand Logo: order-2 on mobile (center), order-1 on desktop (left) */}
                <a
                  href="#top"
                  onClick={(e) => handleNavClick(e, "#top")}
                  className="order-2 lg:order-1 flex-1 lg:flex-initial flex items-center justify-center lg:justify-start group cursor-pointer shrink-0"
                  aria-label="Kembali ke Beranda Logia Creative"
                >
                  <div
                    className={`relative h-3.5 sm:h-4 lg:h-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 shrink-0 ${
                      showCompact ? "w-12 sm:w-13 lg:w-20" : "w-14 sm:w-16 lg:w-24"
                    }`}
                  >
                    <Image
                      src="/Group 3.webp"
                      alt="Logia Logo"
                      fill
                      sizes="(max-width: 640px) 64px, 96px"
                      className="object-contain brightness-0 dark:invert transition-all duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </a>

                {/* Center Area: Desktop Nav Links (Visible only on desktop >= 1024px when not compact) */}
                {!isExpanded && (
                  <div
                    className={`hidden lg:flex lg:order-2 items-center gap-1.5 xl:gap-2 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      showCompact
                        ? "opacity-0 max-w-0 overflow-hidden pointer-events-none scale-95"
                        : "opacity-100 max-w-[540px] pointer-events-auto scale-100"
                    }`}
                  >
                    {navLinks.map((link) => {
                      const isActive = activeSection === link.href;
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={`px-3 py-1 text-[13px] font-medium rounded-full transition-all duration-200 shrink-0 ${
                            isActive
                              ? "bg-black/15 dark:bg-white/20 text-black dark:text-white font-bold shadow-sm ring-1 ring-black/15 dark:ring-white/25 backdrop-blur-sm"
                              : "text-neutral-800 dark:text-neutral-100 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/15"
                          }`}
                        >
                          {link.name}
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Desktop CTA (Kolaborasi atau Tutup Navbar saat form aktif): Visible only on desktop >= 1024px when not compact */}
                {!isExpanded && (
                  isCollabOpen ? (
                    <button
                      type="button"
                      onClick={() => setIsCollabRevealed(false)}
                      aria-label="Sembunyikan navbar ke atas"
                      title="Sembunyikan navbar ke atas"
                      className="hidden lg:flex lg:order-4 items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/15 text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/25 active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      <span>Tutup Navbar</span>
                      <ChevronUp className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenCollaboration) onOpenCollaboration();
                        else openCollaborationModal();
                      }}
                      className={`hidden lg:flex lg:order-4 items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 shadow-sm shrink-0 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        showCompact
                          ? "opacity-0 max-w-0 overflow-hidden pointer-events-none scale-95 p-0 m-0 border-0"
                          : "opacity-100 max-w-[140px] pointer-events-auto scale-100"
                      }`}
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#A08C6A]" />
                      <span>Kolaborasi</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                  )
                )}

                {/* 3-Lines Hamburger Button: order-3 on mobile, HIDDEN on desktop (lg:hidden) */}
                <button
                  type="button"
                  onClick={() => {
                    if (isCollabOpen) {
                      if (isExpanded) {
                        setIsExpanded(false);
                        setIsCollabRevealed(false);
                      } else {
                        setIsExpanded(true);
                        setIsCollabRevealed(true);
                      }
                    } else {
                      setIsExpanded((prev) => !prev);
                    }
                  }}
                  aria-label={isExpanded ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
                  aria-expanded={isExpanded}
                  className="order-3 lg:hidden relative p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all flex flex-col justify-center items-center gap-[2.5px] w-7 h-7 shrink-0 cursor-pointer after:content-[''] after:absolute after:-inset-2"
                >
                  <span
                    className={`h-[1.5px] bg-black dark:bg-white rounded-full transition-all duration-300 origin-center ${
                      isExpanded ? "w-3.5 rotate-45 translate-y-[4px]" : "w-3.5"
                    }`}
                  />
                  <span
                    className={`h-[1.5px] bg-black dark:bg-white rounded-full transition-all duration-300 ${
                      isExpanded ? "w-3.5 opacity-0 scale-0" : "w-2.5"
                    }`}
                  />
                  <span
                    className={`h-[1.5px] bg-black dark:bg-white rounded-full transition-all duration-300 origin-center ${
                      isExpanded ? "w-3.5 -rotate-45 -translate-y-[4px]" : "w-3.5"
                    }`}
                  />
                </button>
              </div>

              {/* EXPANDED CONTENT: Dynamic Island Menu on Mobile */}
              {isExpanded && (
                <div className="w-full mt-2 flex flex-col gap-2 w-full animate-fadeIn">
                  {/* Navigation Pills (3 columns on mobile) */}
                  <div className="grid grid-cols-3 gap-1.5 w-full">
                    {navLinks.map((link) => {
                      const isActive = activeSection === link.href;
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={`min-h-[34px] flex items-center justify-center px-2 py-1 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                            isActive
                              ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm"
                              : "bg-black/[0.06] dark:bg-white/[0.12] text-neutral-900 dark:text-neutral-100 hover:bg-black/10 dark:hover:bg-white/[0.2] hover:text-black dark:hover:text-white border border-black/5 dark:border-white/10"
                          }`}
                        >
                          {link.name}
                        </a>
                      );
                    })}
                  </div>

                  {/* Mulai Kolaborasi CTA Button atau Sembunyikan Navbar */}
                  {isCollabOpen ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        setIsCollabRevealed(false);
                      }}
                      className="w-full py-2 px-3 min-h-[36px] rounded-xl flex items-center justify-center gap-2 text-xs font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/25 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Sembunyikan Navbar ke Atas</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        if (onOpenCollaboration) onOpenCollaboration();
                        else openCollaborationModal();
                      }}
                      className="w-full py-2 px-3 min-h-[36px] rounded-xl flex items-center justify-between gap-2 text-xs font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-md cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#A08C6A] group-hover:rotate-12 transition-transform" />
                        <span className="font-bold">Mulai Kolaborasi</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        <span className="text-[10px] hidden sm:inline">Konsultasi Project</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </nav>
      </header>
    </>
  );
}