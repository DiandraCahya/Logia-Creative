"use client";

import React, { useMemo } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  staggerMs?: number;
  children?: React.ReactNode;
}

/**
 * Splits text into words and animates each with a staggered reveal.
 * Uses IntersectionObserver for triggering.
 * Supports mixed content: pass `children` for JSX (e.g. gradient spans).
 */
export function TextReveal({
  text,
  as: Tag = "h2",
  className = "",
  staggerMs = 60,
  children,
}: TextRevealProps) {
  const { ref, isInView } = useScrollReveal({ threshold: 0.2 });

  const words = useMemo(() => text.split(" "), [text]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={`word-reveal-container ${isInView ? "revealed" : ""} ${className}`}
    >
      {children
        ? children
        : words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="word-reveal"
              style={{ transitionDelay: `${i * staggerMs}ms` }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
    </Tag>
  );
}
