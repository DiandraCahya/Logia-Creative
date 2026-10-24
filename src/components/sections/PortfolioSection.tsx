"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import SplitWords from "@/components/animations/SplitWords";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";
import { openCollaborationModal } from "@/components/CollaborationManager";

const ART = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=70&w=1400&auto=format&fit=crop`

type Project = {
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  accent?: string;
  /** URL proyek live; opsional - hanya karya yang punya tautan yang menampilkannya. */
  link?: string;
  /** True bila gambarnya cut-out transparan (bukan foto) - panggung menampilkannya sebagai figur utuh. */
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
    title: "Video\nProfile\nKorporat",
    category: "Marketing",
    image: ART("1618005182384-a83a8bd57fbe"),
    description: "Produksi video profil perusahaan energi terbarukan untuk investor asing.",
    tags: ["Motion", "Premiere", "Storyboarding"],
    accent: "#2f7bff",
  },
  {
    title: "KWN\nKelompok\n2",
    category: "Web Development",
    image: "/justicia.webp",
    description: "Website profil kelompok KWN yang mengangkat isu kebebasan berekspresi dan regulasi ruang digital. Dibangun dengan Next.js dan siap tayang.",
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
    title: "Kampanye\nDigital\nOmnichannel",
    category: "Marketing",
    image: ART("1460925895917-afdab827c52f"),
    description: "Strategi aktivasi kampanye digital terpadu yang meningkatkan engagement dan konversi brand.",
    tags: ["Growth", "Campaign", "Performance"],
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

function PortfolioCard({
  project,
  gridVisible,
  idx,
  onSelect,
}: {
  project: Project;
  gridVisible: boolean;
  idx: number;
  onSelect?: (project: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const [px, setPx] = useState(50);
  const [py, setPy] = useState(50);

  // Tilt 3D hanya di desktop dengan cursor/mouse. Di layar sentuh mobile, tidak diaktifkan.
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

  const frameRef = useRef(0);
  const rectRef = useRef<DOMRect | null>(null);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    rectRef.current = e.currentTarget.getBoundingClientRect();
    setIsHovered(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    if (frameRef.current) return;
    const { clientX, clientY } = e;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const rect = rectRef.current ?? cardRef.current?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      const xPct = (clientX - rect.left) / rect.width - 0.5;
      const yPct = (clientY - rect.top) / rect.height - 0.5;
      // Card menghadap ke arah kursor secara responsif dan presisi
      setTilt({ rx: yPct * -12, ry: xPct * 12 });
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
        onClick={() => onSelect?.(project)}
        className="glass-container overflow-hidden group cursor-pointer flex flex-col h-full border border-slate-200 dark:border-white/10 relative transition-transform duration-200 ease-out active:scale-[0.98]"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"}`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Specular Glare */}
        <div
          className={`absolute inset-0 pointer-events-none z-20 mix-blend-overlay transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={{
            background: `radial-gradient(circle 320px at ${px}% ${py}%, rgba(255,255,255,0.45), transparent)`,
          }}
        />

        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative bg-slate-100 dark:bg-white/5" style={{ transform: "translateZ(20px)" }}>
          <Image
            src={project.image}
            alt={project.title.replace(/\n/g, ' ')}
            fill
            loading="lazy"
            decoding="async"
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
          <h3 className="font-righteous text-xl tracking-normal text-black dark:text-white mb-6 flex-grow transition-colors whitespace-pre-line">
            {project.title}
          </h3>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mb-5 inline-flex items-center gap-1.5 self-start rounded-full bg-black px-4 py-2 text-[11px] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97] dark:bg-white dark:text-black z-10"
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayFiltering, setIsOverlayFiltering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { ref: gridRef, isInView: gridVisible } = useScrollReveal();

  useEffect(() => setMounted(true), []);

  const transitioningToCollabRef = useRef(false);
  const selectedProjectRef = useRef<Project | null>(null);
  selectedProjectRef.current = selectedProject;

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

  const handleSelectCategory = (cat: string) => {
    if (cat === activeCategory) return;
    setIsOverlayFiltering(true);
    setActiveCategory(cat);
    setTimeout(() => {
      setIsOverlayFiltering(false);
    }, 180);
  };

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
    if (typeof window !== "undefined") {
      document.documentElement.dataset.archiveOpen = "true";
      document.documentElement.dataset.collabOpen = "true";
      window.dispatchEvent(
        new CustomEvent("collab-modal-state", { detail: { isOpen: true } })
      );
    }
  }, []);

  const closeArchive = useCallback((options?: { keepCollabOpen?: boolean }) => {
    setIsClosing(true);
    if (options?.keepCollabOpen) {
      transitioningToCollabRef.current = true;
      if (typeof window !== "undefined") {
        delete document.documentElement.dataset.archiveOpen;
      }
    } else {
      transitioningToCollabRef.current = false;
      if (typeof window !== "undefined") {
        delete document.documentElement.dataset.archiveOpen;
        if (!document.documentElement.dataset.collabActive) {
          delete document.documentElement.dataset.collabOpen;
          window.dispatchEvent(
            new CustomEvent("collab-modal-state", { detail: { isOpen: false } })
          );
        }
      }
    }
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
    document.documentElement.dataset.archiveOpen = "true";
    document.documentElement.dataset.collabOpen = "true"; // buat navbar menyusut seperti kolaborasi
    window.dispatchEvent(
      new CustomEvent("collab-modal-state", { detail: { isOpen: true } })
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (selectedProjectRef.current) {
          setSelectedProject(null);
          return;
        }
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
      delete document.documentElement.dataset.overlay;
      delete document.documentElement.dataset.archiveOpen;

      const shouldPreserveCollab =
        transitioningToCollabRef.current ||
        document.documentElement.dataset.collabActive === "true";

      if (!shouldPreserveCollab) {
        document.body.style.overflow = prevOverflow;
        delete document.documentElement.dataset.collabOpen;
        window.dispatchEvent(
          new CustomEvent("collab-modal-state", { detail: { isOpen: false } })
        );
      }
      transitioningToCollabRef.current = false;

      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        seeAllNode?.focus({ preventScroll: true });
      }
    };
  }, [showAllProjects, closeArchive]);

  return (
    <section id="portfolio" className="py-24 sm:py-32 relative bg-transparent w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <SplitWords as="h2" text="Selected Work" className="font-righteous tracking-normal text-[clamp(2.1rem,4.5vw,3.75rem)] text-black dark:text-white" />
        </div>

        {/* Filter Tabs Glassmorphism:
            - Mobile (< sm): 2 baris terstruktur simetris dengan glassmorphism & teks kontras tinggi
            - Desktop (sm ke atas): 1 baris horizontal rapi */}
        <div className="w-full mb-8 sm:mb-10" role="tablist" aria-label="Kategori karya">
          {/* Mobile view: 2 baris terstruktur simetris */}
          <div className="flex sm:hidden flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-1.5">
              {["Semua", "Branding", "UI/UX"].map((category, idx) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(category)}
                    style={{ animationDelay: `${idx * 60}ms` }}
                    className={`animate-category-pill px-3.5 py-2 min-h-[40px] rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 active:scale-95 border flex items-center justify-center ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md backdrop-blur-md scale-[1.02]"
                        : "bg-white/60 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/20 hover:scale-[1.02] border-black/10 dark:border-white/15 backdrop-blur-md shadow-sm"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black mr-1.5 shrink-0 animate-scale-in" aria-hidden="true" />
                    )}
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {["Web Development", "Marketing"].map((category, idx) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(category)}
                    style={{ animationDelay: `${(idx + 3) * 60}ms` }}
                    className={`animate-category-pill px-3.5 py-2 min-h-[40px] rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 active:scale-95 border flex items-center justify-center ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md backdrop-blur-md scale-[1.02]"
                        : "bg-white/60 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/20 hover:scale-[1.02] border-black/10 dark:border-white/15 backdrop-blur-md shadow-sm"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black mr-1.5 shrink-0 animate-scale-in" aria-hidden="true" />
                    )}
                    <span>
                      {category === "Web Development" ? (
                        <>
                          <span className="min-[350px]:hidden">Web Dev</span>
                          <span className="hidden min-[350px]:inline">Web Development</span>
                        </>
                      ) : (
                        category
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop view: 1 baris horizontal rapi */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2.5">
            {categories.map((category, idx) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  style={{ animationDelay: `${idx * 70}ms` }}
                  className={`animate-category-pill px-5 py-2.5 min-h-[44px] rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 active:scale-95 border flex items-center justify-center ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md backdrop-blur-md scale-[1.02]"
                      : "bg-white/60 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/20 hover:scale-[1.03] hover:-translate-y-0.5 border-black/10 dark:border-white/15 backdrop-blur-md shadow-sm"
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black mr-2 shrink-0 animate-scale-in" aria-hidden="true" />
                  )}
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
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
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[52px] rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform group cursor-pointer"
          >
            <span>Lihat Semua Proyek</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* Overlay Archive - di-portal ke <body> */}
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
              <div className="min-h-full pt-[max(2.5rem,calc(env(safe-area-inset-top)+2rem))] pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 sm:px-8">
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
                      onClick={() => closeArchive()}
                      className="shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--text-primary)_14%,transparent)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-95 cursor-pointer"
                      aria-label="Tutup Archive"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Filter Tabs overlay dengan glassmorphism & teks kontras tinggi */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 pb-1" role="tablist" aria-label="Filter kategori archive">
                    {categories.map((category, idx) => {
                      const isActive = activeCategory === category;
                      return (
                        <button
                          key={`overlay-${category}`}
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => handleSelectCategory(category)}
                          style={{ animationDelay: `${idx * 60 + 80}ms` }}
                          className={`animate-category-pill shrink-0 min-h-[40px] sm:min-h-[44px] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 active:scale-95 border flex items-center justify-center ${
                            isActive
                              ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md backdrop-blur-md scale-[1.02]"
                              : "bg-white/60 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-white/90 dark:hover:bg-white/20 hover:scale-[1.03] hover:-translate-y-0.5 border-black/10 dark:border-white/15 backdrop-blur-md shadow-sm"
                          }`}
                        >
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black mr-2 shrink-0 animate-scale-in" aria-hidden="true" />
                          )}
                          <span>{category}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile 1 kolom, tablet 2, desktop 3 (dengan 3D tilt di desktop & popup detail saat diklik) */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOverlayFiltering ? "opacity-0 translate-y-3 scale-[0.99]" : "opacity-100 translate-y-0 scale-100"
                  }`}>
                    {allProjects
                      .filter((p) => activeCategory === "Semua" || p.category === activeCategory)
                      .map((project, idx) => (
                        <PortfolioCard
                          key={`overlay-${project.title.replace(/\s+/g, "-")}-${idx}`}
                          project={project}
                          gridVisible={showAllProjects && !isOverlayFiltering}
                          idx={Math.min(idx, 6)}
                          onSelect={(proj) => setSelectedProject(proj)}
                        />
                      ))}
                  </div>
                </div>
              </div>
        </div>,
        document.body
      )}

      {/* Popup Detail Mengenai Card Proyek (Desktop & Mobile) */}
      {mounted && selectedProject && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detail proyek ${selectedProject.title.replace(/\n/g, " ")}`}
          className="fixed inset-0 z-[10005] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-up overscroll-contain"
          onClick={() => setSelectedProject(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#121212] p-5 sm:p-8 text-black dark:text-white shadow-2xl flex flex-col"
          >
            {/* Tombol Tutup X */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors active:scale-95 z-20 cursor-pointer"
              aria-label="Tutup detail proyek"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gambar Proyek */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-5 border border-black/5 dark:border-white/10 bg-slate-100 dark:bg-neutral-900 shrink-0">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title.replace(/\n/g, " ")}
                fill
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover"
              />
            </div>

            {/* Kategori Badge */}
            <div className="mb-2">
              <span className="inline-block text-xs font-bold text-[#666666] dark:text-[#999999] uppercase tracking-wider px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                {selectedProject.category}
              </span>
            </div>

            {/* Judul Proyek */}
            <h3 className="font-righteous text-2xl sm:text-3xl text-black dark:text-white mb-3 whitespace-pre-line leading-tight">
              {selectedProject.title}
            </h3>

            {/* Deskripsi */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
              {selectedProject.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-black/5 dark:bg-white/5 text-black dark:text-white border border-black/10 dark:border-white/10 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Aksi */}
            <div className="flex flex-wrap items-center gap-3 mt-auto pt-4 border-t border-black/10 dark:border-white/10">
              {selectedProject.link && (
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-full bg-black text-white dark:bg-white dark:text-black text-xs sm:text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <span>Kunjungi Website</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  const proj = selectedProject;
                  setSelectedProject(null);
                  closeArchive({ keepCollabOpen: true });
                  if (proj) {
                    openCollaborationModal({
                      name: "",
                      brandName: "",
                      contact: "",
                      budget: "",
                      services: [proj.category],
                      notes: `Tertarik dengan portofolio ${proj.title.replace(/\n/g, " ")}.`,
                    });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-full border border-black/20 dark:border-white/20 text-black dark:text-white text-xs sm:text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Konsultasikan Proyek Serupa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
