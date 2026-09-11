"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";

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

const categories = ["Semua", "Branding", "Web Development", "UI/UX", "Marketing"];

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { ref: headerRef, isInView: headerVisible } = useScrollReveal();
  const { ref: gridRef, isInView: gridVisible } = useScrollReveal();

  const filteredProjects = projects.filter(
    (project) => activeCategory === "Semua" || project.category === activeCategory
  );

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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Karya Terbaik Kami
          </h2>
          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed mx-auto max-w-2xl">
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
                  : "glass-container text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]"
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
              <div
                key={project.title}
                className={`glass-container overflow-hidden group cursor-pointer flex flex-col h-full border border-foreground/10 dark:border-white/10 hover:border-brand-primary/30 transition-all duration-700 ease-out micro-lift ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative bg-foreground/5">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[11px] font-bold text-brand-primary dark:text-brand-aqua uppercase tracking-wider mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-foreground/75 mb-6 line-clamp-2 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map(tag => (
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
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 rounded-full glass-container border border-brand-primary/30 text-brand-primary dark:text-brand-aqua font-semibold text-sm hover:bg-brand-primary hover:text-white transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mx-auto group">
            <span>Lihat Semua Project</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}
