"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-11 h-11 rounded-2xl bg-brand-light/50 dark:bg-brand-navy/60 border border-brand-primary/20 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Theme Mode"
      className={`
        relative w-12 h-12 rounded-2xl flex items-center justify-center
        transition-all duration-300 outline-none
        ${
          isDark
            ? "bg-[#0c1e36] text-brand-aqua shadow-neumorph-sm-dark border border-brand-aqua/25 hover:border-brand-aqua/50"
            : "bg-[#eaf2f7] text-brand-slate shadow-neumorph-sm-light border border-white hover:border-brand-primary/30"
        }
      `}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : 90,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(103,199,210,0.6)]" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? -90 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="w-5 h-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
        </motion.div>
      </div>

      {/* Subtle tactile depression ring indicator */}
      <span
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
          isDark
            ? "ring-1 ring-inset ring-brand-aqua/10"
            : "ring-1 ring-inset ring-brand-primary/10"
        }`}
      />
    </motion.button>
  );
}
