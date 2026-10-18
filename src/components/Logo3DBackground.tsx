"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePerformanceTier } from "@/lib/usePerformanceTier";

export function Logo3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = usePerformanceTier();
  const [compact, setCompact] = useState(false);

  // Logo 3D hanya bermakna dengan mouse; di mobile rAF dinonaktifkan
  useEffect(() => {
    setCompact(window.innerWidth < 768);
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Draw logo watermark onto canvas
  useEffect(() => {
    if (compact || tier === "low") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.src = "/LOGO.webp";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [compact, tier]);

  useEffect(() => {
    if (tier === "low" || compact) return;

    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let inView = true;
    let pageVisible = !document.hidden;
    let isRunning = false;

    const animate = () => {
      if (!inView || !pageVisible || document.documentElement.dataset.overlay) {
        isRunning = false;
        return;
      }

      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.1;
      currentY += dy * 0.1;

      const inner = el.firstElementChild as HTMLDivElement;
      if (inner) {
        inner.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateZ(20px)`;
      }

      // Idle sleep: if interpolation has settled, pause RAF until next mouse move
      if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
        isRunning = false;
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      rafId = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !isRunning) startLoop();
    }, { threshold: 0 });
    io.observe(el);

    const onVis = () => {
      pageVisible = !document.hidden;
      if (pageVisible && inView && !isRunning) startLoop();
    };
    document.addEventListener("visibilitychange", onVis);

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const maxAngle = tier === "medium" ? 8 : 15;
      targetY = ((e.clientX - cx) / cx) * maxAngle;
      targetX = ((e.clientY - cy) / cy) * -maxAngle;
      if (!isRunning && inView && pageVisible) {
        startLoop();
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      cancelAnimationFrame(rafId);
      isRunning = false;
    };
  }, [tier, compact]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none hidden md:flex items-center justify-center overflow-hidden"
      style={{ perspective: 1000 }}
      aria-hidden="true"
    >
      <div
        className="relative w-[min(340px,84vw)] h-[min(340px,84vw)] sm:w-[620px] sm:h-[620px]"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <canvas
          ref={canvasRef}
          width={620}
          height={620}
          className="w-full h-full object-contain opacity-[0.08] dark:opacity-[0.11] select-none pointer-events-none"
        />
      </div>
    </div>
  );
}
