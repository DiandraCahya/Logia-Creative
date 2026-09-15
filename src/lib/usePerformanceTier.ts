"use client";
import { useEffect, useState } from "react";

export type PerfTier = "high" | "medium" | "low";

export function usePerformanceTier(): PerfTier {
  const [tier, setTier] = useState<PerfTier>("high");

  useEffect(() => {
    const nav = navigator as any;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores = nav.hardwareConcurrency ?? 4;
    const mem = nav.deviceMemory ?? 4;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    let t: PerfTier = "high";
    if (reduced) t = "low";
    else if (coarse || small) t = cores >= 8 && mem >= 6 ? "medium" : "low";
    else if (cores <= 4 || mem <= 4) t = "medium";

    setTier(t);
    document.documentElement.dataset.perf = t;
  }, []);

  return tier;
}
