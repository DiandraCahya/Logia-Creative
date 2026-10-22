"use client";

import React, { useState } from "react";
import { Tag, ArrowRight, X } from "lucide-react";
import type { PromoItem } from "@/lib/cms/types";

export function PromoBanner({ promos }: { promos?: PromoItem[] }) {
  const [dismissed, setDismissed] = useState(false);

  if (!promos || promos.length === 0 || dismissed) return null;

  const now = new Date().toISOString().split("T")[0];
  const activePromo = promos.find((p) => {
    if (p.active === false) return false;
    if (p.startDate && p.startDate > now) return false;
    if (p.endDate && p.endDate < now) return false;
    return true;
  });

  if (!activePromo) return null;

  return (
    <aside
      aria-label="Pengumuman promo aktif"
      className="relative z-40 w-full bg-black/90 dark:bg-white/95 text-white dark:text-black py-2.5 px-4 text-xs font-medium backdrop-blur-md border-b border-white/10 dark:border-black/10 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="shrink-0 p-1 rounded-full bg-white/20 dark:bg-black/10">
            <Tag className="w-3.5 h-3.5" />
          </span>
          <p className="truncate">
            <strong className="font-semibold">{activePromo.title}</strong>
            {activePromo.code && (
              <span className="ml-2 px-2 py-0.5 rounded bg-white/20 dark:bg-black/10 font-mono text-[11px] font-bold tracking-wider">
                {activePromo.code}
              </span>
            )}
            {activePromo.discount && (
              <span className="ml-1.5 opacity-90 hidden sm:inline">
                ({activePromo.discount})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {activePromo.link && (
            <a
              href={activePromo.link}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              <span>Klaim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition-colors"
            aria-label="Tutup promo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
