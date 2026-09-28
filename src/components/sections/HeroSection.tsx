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
  const [gyroStatus, setGyroStatus] = useState<"idle" | "aktif" | "tidak ada sensor" | "error">("idle");
  const hoverRef = useRef(false);
  const inViewRef = useRef(true);
  const gyroOnRef = useRef(false);

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
      // low-pass smoothing: smoothed = smoothed * 0.9 + raw * 0.1
      c.rx += (t.rx - c.rx) * 0.1;
      c.ry += (t.ry - c.ry) * 0.1;
      c.px += (t.px - c.px) * 0.15;
      c.py += (t.py - c.py) * 0.15;
      if (tiltRef.current)
        tiltRef.current.style.transform = `perspective(1000px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`;
      if (glareRef.current)
        glareRef.current.style.background = `radial-gradient(circle 200px at ${c.px.toFixed(1)}% ${c.py.toFixed(1)}%, rgba(192,192,192,0.15), transparent)`;
    };
    raf = requestAnimationFrame(render);

    const io = new IntersectionObserver(([e]) => {
      inViewRef.current = e.isIntersecting;
    });
    io.observe(el);

    const onMouse = (e: MouseEvent) => {
      if (!hoverRef.current || gyroOnRef.current) return;
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
      if (!gyroOnRef.current) target.current = { rx: 0, ry: 0, px: 50, py: 50 };
    };
    // touch-drag fallback (pointer events, no sensor needed)
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || gyroOnRef.current) return;
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
      if (process.env.NODE_ENV === "development")
        console.log("[gyro] beta:", e.beta?.toFixed(1), "gamma:", e.gamma?.toFixed(1));
      // beta: front-back tilt [-180,180], gamma: left-right [-90,90]
      // clamp beta/gamma ke -45..45 sebelum mapping
      const beta = clamp(e.beta - 45, 45);
      const gamma = clamp(e.gamma, 45);
      target.current = {
        rx: clamp(beta * 0.4, 15),
        ry: clamp(gamma * 0.5, 15),
        px: 50 + clamp(gamma, 30),
        py: 50 + clamp(beta, 30),
      };
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("deviceorientation", onOrient);

    // Sensor mati = tidak ada event masuk dalam 3 detik setelah granted
    let orientSeen = false;
    const markSeen = () => { orientSeen = true; };
    window.addEventListener("deviceorientation", markSeen, { once: true });
    const noSensorTimer = window.setTimeout(() => {
      if (gyroOnRef.current && !orientSeen) setGyroStatus("tidak ada sensor");
    }, 3000);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.clearTimeout(noSensorTimer);
      window.removeEventListener("mousemove", onMouse);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("deviceorientation", markSeen);
    };
  }, []);

  // requestPermission() dipanggil LANGSUNG dari handler tap, bukan dari promise chain terpisah
  const enableGyro = useCallback(async () => {
    try {
      const DOE = window.DeviceOrientationEvent as unknown as OrientEvent | undefined;
      if (
        typeof window.DeviceOrientationEvent !== "undefined" &&
        typeof DOE?.requestPermission === "function"
      ) {
        const permission = await DOE.requestPermission();
        if (permission === "granted") {
          gyroOnRef.current = true;
          setGyroOn(true);
          setGyroNeeded(false);
          setGyroStatus("aktif");
        } else {
          setGyroDenied(true);
          setGyroStatus("error");
        }
      } else {
        // Android / desktop fallback: langsung pasang listener, tanpa tombol izin
        gyroOnRef.current = true;
        setGyroOn(true);
        setGyroNeeded(false);
        setGyroStatus("aktif");
      }
    } catch (err) {
      console.error("Gyro permission error:", err);
      setGyroDenied(true);
      setGyroStatus("error");
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        className="w-28 h-28 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] relative cursor-pointer touch-pan-y"
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
      {(gyroNeeded || gyroDenied) && !gyroOn ? (
        <button
          id="gyro-btn"
          type="button"
          onClick={enableGyro}
          className="min-h-[48px] min-w-[48px] px-6 py-3 rounded-full text-xs font-semibold border border-black/15 dark:border-white/15 text-black dark:text-white active:scale-95"
        >
          {gyroDenied ? "Sensor ditolak, ketuk untuk coba lagi" : "Aktifkan efek gerak"}
        </button>
      ) : (
        <p
          aria-live="polite"
          className="text-[11px] font-normal text-[#666666] dark:text-[#999999]"
        >
          Gyro: {gyroOn ? gyroStatus : "nonaktif, geser foto untuk efek gerak"}
        </p>
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
        <div className="grid grid-cols-[minmax(0,1.15fr)_auto] lg:grid-cols-2 gap-4 lg:gap-8 items-center">
          {/* Left: Typography & CTA */}
          <div className="flex flex-col items-start space-y-4 lg:space-y-8 min-w-0">
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
                  className="block text-black dark:text-white"
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
              className="text-sm sm:text-lg text-[#1A1A1A] dark:text-[#999999] leading-relaxed max-w-lg font-normal line-clamp-2 sm:line-clamp-none"
            >
              Kami merancang identitas visual dan membangun website cepat
              untuk bisnis yang ingin terlihat serius.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              <button
                onClick={onOpenCollaboration}
                style={{ color: "var(--btn-text)" }}
                className="btn-solid px-5 sm:px-8 py-3 sm:py-4 min-h-[48px] bg-black dark:bg-white text-sm font-semibold rounded-full flex items-center gap-2 group"
              >
                <span>Mulai Proyek</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#portfolio"
                className="px-5 sm:px-8 py-3 sm:py-4 min-h-[48px] inline-flex items-center text-sm font-semibold text-black dark:text-white border border-black/15 dark:border-white/15 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
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
