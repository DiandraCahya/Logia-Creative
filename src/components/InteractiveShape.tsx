"use client";

import { useEffect } from "react";

export function InteractiveShape() {
  useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement.classList.contains("is-audit")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof window !== "undefined" && !window.matchMedia("(min-width: 768px)").matches) return;
    const el = document.getElementById("hero-interactive-shape");
    const tilt = document.getElementById("hero-tilt-target");
    const glare = document.getElementById("hero-glare-target");
    if (!el || !tilt) return;

    let raf = 0;
    let isRunning = false;
    let inView = true;
    let isHovered = false;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const target = { rx: 0, ry: 0, px: 50, py: 50 };
    const current = { rx: 0, ry: 0, px: 50, py: 50 };

    const render = () => {
      if (!inView || document.hidden || document.documentElement.dataset.overlay) {
        isRunning = false;
        return;
      }
      const drx = target.rx - current.rx;
      const dry = target.ry - current.ry;
      const dpx = target.px - current.px;
      const dpy = target.py - current.py;

      current.rx += drx * 0.1;
      current.ry += dry * 0.1;
      current.px += dpx * 0.15;
      current.py += dpy * 0.15;

      tilt.style.transform = `perspective(1000px) rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg)`;
      if (glare) {
        glare.style.background = `radial-gradient(circle 200px at ${current.px.toFixed(1)}% ${current.py.toFixed(1)}%, rgba(192,192,192,0.15), transparent)`;
      }

      if (Math.abs(drx) < 0.01 && Math.abs(dry) < 0.01 && Math.abs(dpx) < 0.05 && Math.abs(dpy) < 0.05) {
        isRunning = false;
        return;
      }

      raf = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      raf = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && (isHovered || Math.abs(target.rx - current.rx) > 0.01)) {
        startLoop();
      }
    });
    io.observe(el);

    const onMouse = (e: MouseEvent) => {
      if (!isHovered) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      target.rx = clamp(-y * 20, 15);
      target.ry = clamp(x * 20, 15);
      target.px = ((e.clientX - r.left) / r.width) * 100;
      target.py = ((e.clientY - r.top) / r.height) * 100;
      startLoop();
    };

    const onEnter = () => {
      isHovered = true;
      startLoop();
    };

    const onLeave = () => {
      isHovered = false;
      target.rx = 0;
      target.ry = 0;
      target.px = 50;
      target.py = 50;
      startLoop();
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      isRunning = false;
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return null;
}
