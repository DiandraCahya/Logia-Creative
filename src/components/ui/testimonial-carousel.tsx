"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  const [dragX, setDragX] = useState(0);
  const [compact, setCompact] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; dragging: boolean }>({ startX: 0, dragging: false });

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mq = window.matchMedia("(max-width: 639px)");
    setCompact(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCompact(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || reducedMotion || testimonials.length <= 1 || document.hidden) return;
    const t = setTimeout(() => setIndex((i) => go(i + 1, testimonials.length)), 5000);
    return () => clearTimeout(t);
  }, [inView, index, paused, reducedMotion, testimonials.length]);

  const prev = useCallback(() => setIndex((i) => go(i - 1, testimonials.length)), [testimonials.length]);
  const next = useCallback(() => setIndex((i) => go(i + 1, testimonials.length)), [testimonials.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "Home") setIndex(0);
    else if (e.key === "End") setIndex(testimonials.length - 1);
  };

  // ── Swipe: pointer events, threshold 60px ──
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, dragging: true };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    setDragX(e.clientX - dragRef.current.startX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.dragging = false;
    setDragX(0);
    if (dx < -60) next();
    else if (dx > 60) prev();
  };

  // Geser 100% = lebar carousel (bukan 100vw), jadi selisih antar lebar tidak
  // menumpuk dan semua slide duduk pas di viewport.
  const trackTransform = `translateX(calc(-${index} * 100% + ${dragX}px))`;

  // Panel mobile (< 640px): fokus ke kutipan besar, bukan gambar.
  // Avatar kecil + role di atas, kutipan display di tengah, kontrol di bawah.
  if (compact) {
    return (
      <div
        ref={containerRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Testimoni klien"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="w-full"
      >
        <div
          className="overflow-hidden touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="flex transition-transform duration-500"
            style={{ transform: trackTransform }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-full flex-none px-1"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} dari ${testimonials.length}`}
                aria-hidden={i !== index}
              >
                <figure className="glass-card flex flex-col gap-4 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
                  {/* Baris identitas: avatar kecil + nama */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={t.image}
                      alt={t.alt}
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[var(--accent-bronze)]"
                    />
                    <div className="min-w-0">
                      <span className="block text-[13px] font-semibold text-black dark:text-white">
                        {t.author}
                      </span>
                    </div>
                  </div>

                  {/* Kutipan besar, display font */}
                  <blockquote className="font-display font-bold text-[clamp(20px,6vw,26px)] leading-[1.2] tracking-[-0.02em] text-black dark:text-white">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </figure>
              </div>
            ))}
          </div>
        </div>

        {/* Kontrol: titik + panah, dalam jangkauan jempol */}
        <div className="mt-2 flex items-center justify-between pr-1 max-[400px]:pr-2 max-[340px]:pr-3">
          <div className="flex items-center gap-1" role="group" aria-label="Pilih testimoni">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ke testimoni ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="flex h-10 min-w-5 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-[width,background-color] duration-300 ${
                    i === index ? "h-1.5 w-5 bg-[var(--accent-bronze)]" : "h-1.5 w-1.5 bg-black/20 dark:bg-white/35"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label="Testimoni sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-black transition-colors active:scale-95 disabled:opacity-30 dark:border-white/20 dark:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index === testimonials.length - 1}
              aria-label="Testimoni berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-black transition-colors active:scale-95 disabled:opacity-30 dark:border-white/20 dark:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Panel desktop: kartu avatar + kutipan, kontrol tersembunyi di mobile
  return (
    <div
      ref={containerRef}
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
      <div
        className="overflow-hidden touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex transition-transform duration-500"
          style={{ transform: trackTransform }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              // w-full + flex-none = pas selebar viewport (tanpa px di sini;
              // padding ada di figure, jadi geser 100% tidak tergeser selisih).
              className="w-full flex-none flex items-center justify-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} dari ${testimonials.length}`}
              aria-hidden={i !== index}
            >
              <figure
                className="glass-card w-full max-w-[420px] sm:max-w-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 sm:rounded-3xl p-4 sm:p-6 sm:min-h-[220px]"
              >
                <Image
                  src={t.image}
                  alt={t.alt}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover ring-2 ring-[var(--accent-bronze)]"
                />
                <div className="min-w-0 flex-1">
                  <blockquote className="font-display font-bold text-[17px] sm:text-2xl leading-[1.35] sm:leading-[1.25] tracking-[-0.02em] text-black dark:text-white">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] sm:text-sm text-[#666666] dark:text-[#999999]">
                    <span className="font-semibold text-black dark:text-white">{t.author}</span>
                    {t.role ? (
                      <>
                        <span aria-hidden="true">&middot;</span>
                        <span>{t.role}</span>
                      </>
                    ) : null}
                  </figcaption>
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-8 flex items-center justify-center gap-1 sm:gap-3">
        {/* Di layar sempit, panah disembunyikan: swipe + titik sudah cukup.
            Panah 44px × 2 + titik 44px × 6 + gap melebihi lebar 320–390px. */}
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          disabled={index === 0}
          className="hidden sm:flex p-1.5 sm:p-2 rounded-full border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-1 sm:gap-2" role="group" aria-label="Pilih testimoni">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="min-h-[44px] min-w-[36px] sm:min-w-[44px] flex items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                    i === index
                      ? "h-2 w-6 bg-[var(--accent-bronze)]"
                      : "h-2 w-2 bg-black/15 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/40"
                  }`}
              />
            </button>
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next testimonial"
          disabled={index === testimonials.length - 1}
          className="hidden sm:flex p-1.5 sm:p-2 rounded-full border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
