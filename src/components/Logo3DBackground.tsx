"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePerformanceTier } from "@/lib/usePerformanceTier";

export function Logo3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktopOrTablet, setIsDesktopOrTablet] = useState(false);

  // Parallax spring state (Desktop & iPad)
  const animState = useRef({
    targetNormX: 0,
    targetNormY: 0,
    currX: -50,
    currY: -50,
    currRotX: 0,
    currRotY: 0,
    currRotZ: 0,
    isRunning: false,
    inView: true,
    pageVisible: true,
    rafId: 0,
  });

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mqMotion.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mqMotion.addEventListener("change", motionHandler);

    const mqScreen = window.matchMedia("(min-width: 768px)");
    setIsDesktopOrTablet(mqScreen.matches);
    const screenHandler = (e: MediaQueryListEvent) => setIsDesktopOrTablet(e.matches);
    mqScreen.addEventListener("change", screenHandler);

    return () => {
      mqMotion.removeEventListener("change", motionHandler);
      mqScreen.removeEventListener("change", screenHandler);
    };
  }, []);

  useEffect(() => {
    // Only run on desktop and iPad (>= 768px) for efficiency and zero overhead on mobile
    if (typeof document !== "undefined" && document.documentElement.classList.contains("is-audit")) return;
    if (!isDesktopOrTablet || reducedMotion || tier === "low") return;

    const el = containerRef.current;
    if (!el) return;

    const state = animState.current;

    const updateTransform = () => {
      if (!state.inView || !state.pageVisible || document.documentElement.dataset.overlay) {
        state.isRunning = false;
        return;
      }

      // Map normX/Y [-1, 1] to target transform values
      const targetX = -50 + state.targetNormX * 15; // [-65%, -35%]
      const targetY = -50 + state.targetNormY * 15; // [-65%, -35%]
      const targetRotX = state.targetNormY * -30;   // [30deg, -30deg]
      const targetRotY = state.targetNormX * 30;    // [-30deg, 30deg]
      const targetRotZ = state.targetNormX * 8;     // [-8deg, 8deg]

      // Butter-smooth spring interpolation
      const lerp = 0.07;
      state.currX += (targetX - state.currX) * lerp;
      state.currY += (targetY - state.currY) * lerp;
      state.currRotX += (targetRotX - state.currRotX) * lerp;
      state.currRotY += (targetRotY - state.currRotY) * lerp;
      state.currRotZ += (targetRotZ - state.currRotZ) * lerp;

      el.style.transform = `translate3d(${state.currX.toFixed(2)}%, ${state.currY.toFixed(2)}%, 0) rotateX(${state.currRotX.toFixed(2)}deg) rotateY(${state.currRotY.toFixed(2)}deg) rotateZ(${state.currRotZ.toFixed(2)}deg)`;

      // Settle check: sleep RAF when idle to conserve battery and GPU cycles
      const settled =
        Math.abs(targetX - state.currX) < 0.02 &&
        Math.abs(targetY - state.currY) < 0.02 &&
        Math.abs(targetRotX - state.currRotX) < 0.02 &&
        Math.abs(targetRotY - state.currRotY) < 0.02;

      if (settled) {
        state.isRunning = false;
        return;
      }

      state.rafId = requestAnimationFrame(updateTransform);
    };

    const startLoop = () => {
      if (state.isRunning) return;
      state.isRunning = true;
      state.rafId = requestAnimationFrame(updateTransform);
    };

    const handleMouseMove = (e: MouseEvent) => {
      state.targetNormX = (e.clientX / window.innerWidth) * 2 - 1;
      state.targetNormY = (e.clientY / window.innerHeight) * 2 - 1;
      if (!state.isRunning && state.inView && state.pageVisible) {
        startLoop();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        state.inView = entry.isIntersecting;
        if (state.inView && !state.isRunning) startLoop();
      },
      { threshold: 0 }
    );
    io.observe(el);

    const onVisChange = () => {
      state.pageVisible = !document.hidden;
      if (state.pageVisible && state.inView && !state.isRunning) startLoop();
    };
    document.addEventListener("visibilitychange", onVisChange);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", onVisChange);
      io.disconnect();
      cancelAnimationFrame(state.rafId);
      state.isRunning = false;
    };
  }, [isDesktopOrTablet, reducedMotion, tier]);

  // Efisiensi mobile: return null jika di mobile (< 768px), tidak ada DOM atau request aset
  if (!isDesktopOrTablet) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes logo3d-entrance-desktop {
          0% {
            opacity: 0;
            filter: blur(20px);
            transform: translateZ(-2000px) scale(0) rotateX(60deg) rotateY(-180deg);
          }
          60% {
            opacity: 0.85;
            filter: blur(0px);
            transform: translateZ(200px) scale(1.15) rotateX(-10deg) rotateY(20deg);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: translateZ(0px) scale(1) rotateX(0deg) rotateY(0deg);
          }
        }

        @keyframes logo3d-breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        .logo3d-anim-desktop-entrance {
          animation: logo3d-entrance-desktop 3s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }

        .logo3d-anim-desktop-breathe {
          animation: logo3d-breathe 15s ease-in-out 3.5s infinite;
        }
      `}</style>

      {/* Desktop & iPad Viewport (>= 768px): Perspective 2000px with Cursor-driven 3D Tilt */}
      <div
        ref={containerRef}
        className="hidden md:flex fixed top-1/2 left-1/2 w-[70vw] max-w-[900px] pointer-events-none z-[2] items-center justify-center"
        style={{
          perspective: 2000,
          transform: "translate3d(-50%, -50%, 0)",
          willChange: "transform",
        }}
        aria-hidden="true"
      >
        <div
          className={`w-full h-full flex justify-center items-center ${
            reducedMotion ? "opacity-100" : "logo3d-anim-desktop-entrance"
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className={`w-full flex justify-center items-center relative ${
              reducedMotion ? "" : "logo3d-anim-desktop-breathe"
            }`}
          >
            {/* 3D Embossed Logo Image - In front of ambient background */}
            <Image
              src="/logo3d.webp"
              alt="Logia Creative 3D Background"
              width={1424}
              height={764}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain select-none pointer-events-none opacity-30 dark:opacity-40 transition-opacity duration-500 drop-shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
