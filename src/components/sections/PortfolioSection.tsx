"use client";

import React, { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import { ArrowRight, Layers, X } from "lucide-react";

const projects = [
  {
    title: "Revitalisasi Identitas Nusantara",
    category: "Branding",
    image: "/asetbg1.png",
    description: "Mendesain ulang identitas visual brand lokal untuk menembus pasar internasional tanpa menghilangkan akar budaya.",
    tags: ["Logo Design", "Identity", "Brand Book"],
  },
  {
    title: "Platform Edukasi Kreatif",
    category: "Web Development",
    image: "/asetbg2.png",
    description: "Pengembangan platform e-learning responsif dan interaktif menggunakan ekosistem Next.js modern.",
    tags: ["Next.js", "Tailwind CSS", "UI/UX"],
  },
  {
    title: "Aplikasi Manajemen Bisnis",
    category: "UI/UX",
    image: "/asetbg1.png",
    description: "Antarmuka intuitif untuk SaaS B2B, mempercepat proses onboarding pengguna baru hingga 40%.",
    tags: ["Figma", "Prototyping", "User Research"],
  },
  {
    title: "Kampanye Musim Semi",
    category: "Marketing",
    image: "/asetbg2.png",
    description: "Materi kampanye digital menyeluruh untuk peluncuran produk kosmetik dengan tingkat konversi tinggi.",
    tags: ["Meta Ads", "Social Media", "Creative"],
  },
  {
    title: "E-Commerce Artisan",
    category: "Web Development",
    image: "/asetbg1.png",
    description: "Toko online untuk pengrajin lokal dengan pengalaman belanja yang mulus dan cepat.",
    tags: ["React", "API Integration", "E-Commerce"],
  },
  {
    title: "Rebranding Kafe Urban",
    category: "Branding",
    image: "/asetbg2.png",
    description: "Penyegaran visual kafe kopi urban mulai dari logo, kemasan, hingga desain menu digital.",
    tags: ["Packaging", "Visual Design", "Typography"],
  },
];

const allProjects = [
  ...projects,
  {
    title: "Aplikasi Finance Track",
    category: "UI/UX",
    image: "/asetbg1.png",
    description: "Dashboard analitik keuangan untuk startup dengan tampilan dark mode premium.",
    tags: ["Figma", "Dashboard", "Fintech"],
  },
  {
    title: "Video Profile Korporat",
    category: "Marketing",
    image: "/asetbg2.png",
    description: "Produksi video profil perusahaan energi terbarukan untuk investor asing.",
    tags: ["Motion", "Premiere", "Storyboarding"],
  },
  {
    title: "Aplikasi Booking Klinik",
    category: "Web Development",
    image: "/asetbg1.png",
    description: "Sistem reservasi online rumah sakit dengan sinkronisasi jadwal real-time.",
    tags: ["Next.js", "PostgreSQL", "Tailwind CSS"],
  }
];

const categories = ["Semua", "Branding", "Web Development", "UI/UX", "Marketing"];

function PortfolioCard({ project, gridVisible, idx }: { project: any, gridVisible: boolean, idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)");
    if (mediaQuery.matches) return;

    let requestId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;

      cancelAnimationFrame(requestId);
      requestId = requestAnimationFrame(() => {
        setTransform({ rx: -y * 8, ry: x * 8, px, py });
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(requestId);
      setTransform({ rx: 0, ry: 0, px: 50, py: 50 });
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
      cancelAnimationFrame(requestId);
    };
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      style={{ perspective: 1000 }}
      className={`h-full transition-all duration-700 ease-out will-change-transform ${
        gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div
        className="glass-container overflow-hidden group cursor-pointer flex flex-col h-full border border-slate-200 dark:border-white/10 transition-transform duration-200 ease-out relative"
        style={{
          transform: `rotateX(${transform.rx}deg) rotateY(${transform.ry}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transitionDelay: gridVisible ? `${idx * 150}ms` : '0ms'
        }}
      >
        {/* Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle 300px at ${transform.px}% ${transform.py}%, rgba(255,255,255,0.4), transparent)`,
            opacity: isHovered ? 1 : 0
          }}
        />

        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative bg-slate-100 dark:bg-white/5 transform-gpu" style={{ transform: "translateZ(20px)" }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow transform-gpu" style={{ transform: "translateZ(40px)" }}>
          <span className="inline-block text-[11px] font-bold text-brand-primary dark:text-brand-aqua uppercase tracking-wider mb-2 transition-transform duration-300 group-hover:-translate-y-1">
            {project.category}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-2 flex-grow">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto transition-transform duration-300 group-hover:-translate-y-1">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 bg-brand-primary/10 dark:bg-brand-aqua/10 text-brand-primary dark:text-brand-aqua rounded-full font-medium"
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

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { ref: headerRef, isInView: headerVisible } = useScrollReveal();
  const { ref: gridRef, isInView: gridVisible } = useScrollReveal();

  const filteredProjects = projects.filter(
    (project) => activeCategory === "Semua" || project.category === activeCategory
  );

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
    <section id="portfolio" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto space-y-4 mb-16 heading-entrance ${headerVisible ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-container border border-brand-primary/20 text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-brand-aqua">
            <Layers className="w-3.5 h-3.5" />
            Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Karya Terbaik Kami
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mx-auto max-w-2xl">
            Beberapa project pilihan yang menunjukkan kualitas kerja dan dedikasi kami dalam menghadirkan solusi kreatif dan teknologi.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-brand-primary to-brand-aqua text-white shadow-md shadow-brand-primary/20"
                  : "glass-container text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div ref={gridRef} className="min-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project, idx) => (
              <PortfolioCard key={project.title} project={project} gridVisible={gridVisible} idx={idx} />
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => setShowAllProjects(true)}
            className="px-8 py-4 rounded-full glass-container border border-brand-primary/30 text-brand-primary dark:text-brand-aqua font-semibold text-sm hover:bg-brand-primary hover:text-white transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mx-auto group"
          >
            <span>Lihat Semua Project</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Semua Project
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
                      ? "bg-gradient-to-r from-brand-primary to-brand-aqua text-white shadow-md"
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
