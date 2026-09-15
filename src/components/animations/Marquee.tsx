"use client";
import { useEffect, useRef, useState } from "react";
import { usePerformanceTier } from "@/lib/usePerformanceTier";

interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ items, speed = 35, reverse = false, className = "" }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const tier = usePerformanceTier();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      setIsPaused(!entry.isIntersecting);
    }, { threshold: 0 });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const effectiveSpeed = tier === "low" ? speed * 2.5 : speed;

  return (
    <div ref={containerRef} className={`marquee overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="marquee-track"
        style={{
          animationDuration: `${effectiveSpeed}s`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group">
            {items.map((item, i) => (
              <span key={i} className="marquee-item">
                {item}
                <span className="marquee-dot">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
