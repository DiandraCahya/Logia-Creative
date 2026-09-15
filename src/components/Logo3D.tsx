"use client";
import { useRef, useEffect } from 'react';
import Image from "next/image";
import { usePerformanceTier } from "@/lib/usePerformanceTier";

export default function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();

  useEffect(() => {
    if (tier === "low") return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    let inView = true;
    let pageVisible = !document.hidden;

    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(el);

    const onVis = () => { pageVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // simple throttle
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        const maxAngle = tier === "medium" ? 10 : 20;

        targetX = -deltaY * maxAngle;
        targetY = deltaX * maxAngle;
      });
    };

    const handleMouseOut = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      if (inView && pageVisible) {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;

        const img = el.querySelector('img');
        if (img) {
          img.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseout', handleMouseOut, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [tier]);

  return (
    <div
      ref={containerRef}
      className="relative w-64 h-64 md:w-96 md:h-96 logo-3d mx-auto"
      style={{ perspective: '1000px' }}
    >
      <Image
        src="/LOGO.png"
        alt="Logia Logo"
        fill
        sizes="(max-width: 768px) 256px, 384px"
        priority
        className="object-contain"
        style={{
          transformStyle: 'preserve-3d',
          filter: tier !== 'low' ? 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))' : 'none',
          willChange: tier !== 'low' ? 'transform' : 'auto',
        }}
      />
    </div>
  );
}