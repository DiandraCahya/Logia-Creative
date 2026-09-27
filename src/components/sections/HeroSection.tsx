"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onOpenCollaboration?: () => void;
}

/* ── 3D Interactive Floating Shape ── */
function InteractiveShape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || !isHovered) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setTransform({ rx: -y * 20, ry: x * 20, px, py });
      });
    },
    [isHovered]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)");
    if (mq.matches) return;

    const el = containerRef.current;
    if (!el) return;

    const onEnter = () => setIsHovered(true);
    const onLeave = () => {
      cancelAnimationFrame(rafRef.current);
      setTransform({ rx: 0, ry: 0, px: 50, py: 50 });
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] relative cursor-pointer"
      style={{ perspective: 1200 }}
    >
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${transform.rx}deg) rotateY(${transform.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10"
          style={{ transform: "translateZ(50px)" }}
        >
          <Image
            src="/chaewon.jpg"
            alt="Potret kreatif Logia Creative"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 420px"
            priority={false}
          />
        </div>

        {/* Specular highlight following cursor */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 200px at ${transform.px}% ${transform.py}%, rgba(192,192,192,${isHovered ? 0.15 : 0}), transparent)`,
            transform: "translateZ(51px)",
          }}
        />
      </div>
    </div>
  );
}

/* ── Easing ── */
const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection({ onOpenCollaboration }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left: Typography & CTA */}
          <div className="flex flex-col items-start space-y-8">
            {/* Overline */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#666666] dark:text-[#999999]"
            >
              Creative & Technology Agency
            </motion.span>

            {/* Headline — max 7 words */}
            <h1 className="font-display font-medium text-[clamp(2.5rem,8vw,5rem)] leading-[1.05] tracking-[-0.02em] text-black dark:text-white">
              <span className="overflow-hidden block pb-1">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.1 }}
                  className="block"
                >
                  Craft Your
                </motion.span>
              </span>
              <span className="overflow-hidden block pb-1">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.2 }}
                  className="block text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #C0C0C0 0%, #808080 50%, #C0C0C0 100%)",
                  }}
                >
                  Brand Identity.
                </motion.span>
              </span>
            </h1>

            {/* Subheadline — 2 kalimat pendek */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.35 }}
              className="text-base sm:text-lg text-[#1A1A1A] dark:text-[#999999] leading-relaxed max-w-lg font-normal"
            >
              Kami merancang identitas visual dan membangun website cepat
              untuk bisnis yang ingin terlihat serius.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={onOpenCollaboration}
                className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black text-sm font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 flex items-center gap-2 group"
              >
                <span>Mulai Proyek</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#portfolio"
                className="px-8 py-4 text-sm font-semibold text-black dark:text-white border border-black/15 dark:border-white/15 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
              >
                Lihat Portfolio
              </a>
            </motion.div>
          </div>

          {/* Right: 3D Interactive Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <InteractiveShape />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
