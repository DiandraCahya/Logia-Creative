"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onOpenCollaboration?: () => void;
}

/* ── 3D Interactive Floating Shape: mouse-follow ── */
function InteractiveShape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const target = useRef({ rx: 0, ry: 0, px: 50, py: 50 });
  const current = useRef({ rx: 0, ry: 0, px: 50, py: 50 });
  const hoverRef = useRef(false);
  const inViewRef = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // ponytail: interaksi tilt hanya berguna dengan mouse; di layar sempit
    // (mobile) rAF + repaint berjalan sia-sia → skip loop total.
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    let isRunning = false;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const render = () => {
      if (!inViewRef.current || document.hidden || document.documentElement.dataset.overlay) {
        isRunning = false;
        return;
      }
      const c = current.current;
      const t = target.current;
      const drx = t.rx - c.rx;
      const dry = t.ry - c.ry;
      const dpx = t.px - c.px;
      const dpy = t.py - c.py;

      c.rx += drx * 0.1;
      c.ry += dry * 0.1;
      c.px += dpx * 0.15;
      c.py += dpy * 0.15;

      if (tiltRef.current)
        tiltRef.current.style.transform = `perspective(1000px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`;
      if (glareRef.current)
        glareRef.current.style.background = `radial-gradient(circle 200px at ${c.px.toFixed(1)}% ${c.py.toFixed(1)}%, rgba(192,192,192,0.15), transparent)`;

      // Idle sleep: pause RAF loop when interpolation has settled
      if (Math.abs(drx) < 0.01 && Math.abs(dry) < 0.01 && Math.abs(dpx) < 0.05 && Math.abs(dpy) < 0.05) {
        isRunning = false;
        return;
      }

      raf = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      raf = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(([e]) => {
      inViewRef.current = e.isIntersecting;
      if (inViewRef.current && (hoverRef.current || Math.abs(target.current.rx - current.current.rx) > 0.01)) {
        startLoop();
      }
    });
    io.observe(el);

    const onMouse = (e: MouseEvent) => {
      if (!hoverRef.current) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      target.current = {
        rx: clamp(-y * 20, 15),
        ry: clamp(x * 20, 15),
        px: ((e.clientX - r.left) / r.width) * 100,
        py: ((e.clientY - r.top) / r.height) * 100,
      };
      startLoop();
    };
    const onEnter = () => {
      hoverRef.current = true;
      startLoop();
    };
    const onLeave = () => {
      hoverRef.current = false;
      target.current = { rx: 0, ry: 0, px: 50, py: 50 };
      startLoop();
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      isRunning = false;
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        className="w-36 h-36 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] relative"
        style={{ perspective: 1200 }}
      >
        <div
          ref={tiltRef}
          className="w-full h-full relative will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10"
            style={{ transform: "translateZ(50px)" }}
          >
            <Image
              src="/LUOGIA2.webp"
              alt="Potret kreator Logia Creative"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 144px, (max-width: 1024px) 320px, 420px"
              quality={85}
              priority
              fetchPriority="high"
              unoptimized
            />
          </div>
          <div
            ref={glareRef}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ transform: "translateZ(51px)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Hero reveal via keyframe CSS (globals.css), bukan framer ── */

export function HeroSection({ onOpenCollaboration }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative bg-transparent min-h-[100dvh] sm:min-h-[92svh] flex items-center justify-center overflow-hidden pt-20 pb-8 sm:pt-32 sm:pb-28"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-2 lg:grid-cols-2 items-center gap-x-3 gap-y-5 sm:gap-4 lg:gap-8">
          {/* Left: Typography & CTA */}
          <div className="col-start-1 row-start-1 min-w-0 flex flex-col items-start justify-center gap-6 sm:gap-4 lg:gap-8">

            {/* Headline — max 7 words, reveal via CSS keyframe */}
            <h1 className="w-full font-display font-medium text-[clamp(2.25rem,11vw,3.5rem)] sm:text-[clamp(2rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em] text-black dark:text-white min-w-0">
              <span className="overflow-hidden block pb-1">
                <span className="block animate-[hero-line_0.5s_0.05s_both]">
                  Craft Your
                </span>
              </span>
              <span className="overflow-hidden block pb-1">
                <span className="block text-black dark:text-white animate-[hero-line_0.5s_0.1s_both]">
                  Brand Identity.
                </span>
              </span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-nowrap items-center gap-3 sm:gap-4 w-full sm:w-auto animate-[hero-fade_0.5s_0.2s_both]">
              <button
                onClick={onOpenCollaboration}
                className="btn-solid flex-1 sm:flex-none justify-center whitespace-nowrap px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full flex items-center gap-2 group transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Mulai Proyek</span>
                <ArrowRight className="w-4 h-4 text-white dark:text-black transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#portfolio"
                className="flex-1 sm:flex-none justify-center whitespace-nowrap px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] inline-flex items-center text-sm font-semibold text-black dark:text-white border border-black/15 dark:border-white/15 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
              >
                Lihat Portfolio
              </a>
            </div>
          </div>

          {/* Right: 3D Interactive Element */}
          <div className="col-start-2 row-start-1 sm:col-auto sm:row-auto shrink-0 flex items-center justify-center">
            <InteractiveShape />
          </div>
        </div>
      </div>
    </section>
  );
}
