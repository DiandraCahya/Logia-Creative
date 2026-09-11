"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function Logo3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafId = useRef<number>(0);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Detect touch/mobile devices
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      window.innerWidth < 768;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const maxAngle = 15;
      const rY = ((e.clientX - cx) / cx) * maxAngle;
      const rX = ((e.clientY - cy) / cy) * -maxAngle;

      targetRotation.current = { x: rX, y: rY };
    };

    const animate = () => {
      setRotation((prev) => ({
        x: prev.x + (targetRotation.current.x - prev.x) * 0.1,
        y: prev.y + (targetRotation.current.y - prev.y) * 0.1,
      }));
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ perspective: 1000 }}
      aria-hidden="true"
    >
      <div
        className="relative w-[600px] h-[600px]"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(20px)`,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <Image
          src="/LOGO.png"
          alt=""
          fill
          className="object-contain opacity-[0.04]"
          sizes="600px"
          priority={false}
          loading="lazy"
        />
      </div>
    </div>
  );
}
