"use client";

import { usePerformanceTier } from "@/lib/usePerformanceTier";

export function PerformanceInit() {
  usePerformanceTier();
  return null;
}
