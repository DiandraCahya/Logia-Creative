"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onOpenCollaboration?: () => void;
}

/* ── 3D Interactive Floating Shape: mouse + gyroscope ── */
type OrientEvent = DeviceOrientationEvent & { requestPermission?: () => Promise<string> };

function InteractiveShape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const target = useRef({ rx: 0, ry: 0, px: 50, py: 50 });
  const current = useRef({ rx: 0, ry: 0, px: 50, py: 50 });
  const [gyroOn, setGyroOn] = useState(false);
  const [gyroNeeded, setGyroNeeded] = useState(false);
  const [gyroDenied, setGyroDenied] = useState(false);
  const hoverRef = useRef(false);
  const inViewRef = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = containerRef.current;
    if (!el) return;

    // Detect iOS permission API — needs user gesture
    const DOE = window.DeviceOrientationEvent as unknown as OrientEvent | undefined;
    if (typeof DOE?.requestPermission === "function") setGyroNeeded(true);

    let raf = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!inViewRef.current || document.hidden) return;
      const c = current.current;
      const t = target.current;
      // low-pass smoothing
      c.rx += (t.rx - c.rx) * 0.12;
      c.ry += (t.ry - c.ry) * 0.12;
      c.px += (t.px - c.px) * 0.15;
      c.py += (t.py - c.py) * 0.15;
      if (tiltRef.current)
        tiltRef.current.style.transform = `rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`;
      if (glareRef.current)
        glareRef.current.style.background = `radial-gradient(circle 200px at ${c.px.toFixed(1)}% ${c.py.toFixed(1)}%, rgba(192,192,192,0.15), transparent)`;
    };
    raf = requestAnimationFrame(render);

    const io = new IntersectionObserver(([e]) => {
      inViewRef.current = e.isIntersecting;
    });
    io.observe(el);

    const onMouse = (e: MouseEvent) => {
      if (!hoverRef.current || gyroOn) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      target.current = {
        rx: clamp(-y * 20, 15),
        ry: clamp(x * 20, 15),
        px: ((e.clientX - r.left) / r.width) * 100,
        py: ((e.clientY - r.top) / r.height) * 100,
      };
    };
    const onEnter = () => {
      hoverRef.current = true;
    };
    const onLeave = () => {
      hoverRef.current = false;
      if (!gyroOn) target.current = { rx: 0, ry: 0, px: 50, py: 50 };
    };
    // touch-drag fallback (pointer events, no sensor needed)
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || gyroOn) return;
      const dx = (e.clientX - lastX) / 120;
      const dy = (e.clientY - lastY) / 120;
      lastX = e.clientX;
      lastY = e.clientY;
      target.current = {
        rx: clamp(target.current.rx - dy * 8, 15),
        ry: clamp(target.current.ry + dx * 8, 15),
        px: 50,
        py: 50,
      };
    };
    const onUp = () => {
      dragging = false;
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      // beta: front-back tilt [-180,180], gamma: left-right [-90,90]
      target.current = {
        rx: clamp((e.beta - 45) * 0.4, 15),
        ry: clamp(e.gamma * 0.5, 15),
        px: 50 + clamp(e.gamma, 30),
        py: 50 + clamp(e.beta - 45, 30),
      };
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("deviceorientation", onOrient);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [gyroOn]);

  const enableGyro = useCallback(async () => {
    try {
      const DOE = window.DeviceOrientationEvent as unknown as OrientEvent;
      if (typeof DOE?.requestPermission === "function") {
        const res = await DOE.requestPermission();
        if (res !== "granted") {
          setGyroDenied(true);
          return;
        }
      }
      setGyroOn(true);
      setGyroNeeded(false);
    } catch {
      setGyroDenied(true);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] relative cursor-pointer touch-none"
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
              src="/chaewon.jpg"
              alt="Potret kreatif Logia Creative"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 420px"
              priority
              fetchPriority="high"
            />
          </div>
          <div
            ref={glareRef}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ transform: "translateZ(51px)" }}
          />
        </div>
      </div>
      {(gyroNeeded || gyroDenied) && !gyroOn && (
        <button
          onClick={enableGyro}
          className="min-h-[44px] px-5 py-2 rounded-full text-xs font-semibold border border-black/15 dark:border-white/15 text-black dark:text-white active:scale-95"
        >
          {gyroDenied ? "Sensor ditolak — ketuk untuk coba lagi" : "Aktifkan efek gerak"}
        </button>
      )}
    </div>
  );
}

/* ── Easing ── */
const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection({ onOpenCollaboration }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative min-h-[92svh] flex items-center justify-center overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-28"
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
