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
  const [gyroStatus, setGyroStatus] = useState<"idle" | "aktif" | "tidak ada sensor">("idle");
  const [platform, setPlatform] = useState<"desktop" | "android" | "ios">("desktop");
  const hoverRef = useRef(false);
  const inViewRef = useRef(true);
  const gyroOnRef = useRef(false);
  const platformRef = useRef<"desktop" | "android" | "ios">("desktop");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = containerRef.current;
    if (!el) return;

    // Platform detection: iOS (ada requestPermission) vs Android (auto) vs desktop (mouse)
    const DOE = window.DeviceOrientationEvent as unknown as OrientEvent | undefined;
    const isIOS = typeof DOE?.requestPermission === "function";
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    const pf: "desktop" | "android" | "ios" = isIOS ? "ios" : isTouch ? "android" : "desktop";
    platformRef.current = pf;
    setPlatform(pf);

    // Android: gyro otomatis aktif saat load (tidak butuh permission)
    if (pf === "android") {
      gyroOnRef.current = true;
      setGyroOn(true);
      setGyroStatus("aktif");
    }

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
      // Desktop: mouse follow SELALU aktif, tidak pernah diganggu gyro
      if (platformRef.current !== "desktop" && gyroOnRef.current) return;
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
    };
    const onEnter = () => {
      hoverRef.current = true;
    };
    const onLeave = () => {
      hoverRef.current = false;
      // Desktop selalu reset ke tengah saat keluar; mobile hanya jika gyro mati
      if (platformRef.current === "desktop" || !gyroOnRef.current)
        target.current = { rx: 0, ry: 0, px: 50, py: 50 };
    };
    // touch-drag fallback (pointer events, no sensor needed)
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      // Drag fallback hanya untuk mobile (iOS tanpa gyro / Android sensor mati)
      if (!dragging || platformRef.current === "desktop" || gyroOnRef.current) return;
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
      // Hanya proses saat gyro aktif (Android auto / setelah izin)
      if (!gyroOnRef.current || e.beta == null || e.gamma == null) return;
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

  // Mobile: Android auto-on + tap fallback; iOS butuh requestPermission via gesture
  const enableGyro = useCallback(async () => {
    try {
      const DOE = window.DeviceOrientationEvent as unknown as OrientEvent | undefined;
      if (typeof DOE?.requestPermission === "function") {
        const res = await DOE.requestPermission();
        if (res !== "granted") { setGyroStatus("tidak ada sensor"); return; }
      }
    } catch { setGyroStatus("tidak ada sensor"); return; }
    gyroOnRef.current = true;
    setGyroOn(true);
    setGyroStatus("aktif");
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        className="w-32 h-32 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] relative cursor-pointer touch-pan-y"
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
      {(platform === "ios" || platform === "android") && !gyroOn ? (
        <button
          id="gyro-btn"
          type="button"
          onClick={enableGyro}
          className="min-h-[48px] min-w-[48px] px-6 py-3 rounded-full text-xs font-semibold border border-black/15 dark:border-white/15 text-black dark:text-white active:scale-95"
        >
          Aktifkan efek gerak
        </button>
      ) : (platform === "ios" || platform === "android") && gyroStatus !== "idle" ? (
        <p className="text-[11px] font-normal text-[#666666] dark:text-[#999999]" aria-live="polite">
          {gyroStatus === "aktif" ? "Efek gerak aktif — miringkan perangkat" : "Sensor gerak tidak tersedia — geser foto untuk efek 3D"}
        </p>
      ) : null}
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
        <div className="flex flex-row items-center lg:grid lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Left: Typography & CTA */}
          <div className="flex-1 min-w-0 flex flex-col items-start space-y-4 lg:space-y-8">
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
            className="shrink-0 flex items-center justify-center"
          >
            <InteractiveShape />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
