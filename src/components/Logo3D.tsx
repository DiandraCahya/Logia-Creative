"use client";
import { useRef, useEffect, useState } from 'react';

export default function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      setRotation({
        x: -deltaY * 20, // Max 20 degree
        y: deltaX * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-64 h-64 md:w-96 md:h-96 logo-3d mx-auto"
      style={{ perspective: '1000px' }}
    >
      <img
        src="/LOGO.png"
        alt="Logia Logo"
        className="w-full h-full object-contain"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
          transition: 'transform 0.1s ease-out',
        }}
      />
    </div>
  );
}