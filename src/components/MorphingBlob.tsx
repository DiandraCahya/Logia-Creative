"use client";

import React from "react";

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

  return (
    <div
      className={`${sizeMap[size]} ${variantMap[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}
