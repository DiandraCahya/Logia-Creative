"use client";

import React from "react";
import { usePerformanceTier } from "@/lib/usePerformanceTier";

interface MorphingBlobProps {
  /** CSS gradient classes for the blob fill */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Animation variant */
  variant?: "default" | "alt" | "slow";
}

/**
 * Reusable SVG-based morphing blob for background decoration.
 * Pure CSS animation — no JS runtime cost.
 */
export function MorphingBlob({
  className = "",
  size = "md",
  variant = "default",
}: MorphingBlobProps) {
  const tier = usePerformanceTier();
  const sizeMap = {
    sm: "w-[200px] h-[200px]",
    md: "w-[400px] h-[400px]",
    lg: "w-[600px] h-[600px]",
  };

  const variantMap = {
    default: "morph-blob",
    alt: "morph-blob-alt",
    slow: "morph-blob-slow",
  };

  // If low tier, make it a static rounded div instead of animating
  const isLow = tier === "low";
  const animClass = isLow ? "rounded-full" : variantMap[variant];

  // If low/medium tier, reduce heavy blur operations directly from className
  // by stripping 'blur-[80px]' etc. or substituting them with a lighter blur if possible.
  // For safety in this component, we let Tailwind handle it if we modify it in globals,
  // but a simpler way is to just keep the shape static for 'low'.

  return (
    <div
      className={`${sizeMap[size]} ${animClass} ${className} ${isLow ? 'opacity-50 blur-[20px] transition-none' : ''}`}
      aria-hidden="true"
      style={isLow ? { willChange: 'auto', animation: 'none' } : undefined}
    />
  );
}
