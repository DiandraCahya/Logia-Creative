"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import SplitWords from "@/components/animations/SplitWords";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";

const ART = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=2070&auto=format&fit=crop`

const projects = [
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
    title: "Kampanye\nMusim\nSemi",
    category: "Marketing",
    image: ART("1518770660439-4636190af475"),
    description: "Materi kampanye digital menyeluruh untuk peluncuran produk kosmetik dengan tingkat konversi tinggi.",
    tags: ["Meta Ads", "Social Media", "Creative"],
    accent: "#ff2f9c",
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

const allProjects = [
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

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const [px, setPx] = useState(50);
  const [py, setPy] = useState(50);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)");
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      x.set(xPct * 16); // max rotate 8deg
      y.set(yPct * -16); // max rotate -8deg

      setPx(((e.clientX - rect.left) / rect.width) * 100);
      setPy(((e.clientY - rect.top) / rect.height) * 100);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      setPx(50);
      setPy(50);
      setIsHovered(false);
    };

    const handleMouseEnter = () => setIsHovered(true);

    const el = cardRef.current;
    if (el) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      if (el) {
        window.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={gridVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.05 }}
      className="h-full"
    >
      <motion.div
        className="glass-container overflow-hidden group cursor-pointer flex flex-col h-full border border-slate-200 dark:border-white/10 relative"
        style={{
          rotateX: mouseYSpring,
          rotateY: mouseXSpring,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Specular Glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
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
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow" style={{ transform: "translateZ(40px)" }}>
          <span className="inline-block text-[11px] font-bold text-brand-primary dark:text-brand-aqua uppercase tracking-wider mb-2 transition-transform duration-300 group-hover:-translate-y-1">
            {project.category}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex-grow group-hover:text-brand-primary transition-colors whitespace-pre-line">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-auto transition-transform duration-300 group-hover:-translate-y-1">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 bg-brand-primary/10 dark:bg-brand-aqua/10 text-brand-primary dark:text-brand-aqua rounded-full font-medium uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [displayedCategory, setDisplayedCategory] = useState("Semua");
  const [isExiting, setIsExiting] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { ref: headerRef, isInView: headerVisible } = useScrollReveal();
  const { ref: gridRef, isInView: gridVisible } = useScrollReveal();

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
    credit: `BY LOGIA CREATIVE / ${p.category.toUpperCase()}`,
    meta: p.tags,
    accent: p.accent
  }));

  useEffect(() => {
    if (showAllProjects) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAllProjects(false);
    };

    if (showAllProjects) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showAllProjects]);

  return (
    <section id="portfolio" className="py-24 sm:py-32 relative w-full overflow-hidden">
      <div className="w-full mx-auto">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-16 px-4 heading-entrance ${headerVisible ? 'revealed' : ''}`}
        >
          <SplitWords as="h2" text="Selected Work" className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter text-slate-900 dark:text-white mb-6 uppercase" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "grad-cta shadow-md"
                  : "glass-container text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio List using HeroCarousel */}
        <div ref={gridRef} className={`w-full h-[100vh] min-h-[100vh] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          (gridVisible && !isExiting) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {carouselItems.length > 0 ? (
            <HeroCarousel
              items={carouselItems}
              defaultIndex={Math.floor(carouselItems.length / 2)}
              brand="PORTFOLIO"
            />
          ) : null}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16 px-4">
          <button
            onClick={() => setShowAllProjects(true)}
            className="w-16 h-16 rounded-full glass-container border border-brand-primary/30 text-brand-primary dark:text-brand-aqua font-semibold text-sm hover:bg-brand-primary hover:text-white transition-all shadow-sm hover:shadow-md flex items-center justify-center mx-auto group"
            aria-label="View All Projects"
          >
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* Overlay Semua Project */}
      <div
        className={`fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl transition-all duration-300 overflow-y-auto ${
          showAllProjects ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowAllProjects(false);
        }}
      >
        <div className={`min-h-screen py-16 px-6 transition-transform duration-300 ${showAllProjects ? 'scale-100' : 'scale-95'}`}>
          <div className="max-w-7xl mx-auto">
            {/* Header Sticky */}
            <div className="flex items-center justify-between mb-12 sticky top-0 z-10 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-2xl px-6 border border-slate-200 dark:border-white/10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter">
                Archive
              </h2>
              <button
                onClick={() => setShowAllProjects(false)}
                className="p-2 rounded-full glass-container hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-slate-900 dark:text-white" />
              </button>
            </div>

            {/* Filter Tabs overlay */}
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={`overlay-${category}`}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category
                      ? "grad-cta shadow-md"
                      : "glass-container text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {allProjects
                .filter((p) => activeCategory === "Semua" || p.category === activeCategory)
                .map((project, idx) => (
                <PortfolioCard key={`overlay-${project.title}`} project={project} gridVisible={showAllProjects} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}