"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed scroll progress indicator bar at the top of the viewport.
 * Uses requestAnimationFrame and direct DOM mutation for smooth, jank-free updates without React state.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      const el = ref.current;
      if (!el) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) : 0;

      el.style.transform = `scaleX(${scrolled})`;
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateProgress();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="scroll-progress-bar fixed top-0 left-0 h-1 bg-brand-primary z-50 origin-left"
      style={{ transform: `scaleX(0)` }}
      role="progressbar"
      aria-label="Scroll progress"
    />
  );
}
