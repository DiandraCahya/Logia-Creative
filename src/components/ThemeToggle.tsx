"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const baseClasses =
    "p-2 rounded-full flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 min-h-[44px] min-w-[44px]";

  if (!mounted) {
    return (
      <button
        className={`${baseClasses} ${className}`}
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const toggle = () => {
    document.documentElement.classList.add("theme-toggling", "no-trans", "disable-transitions");
    setTheme(isDark ? "light" : "dark");
    setTimeout(() => document.documentElement.classList.remove("theme-toggling", "no-trans", "disable-transitions"), 200);
  };

  return (
    <button
      onClick={toggle}
      className={`${baseClasses} ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
