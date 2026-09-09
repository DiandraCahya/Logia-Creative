"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment progress counter
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    // Auto dismiss after 2.6s
    const timeout = setTimeout(() => {
      handleExit();
    }, 2700);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071324] text-white overflow-hidden"
          style={{ perspective: 1200 }}
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
              className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-primary/30 to-brand-aqua/20 blur-[130px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.25, 0.5, 0.25],
                x: [0, -30, 0],
                y: [0, 40, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[20%] -right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-brand-slate/40 via-brand-mint/20 to-transparent blur-[140px]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,19,36,0.85)_100%)]" />
          </div>

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleExit}
            className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-brand-aqua/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all group"
          >
            Lewati Intro
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.button>

          {/* 3D Transform Card Container */}
          <motion.div
            initial={{
              rotateX: 35,
              rotateY: -25,
              rotateZ: 5,
              scale: 0.7,
              opacity: 0,
              y: 60,
            }}
            animate={{
              rotateX: [35, -5, 0],
              rotateY: [-25, 6, 0],
              rotateZ: [5, -1, 0],
              scale: [0.7, 1.04, 1],
              opacity: [0, 1, 1],
              y: [60, -8, 0],
            }}
            transition={{
              duration: 1.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative flex flex-col items-center px-10 py-12 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] max-w-md mx-4"
          >
            {/* Dynamic Specular Glare / Sheen effect */}
            <motion.div
              initial={{ x: "-150%", opacity: 0 }}
              animate={{ x: "200%", opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.6, delay: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
            />

            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-aqua text-[11px] font-semibold tracking-wider uppercase mb-8"
            >
              <Sparkles className="w-3 h-3 text-brand-mint animate-pulse" />
              Creative & Technology Agency
            </motion.div>

            {/* Combined Brand Mark (LOGO + Group 1) */}
            <div className="relative flex flex-col items-center justify-center gap-4 my-2">
              {/* Primary Logia Mark */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: "brightness(0.5)" }}
                animate={{ scale: 1, opacity: 1, filter: "brightness(1.05)" }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative w-48 h-20 sm:w-56 sm:h-24 drop-shadow-[0_10px_25px_rgba(14,165,233,0.35)]"
              >
                <Image
                  src="/LOGO.png"
                  alt="Logia Mark"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Wordmark "creative" (Group 1) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative w-36 h-9 sm:w-44 sm:h-11 drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)]"
              >
                <Image
                  src="/Group 1.png"
                  alt="Creative Wordmark"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Tagline from Brand Guideline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center text-xs sm:text-sm text-brand-light/70 font-light tracking-wide max-w-xs"
            >
              Mengintegrasikan Kreativitas dan Teknologi untuk Pertumbuhan Bisnis Anda.
            </motion.p>

            {/* Progress Bar & Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full mt-8 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center text-[10px] text-brand-aqua/80 uppercase font-mono tracking-widest">
                <span>Initializing Experience</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-aqua to-brand-mint"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
