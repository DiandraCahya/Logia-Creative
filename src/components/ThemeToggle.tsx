"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <button className="p-2 rounded-lg glass-container min-h-[44px] min-w-[44px]" aria-label="Toggle theme" disabled />;
  const isDark = resolvedTheme === "dark";
  const toggle = () => {
    document.documentElement.classList.add("theme-toggling");
    setTheme(isDark ? "light" : "dark");
    setTimeout(() => document.documentElement.classList.remove("theme-toggling"), 150);
  };
  return (
    <button onClick={toggle} className="p-2 rounded-lg glass-container min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
