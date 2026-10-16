"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
}

// ponytail: framer-motion dihapus — splash cuma butuh fade + progress bar;
// CSS transition sama hasilnya, tanpa memuat runtime animasi di first-load.
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  const TEXT = "LOGIA CREATIVE";
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(TEXT.length);
      return;
    }
    const t = setInterval(() => {
      setN((v) => {
        if (v >= TEXT.length) {
          clearInterval(t);
          return v;
        }
        return v + 1;
      });
    }, 70);
    return () => clearInterval(t);
  }, []);

  const handleExit = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIsVisible(false);
      doneRef.current?.();
    }, 350);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = setTimeout(handleExit, reduced ? 100 : 1400);
    return () => clearTimeout(timeout);
  }, [handleExit]);

  return (
    <>
      {isVisible && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] dark:bg-[#0A0A0A] dark:text-white transition-opacity duration-300 ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <p aria-label={TEXT} className="font-display text-4xl md:text-6xl font-medium tracking-[-0.02em] select-none">
              {TEXT.slice(0, n)}
              {n < TEXT.length && (
                <span aria-hidden="true" className="animate-pulse text-[var(--accent-bronze)]">|</span>
              )}
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
                  transform: "scaleX(1)",
                  transition: "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleExit}
            aria-label="Skip intro"
            className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium group"
            style={{ color: "var(--text-secondary)" }}
          >
            Skip Intro
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
