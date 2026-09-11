"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
}

const LOGIA_TEXT = "Logia";

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [typedCount, setTypedCount] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Typing effect — reveal one character at a time
    const typingDelay = 400; // delay before typing starts
    const charInterval = 150; // ms per character
    const typingTimers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i <= LOGIA_TEXT.length; i++) {
      const t = setTimeout(() => {
        setTypedCount(i);
        // Hide cursor after last character + a small delay
        if (i === LOGIA_TEXT.length) {
          setTimeout(() => setShowCursor(false), 600);
        }
      }, typingDelay + i * charInterval);
      typingTimers.push(t);
    }

    // Auto dismiss after 2.7s
    const timeout = setTimeout(() => {
      handleExit();
    }, 2700);

    return () => {
      clearTimeout(timeout);
      typingTimers.forEach(clearTimeout);
    };
  }, []);

  const handleExit = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071324] text-white"
        >
          {/* Ambient Cosmic Background Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 20, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] morph-blob bg-gradient-to-br from-brand-primary/30 to-brand-aqua/20 blur-[130px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.25, 0.5, 0.25],
                x: [0, -30, 0],
                y: [0, 40, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[20%] -right-[10%] w-[550px] h-[550px] morph-blob-alt bg-gradient-to-tl from-brand-slate/40 via-brand-mint/20 to-transparent blur-[140px]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,19,36,0.85)_100%)]" />
          </div>

          {/* Typing Animation "Logia" */}
          <div className="relative z-10 flex items-center justify-center drop-shadow-[0_10px_25px_rgba(37,99,235,0.35)]">
            <h1 className="text-6xl md:text-8xl font-black leading-[1.2] pb-[0.15em] overflow-visible inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 select-none inline-block">
                {LOGIA_TEXT.slice(0, typedCount)}
              </span>
              {showCursor && (
                <span className="inline-block text-blue-400 font-light select-none ml-1 animate-pulse" aria-hidden="true">
                  |
                </span>
              )}
            </h1>
          </div>

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleExit}
            className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all group"
          >
            Skip Intro
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
