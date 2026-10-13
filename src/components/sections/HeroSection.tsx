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
  const [gyroStatus, setGyroStatus] = useState<"idle" | "aktif" | "tidak ada sensor" | "butuh https">("idle");
  const [platform, setPlatform] = useState<"desktop" | "android" | "ios">("desktop");
  const [debug, setDebug] = useState(false);
  const [secureCtx, setSecureCtx] = useState(true);
  const [debugVals, setDebugVals] = useState({ beta: "-", gamma: "-", abs: "-", count: 0 });
  const debugRef = useRef(false);
  const hoverRef = useRef(false);
  const inViewRef = useRef(true);
  const gyroOnRef = useRef(false);
  const orientCount = useRef(0);
  const orientLiveRef = useRef(false); // true hanya jika sensor kirim nilai nyata
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
    // Debug: ?gyro=debug untuk logging nilai sensor di HP asli
    const dbg = new URLSearchParams(window.location.search).has("gyro");
    debugRef.current = dbg;
    setDebug(dbg);

    // Sensor API butuh secure context (HTTPS/localhost). HTTP = sensor diblokir browser.
    const secure = window.isSecureContext;
    setSecureCtx(secure);
    if (!secure && pf !== "desktop") setGyroStatus("butuh https");

    // Android: gyro otomatis aktif saat load (tidak butuh permission).
    // Listener tetap di-attach untuk SEMUA platform — jangan tunggu tombol izin.
    if (pf === "android" && secure) {
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
      if (!dragging || platformRef.current === "desktop" || (gyroOnRef.current && orientLiveRef.current)) return;
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
    // Listener absolut: catat event APA PUN agar tahu sensor fire atau tidak,
    // bahkan sebelum izin / sebelum gyroOn (Android 13+ kirim null dulu).
    // Throttle: state hanya di-update saat ?gyro=debug aktif, bukan tiap event.
    let lastDbg = 0;
    const onOrientRaw = (e: DeviceOrientationEvent) => {
      orientCount.current += 1;
      if (e.beta != null || e.gamma != null) orientLiveRef.current = true;
      const now = performance.now();
      if (debugRef.current && now - lastDbg > 500) {
        lastDbg = now;
        setDebugVals({ beta: String(e.beta), gamma: String(e.gamma), abs: String(e.absolute), count: orientCount.current });
      }
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      // Hanya proses saat gyro aktif (Android auto / setelah izin)
      if (!gyroOnRef.current || e.beta == null || e.gamma == null) return;
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

    // Listener deviceorientation di-attach SELALU (semua platform, tanpa nunggu izin).
    // Cabang iOS requestPermission hanya mengaktifkan flag gyroOn, bukan attach listener.
    window.addEventListener("mousemove", onMouse, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("deviceorientation", onOrientRaw);
    window.addEventListener("deviceorientation", onOrient);
    window.addEventListener("deviceorientationabsolute", onOrientRaw as EventListener);
    window.addEventListener("deviceorientationabsolute", onOrient as EventListener);

    // Sensor mati = tidak ada event masuk dalam 3 detik setelah granted
    const noSensorTimer = window.setTimeout(() => {
      if (gyroOnRef.current && orientCount.current === 0) setGyroStatus("tidak ada sensor");
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
      window.removeEventListener("deviceorientation", onOrientRaw);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("deviceorientationabsolute", onOrientRaw as EventListener);
      window.removeEventListener("deviceorientationabsolute", onOrient as EventListener);
    };
  }, []);

  // Mobile: Android auto-on + tap fallback; iOS butuh requestPermission via gesture
  const enableGyro = useCallback(async () => {
    if (!window.isSecureContext) { setGyroStatus("butuh https"); return; }
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
    <div className="flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        className="w-36 h-36 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] relative cursor-pointer touch-pan-y"
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
              sizes="(max-width: 640px) 144px, (max-width: 1024px) 320px, 420px"
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
          {gyroStatus === "aktif"
            ? "Efek gerak aktif, miringkan perangkat"
            : gyroStatus === "butuh https"
              ? "Sensor butuh HTTPS, buka lewat https atau localhost"
              : "Sensor gerak tidak tersedia, geser foto untuk efek 3D"}
        </p>
      ) : null}
      {debug && platform !== "desktop" ? (
        <p className="font-mono text-[10px] text-black/60 dark:text-white/60" aria-hidden="true">
          [gyro-debug] beta: {debugVals.beta} gamma: {debugVals.gamma} abs: {debugVals.abs} n: {debugVals.count} {secureCtx ? "https" : "http"}
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
      className="relative bg-transparent min-h-[100dvh] sm:min-h-[92svh] flex items-center justify-center overflow-hidden pt-20 pb-8 sm:pt-32 sm:pb-28"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-2 lg:grid-cols-2 items-center gap-x-3 gap-y-5 sm:gap-4 lg:gap-8">
          {/* Left: Typography & CTA */}
          <div className="col-start-1 row-start-1 min-w-0 flex flex-col items-start justify-center gap-6 sm:gap-4 lg:gap-8">

            {/* Headline — max 7 words */}
            <h1 className="w-full font-display font-medium text-[clamp(2.25rem,11vw,3.5rem)] sm:text-[clamp(2rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em] text-black dark:text-white min-w-0">
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

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
              className="flex flex-nowrap items-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
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
            </motion.div>
          </div>

          {/* Right: 3D Interactive Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.3 }}
            className="col-start-2 row-start-1 sm:col-auto sm:row-auto shrink-0 flex items-center justify-center"
          >
            <InteractiveShape />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
