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
            <p className="font-display text-4xl md:text-6xl font-medium tracking-[-0.02em] select-none">
              LOGIA CREATIVE
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
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleExit}
            aria-label="Skip intro"
            className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-black/60 hover:text-black bg-black/5 hover:bg-black/10 border border-black/10 dark:text-white/70 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 backdrop-blur-md transition-all group"
          >
            Skip Intro
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
