"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
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

  const handleExit = React.useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      doneRef.current?.();
    }, 400);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = setTimeout(handleExit, reduced ? 100 : 1600);
    return () => clearTimeout(timeout);
  }, [handleExit]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] dark:bg-[#0A0A0A] dark:text-white"
        >
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <p aria-label={TEXT} className="font-display text-4xl md:text-6xl font-medium tracking-[-0.02em] select-none">
              {TEXT.slice(0, n)}
              {n < TEXT.length && (
                <motion.span aria-hidden="true" animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-[var(--accent-bronze)]">|</motion.span>
              )}
            </p>
            {/* thin progress indicator */}
            <div
              className="h-px w-40 overflow-hidden bg-black/10 dark:bg-white/15"
              role="progressbar"
              aria-label="Loading progress"
            >
              <motion.div
                className="h-full w-full origin-left bg-[var(--accent-bronze)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
