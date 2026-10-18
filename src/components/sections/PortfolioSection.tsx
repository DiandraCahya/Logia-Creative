"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import SplitWords from "@/components/animations/SplitWords";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";

const ART = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=70&w=1400&auto=format&fit=crop`

type Project = {
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  accent?: string;
  /** URL proyek live; opsional — hanya karya yang punya tautan yang menampilkannya. */
  link?: string;
  /** True bila gambarnya cut-out transparan (bukan foto) — panggung menampilkannya sebagai figur utuh. */
  figure?: boolean;
};

const projects: Project[] = [
  {
    title: "Revitalisasi\nIdentitas\nNusantara",
    category: "Branding",
    image: ART("1518770660439-4636190af475"),
    description: "Mendesain ulang identitas visual brand lokal untuk menembus pasar internasional tanpa menghilangkan akar budaya.",
    tags: ["Logo Design", "Identity", "Brand Book"],
    accent: "#ff4114",
  },
  {
    title: "Platform\nEdukasi\nKreatif",
    category: "Web Development",
    image: ART("1618005182384-a83a8bd57fbe"),
    description: "Pengembangan platform e-learning responsif dan interaktif menggunakan ekosistem Next.js modern.",
    tags: ["Next.js", "Tailwind CSS", "UI/UX"],
    accent: "#00c8ff",
  },
  {
    title: "Aplikasi\nManajemen\nBisnis",
    category: "UI/UX",
    image: ART("1614850523459-c2f4c699c52e"),
    description: "Antarmuka intuitif untuk SaaS B2B, mempercepat proses onboarding pengguna baru hingga 40%.",
    tags: ["Figma", "Prototyping", "User Research"],
    accent: "#7b61ff",
  },
  {
    title: "KWN\nKelompok\n2",
    category: "Web Development",
    image: "/justicia.webp",
    description: "Website profil kelompok KWN — mengangkat isu kebebasan berekspresi dan regulasi ruang digital. Dibangun dengan Next.js dan siap tayang.",
    tags: ["Next.js", "Web Design", "Responsive"],
    link: "https://kwn-kelompok-2.vercel.app/",
    figure: true,
  },
  {
    title: "E-Commerce\nArtisan",
    category: "Web Development",
    image: ART("1618005182384-a83a8bd57fbe"),
    description: "Toko online untuk pengrajin lokal dengan pengalaman belanja yang mulus dan cepat.",
    tags: ["React", "API", "E-Commerce"],
    accent: "#4356c8",
  },
  {
    title: "Rebranding\nKafe\nUrban",
    category: "Branding",
    image: ART("1614850523459-c2f4c699c52e"),
    description: "Penyegaran visual kafe kopi urban mulai dari logo, kemasan, hingga desain menu digital.",
    tags: ["Packaging", "Visual", "Typography"],
    accent: "#ff3b6b",
  },
];

const allProjects: Project[] = [
  ...projects,
  {
    title: "Aplikasi\nFinance\nTrack",
    category: "UI/UX",
    image: ART("1518770660439-4636190af475"),
    description: "Dashboard analitik keuangan untuk startup dengan tampilan dark mode premium.",
    tags: ["Figma", "Dashboard", "Fintech"],
    accent: "#14307a",
  },
  {
    title: "Video\nProfile\nKorporat",
    category: "Marketing",
    image: ART("1618005182384-a83a8bd57fbe"),
    description: "Produksi video profil perusahaan energi terbarukan untuk investor asing.",
    tags: ["Motion", "Premiere", "Storyboarding"],
    accent: "#2f7bff",
  },
  {
    title: "Aplikasi\nBooking\nKlinik",
    category: "Web Development",
    image: ART("1614850523459-c2f4c699c52e"),
    description: "Sistem reservasi online rumah sakit dengan sinkronisasi jadwal real-time.",
    tags: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    accent: "#e5231b",
  }
];

const categories = ["Semua", "Branding", "Web Development", "UI/UX", "Marketing"];

function PortfolioCard({ project, gridVisible, idx }: { project: any, gridVisible: boolean, idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const [px, setPx] = useState(50);
  const [py, setPy] = useState(50);

  // Tilt 3D hanya di perangkat berpointer presisi. Di layar sentuh efek ini
  // tak terpakai — jadi jangan pasang listener sama sekali.
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setTiltEnabled(canHover.matches && !reducedMotion.matches);
    sync();
    canHover.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      canHover.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  // Pointer dipegang di elemen kartu, bukan di window: satu handler per kartu
  // dan hanya aktif saat kursor benar-benar di atasnya. rAF-throttle menjaga
  // hitungan maksimal sekali per frame walau pointer bergerak lebih cepat.
  const frameRef = useRef(0);
  const rectRef = useRef<DOMRect | null>(null);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    rectRef.current = e.currentTarget.getBoundingClientRect(); // baca layout sekali
    setIsHovered(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !stillAnimating()) return;
    if (frameRef.current) return; // sudah ada frame terjadwal
    const { clientX, clientY } = e;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const rect = rectRef.current ?? cardRef.current?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      const xPct = (clientX - rect.left) / rect.width - 0.5;
      const yPct = (clientY - rect.top) / rect.height - 0.5;
      setTilt({ rx: yPct * -8, ry: xPct * 8 }); // max ±8deg, CSS transition meratakan
      setPx(((clientX - rect.left) / rect.width) * 100);
      setPy(((clientY - rect.top) / rect.height) * 100);
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    rectRef.current = null;
    setTilt({ rx: 0, ry: 0 });
    setPx(50);
    setPy(50);
    setIsHovered(false);
  };

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      style={{ perspective: 1000 }}
      className={`h-full transition-all duration-500 ${gridVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"}`}
    >
      <div
        className="glass-container overflow-hidden group cursor-pointer flex flex-col h-full border border-slate-200 dark:border-white/10 relative transition-transform duration-200 ease-out"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Specular Glare */}
        <div
          className={`absolute inset-0 pointer-events-none z-20 mix-blend-overlay transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={{
            background: `radial-gradient(circle 300px at ${px}% ${py}%, rgba(255,255,255,0.4), transparent)`,
          }}
        />

        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative bg-slate-100 dark:bg-white/5" style={{ transform: "translateZ(20px)" }}>
          <Image
            src={project.image}
            alt={project.title.replace(/\n/g, ' ')}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-all duration-700 ease-out [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow bg-white/95 dark:bg-[#111]/95 border-t border-black/5 dark:border-white/10" style={{ transform: "translateZ(40px)" }}>
          <span className="inline-block text-[11px] font-bold text-[#666666] dark:text-[#999999] uppercase tracking-wider mb-2 transition-transform duration-300 group-hover:-translate-y-1">
            {project.category}
          </span>
          <h3 className="font-display text-xl font-medium text-black dark:text-white mb-6 flex-grow transition-colors whitespace-pre-line">
            {project.title}
          </h3>
          {/* Sama seperti di carousel: hanya karya yang punya `link` yang
              menampilkan tombol ini, supaya tidak ada tautan karangan.
              Ditaruh SEBELUM baris tag: tag tetap jadi elemen paling bawah
              yang rata dengan kartu tetangganya. */}
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-5 inline-flex items-center gap-1.5 self-start rounded-full bg-black px-4 py-2 text-[11px] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97] dark:bg-white dark:text-black"
            >
              <span>Kunjungi Website</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}

          <div className="flex flex-wrap gap-2 mt-auto transition-transform duration-300 group-hover:-translate-y-1">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 bg-black/5 dark:bg-white/5 text-black dark:text-white border border-black/10 dark:border-white/10 rounded-full font-medium uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Perendam gerak saat overlay Archive terbuka: hero & 3D sudah memeriksa ini,
// tapi parrallax/gyroscope lain belum. Satu hakim terpusat = hemat CPU saat overlay.
const stillAnimating = () => !document.documentElement.dataset.overlay;

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [displayedCategory, setDisplayedCategory] = useState("Semua");
  const [isExiting, setIsExiting] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { ref: gridRef, isInView: gridVisible } = useScrollReveal();

  useEffect(() => setMounted(true), []);

  // Archive overlay: refs untuk focus restore + focus trap
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const seeAllBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeCategory !== displayedCategory) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setDisplayedCategory(activeCategory);
        setIsExiting(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeCategory, displayedCategory]);

  const filteredProjects = projects.filter(
    (project) => displayedCategory === "Semua" || project.category === displayedCategory
  );

  const carouselItems: HeroCarouselItem[] = filteredProjects.map((p, i) => ({
    id: i,
    title: p.title,
    image: p.image,
    description: p.description,
    category: p.category,
    meta: p.tags,
    href: p.link,
    figure: p.figure,
  }));

  const openArchive = useCallback(() => {
    setIsClosing(false);
    setShowAllProjects(true);
  }, []);

  const closeArchive = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setShowAllProjects(false);
      setIsClosing(false);
    }, 250);
  }, []);

  useEffect(() => {
    if (!showAllProjects) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.overlay = "1"; // pause render 3D & hero

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeArchive();
        return;
      }
      if (e.key !== "Tab") return;
      const root = overlayRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    const seeAllNode = seeAllBtnRef.current;

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.overlay;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        seeAllNode?.focus({ preventScroll: true });
      }
    };
  }, [showAllProjects, closeArchive]);

  return (
    <section id="portfolio" className="py-24 sm:py-32 relative bg-transparent w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <SplitWords as="h2" text="Selected Work" className="font-display font-medium tracking-[-0.02em] text-[clamp(2rem,4vw,3.5rem)] text-black dark:text-white" />
        </div>

        {/* Filter Tabs (section) — scroll horizontal di mobile tanpa memotong teks */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                  : "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio List using HeroCarousel */}
        <div ref={gridRef} className={`w-full h-auto sm:h-[85vh] min-h-0 sm:min-h-[85vh] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          (gridVisible && !isExiting) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {carouselItems.length > 0 ? (
            <HeroCarousel
              items={carouselItems}
              defaultIndex={Math.floor(carouselItems.length / 2)}
            />
          ) : null}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <button
            ref={seeAllBtnRef}
            onClick={openArchive}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[52px] rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform group"
          >
            <span>Lihat Semua Proyek</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* Overlay Archive — di-portal ke <body> agar `fixed` mengacu ke viewport
          (bukan ke <section data-cv> yang memakai content-visibility:auto).
          Fullscreen `fixed inset-0`, 100dvh + safe-area, scroll sendiri.
          Tutup HANYA lewat tombol X (sticky, safe-area); Esc memicu X yang sama.
          Tidak ada tutup via klik backdrop / swipe. */}
      {mounted && (showAllProjects || isClosing) && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Archive proyek"
          ref={overlayRef}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          className={`z-[60] h-[100dvh] w-full overflow-y-auto overscroll-contain bg-[#fafafa] dark:bg-[#0a0a0a] transition-opacity duration-200 ${
            showAllProjects && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
              <div className="min-h-full pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                  {/* Header sticky + tombol X satu-satunya penutup */}
                  <div className="flex items-start justify-between gap-3 mb-5 sm:mb-10 sticky top-[max(0.5rem,env(safe-area-inset-top))] z-20 py-2.5 px-3 sm:px-6 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--text-primary)_12%,transparent)] glass-card">
                    <div className="min-w-0">
                      <h2 className="font-display text-lg sm:text-3xl font-medium text-[var(--text-primary)] tracking-[-0.02em] leading-tight">
                        Archive
                      </h2>
                      <p className="text-[11px] sm:text-sm text-[var(--text-muted)] mt-0.5 leading-snug">
                        Seluruh eksplorasi proyek desain, identitas visual, dan pengembangan digital.
                      </p>
                    </div>
                    <button
                      ref={closeBtnRef}
                      onClick={closeArchive}
                      className="shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--text-primary)_14%,transparent)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-95"
                      aria-label="Tutup Archive"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Filter Tabs overlay — scroll horizontal di mobile, tidak memotong teks */}
                  <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 pb-1">
                    {categories.map((category) => (
                      <button
                        key={`overlay-${category}`}
                        onClick={() => setActiveCategory(category)}
                        className={`shrink-0 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 active:scale-95 ${
                          activeCategory === category
                            ? "bg-black text-white dark:bg-white dark:text-black border border-transparent"
                            : "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Mobile 1 kolom (kartu lebih pendek), tablet 2, desktop 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {allProjects
                      .filter((p) => activeCategory === "Semua" || p.category === activeCategory)
                      .map((project, idx) => (
                        <PortfolioCard
                          key={`overlay-${project.title}`}
                          project={project}
                          gridVisible={showAllProjects}
                          idx={Math.min(idx, 6)}
                        />
                      ))}
                  </div>
                </div>
              </div>
        </div>,
        document.body
      )}
    </section>
  );
}
