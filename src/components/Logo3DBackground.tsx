"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePerformanceTier } from "@/lib/usePerformanceTier";

export function Logo3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const [compact, setCompact] = useState(false);

  // ponytail: logo 3D hanya bermakna dengan mouse; di layar sempit (mobile)
  // render + loop rAF sia-sia → matikan. Cek width saat mount.
  useEffect(() => {
    setCompact(window.innerWidth < 768);
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(el);

    const onVis = () => { pageVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const maxAngle = tier === "medium" ? 8 : 15;
      targetY = ((e.clientX - cx) / cx) * maxAngle;
      targetX = ((e.clientY - cy) / cy) * -maxAngle;
    };

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      // Pause saat overlay Archive terbuka (ui beku, tidak perlu repaint).
      if (!inView || !pageVisible || document.documentElement.dataset.overlay) return;

      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      // Update inner div style directly to avoid React state overhead
      const inner = el.firstElementChild as HTMLDivElement;
      if (inner) {
        inner.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg) translateZ(20px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [tier]);

  if (compact || tier === "low") return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden"
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
        <Image
          src="/LOGO.png"
          alt=""
          fill
          loading="lazy"
          className="object-contain opacity-[0.08] dark:opacity-[0.11] select-none"
          sizes="(max-width: 768px) 340px, 620px"
          priority={false}
        />
      </div>
    </div>
  );
}
