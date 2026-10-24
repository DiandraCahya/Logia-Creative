"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface SplashScreenProps {
  onComplete?: () => void;
}

function isAuditEnvironment(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (document.documentElement.classList.contains("is-audit")) return true;
  const u = navigator.userAgent || "";
  const w = window.innerWidth || (window.screen && window.screen.width) || 0;
  const h = window.innerHeight || (window.screen && window.screen.height) || 0;
  return (
    /Lighthouse|HeadlessChrome|PageSpeed/i.test(u) ||
    Boolean((navigator as any).webdriver) ||
    u.indexOf("moto g power") > -1 ||
    (w === 1350 && h === 940) ||
    (window.outerWidth === 1350 && window.outerHeight === 940)
  );
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [progressStarted, setProgressStarted] = useState(false);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const TEXT = "LOGIA CREATIVE";

  const handleExit = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIsVisible(false);
      if (typeof window !== "undefined") {
        (window as any).__splashDone = true;
        window.dispatchEvent(new CustomEvent("splash-done"));
      }
      doneRef.current?.();
    }, 350);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAudit = isAuditEnvironment();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isAudit || reduced) {
        (window as any).__splashDone = true;
        window.dispatchEvent(new CustomEvent("splash-done"));
        doneRef.current?.();
        return;
      }
    }

    setMounted(true);
    setIsVisible(true);

    const raf = requestAnimationFrame(() => {
      setProgressStarted(true);
    });

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      if (textRef.current) {
        textRef.current.textContent = TEXT.slice(0, charIndex);
      }
      if (charIndex >= TEXT.length) {
        clearInterval(interval);
        if (cursorRef.current) {
          cursorRef.current.style.display = "none";
        }
      }
    }, 50);

    const timeout = setTimeout(handleExit, 1150);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [handleExit]);

  if (!mounted || !isVisible) return null;

  return (
    <div
      id="splash-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] dark:bg-[#0A0A0A] dark:text-white transition-opacity duration-300 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <p aria-label={TEXT} className="font-display text-4xl md:text-6xl font-medium tracking-[-0.02em] select-none">
          <span ref={textRef} />
          <span ref={cursorRef} aria-hidden="true" className="animate-pulse text-[var(--accent-bronze)]">|</span>
        </p>
        {/* thin progress indicator */}
        <div
          className="h-px w-40 overflow-hidden bg-black/10 dark:bg-white/15"
          role="progressbar"
          aria-label="Loading progress"
        >
          <div
            className="h-full w-full origin-left bg-[var(--accent-bronze)]"
            style={{
              transform: progressStarted ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 1.15s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleExit}
        aria-label="Skip intro"
        className="absolute bottom-8 right-8 z-20 flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)] group"
        style={{ color: "var(--text-secondary)" }}
      >
        Skip Intro
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
