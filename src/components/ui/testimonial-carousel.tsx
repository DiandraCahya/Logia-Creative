"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Testimonial {
  quote: string;
  author?: string;
  role?: string;
  image: string;
  alt: string;
}

function go(index: number, length: number): number {
  return ((index % length) + length) % length;
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || testimonials.length <= 1) return;
    const t = setTimeout(() => setIndex((i) => go(i + 1, testimonials.length)), 5000);
    return () => clearTimeout(t);
  }, [index, paused, reducedMotion, testimonials.length]);

  const prev = useCallback(() => setIndex((i) => go(i - 1, testimonials.length)), [testimonials.length]);
  const next = useCallback(() => setIndex((i) => go(i + 1, testimonials.length)), [testimonials.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "Home") setIndex(0);
    else if (e.key === "End") setIndex(testimonials.length - 1);
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Testimoni klien"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) next();
            else if (info.offset.x > 50) prev();
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-full px-2"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} dari ${testimonials.length}`}
              aria-hidden={i !== index}
            >
              <figure className="mx-auto max-w-2xl rounded-2xl sm:rounded-3xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 sm:p-10 text-center">
                <Image
                  src={t.image}
                  alt={t.alt}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="mx-auto mb-4 h-10 w-10 sm:h-16 sm:w-16 rounded-full object-cover"
                />
                <blockquote className="font-display text-[13px] sm:text-xl leading-relaxed text-black dark:text-white line-clamp-3">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-[13px] sm:text-sm text-[#666666] dark:text-[#999999]">
                  {t.author ? (
                    <span className="font-semibold text-black dark:text-white">{t.author}</span>
                  ) : null}
                  {t.author && t.role ? " — " : ""}
                  {t.role}
                </figcaption>
              </figure>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-4 sm:mt-8 flex items-center justify-center gap-3">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="p-2 rounded-full border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2" role="group" aria-label="Pilih testimoni">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-[var(--accent-bronze)]"
                  : "w-2 bg-black/15 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="p-2 rounded-full border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
