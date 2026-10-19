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
    "p-1 sm:p-1.5 rounded-full flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 w-7 h-7 lg:w-8 lg:h-8 shrink-0 relative after:content-[''] after:absolute after:-inset-2 lg:after:hidden cursor-pointer";

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

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const nextTheme = isDark ? "light" : "dark";

    // Check View Transitions API support and reduced motion
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const hasViewTransition = typeof doc.startViewTransition === "function";
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasViewTransition || reducedMotion) {
      document.documentElement.classList.add(
        "theme-toggling",
        "no-trans",
        "disable-transitions"
      );
      setTheme(nextTheme);
      setTimeout(
        () =>
          document.documentElement.classList.remove(
            "theme-toggling",
            "no-trans",
            "disable-transitions"
          ),
        200
      );
      return;
    }

    // Coordinates of click (or button center if keyboard-triggered)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX > 0 ? e.clientX : rect.left + rect.width / 2;
    const y = e.clientY > 0 ? e.clientY : rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const heroShape = document.getElementById("hero-interactive-shape");
    if (heroShape) {
      heroShape.style.viewTransitionName = "hero-interactive-shape";
    }

    const navbar = document.getElementById("macbook-island-nav");
    if (navbar) {
      navbar.style.viewTransitionName = "macbook-island-nav";
    }

    const transition = (
      document as unknown as {
        startViewTransition: (cb: () => void) => { ready: Promise<void>; finished?: Promise<void> };
      }
    ).startViewTransition(() => {
      setTheme(nextTheme);
    });

    const cleanup = () => {
      if (heroShape) {
        heroShape.style.viewTransitionName = "";
      }
      if (navbar) {
        navbar.style.viewTransitionName = "";
      }
    };

    transition.ready.then(() => {
      const anim = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
      anim.onfinish = cleanup;
      anim.oncancel = cleanup;
    }).catch(cleanup);
  };

  return (
    <button
      onClick={toggle}
      className={`${baseClasses} ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
