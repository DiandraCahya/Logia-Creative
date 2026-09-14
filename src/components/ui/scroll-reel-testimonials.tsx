"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type Testimonial = {
  quote: string;
  author: string;
  image: string;
  alt?: string;
};

export function ScrollReelTestimonials({ testimonials, className }: { testimonials: Testimonial[], className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  // 3 columns: outer columns move up, middle column moves down.
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Re-map progress to index updates on change
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      // we only care about the middle 60% of the scroll for quotes to avoid empty edges
      const clampedV = Math.max(0, Math.min(1, (v - 0.2) / 0.6));
      const idx = Math.floor(clampedV * testimonials.length * 0.99);
      if (idx !== activeIndex && idx >= 0 && idx < testimonials.length) {
        setActiveIndex(idx);
      }
    });
  }, [scrollYProgress, activeIndex, testimonials.length]);

  const activeTestimonial = testimonials[activeIndex] || testimonials[0];

  // Infinite loop effect: duplicate array enough times for a tall section
  const col1 = [...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials];
  const reversed = [...testimonials].reverse();
  const col2 = [...reversed, ...reversed, ...reversed, ...reversed, ...reversed];
  const col3 = [...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <div ref={containerRef} className={cn("relative h-[250vh] bg-transparent w-full overflow-hidden", className)}>
      {/* Background Reels */}
      <div className="sticky top-0 h-[100vh] w-full flex items-center justify-center overflow-hidden opacity-40">
        <div
          className="absolute inset-0 grid grid-cols-3 gap-6 md:gap-12 px-2 md:px-8 scale-[1.2] rotate-[-10deg]"
          style={{
            maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
          }}
        >
          {/* Col 1 */}
          <motion.div style={{ y: y1 }} className="flex flex-col gap-6 md:gap-12">
            {col1.map((t, i) => (
              <div key={`col1-${i}`} className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden opacity-80 shadow-2xl">
                <Image src={t.image} alt={t.alt || ""} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" sizes="(max-width: 768px) 33vw, 25vw" />
              </div>
            ))}
          </motion.div>
          {/* Col 2 */}
          <motion.div style={{ y: y2 }} className="flex flex-col gap-6 md:gap-12 pt-[20vh]">
            {col2.map((t, i) => (
              <div key={`col2-${i}`} className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden opacity-80 shadow-2xl">
                <Image src={t.image} alt={t.alt || ""} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" sizes="(max-width: 768px) 33vw, 25vw" />
              </div>
            ))}
          </motion.div>
          {/* Col 3 */}
          <motion.div style={{ y: y1 }} className="flex flex-col gap-6 md:gap-12">
            {col3.map((t, i) => (
              <div key={`col3-${i}`} className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden opacity-80 shadow-2xl">
                <Image src={t.image} alt={t.alt || ""} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" sizes="(max-width: 768px) 33vw, 25vw" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Active Quote Overlay */}
      <div className="sticky top-0 h-[100vh] w-full flex flex-col items-center justify-center z-20 px-4 md:px-24 pointer-events-none text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-12 drop-shadow-2xl text-slate-900 dark:text-white">
            {activeTestimonial.quote.split("").map((char, i) => (
              <motion.span
                key={`${activeIndex}-${i}`}
                initial={{ y: "50%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.015 }}
                className="inline-block"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </motion.span>
            ))}
          </h3>
          <motion.div
            key={`author-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden relative shadow-xl border-2 border-white/20">
               <Image src={activeTestimonial.image} alt={activeTestimonial.author} fill className="object-cover" />
            </div>
            <p className="text-lg md:text-xl font-mono text-brand-primary dark:text-brand-aqua uppercase tracking-widest font-bold drop-shadow-md">
              — {activeTestimonial.author}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
