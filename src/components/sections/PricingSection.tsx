"use client";

import React, { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { Check, ChevronDown, Code2, Palette, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { openCollaborationModal } from "@/components/CollaborationManager";
import { api } from "@/lib/api";
import {
  SOLUTIONS,
  TERMS,
  START_FROM_LABEL,
  formatPrice,
  priceTypeLabel,
  priceUnitLabel,
} from "@/lib/rate-card";

const solutionIcons: Record<string, React.ElementType> = {
  tech: Code2,
  creative: Palette,
  integrated: Layers,
};

const ease = [0.22, 1, 0.36, 1] as const; // --ease-out-expo, satu easing global

export function PricingSection({ onSelectPackage }: { onSelectPackage?: (packageId: string) => void }) {
  const { ref, isInView } = useScrollReveal();
  const [liveSolutions, setLiveSolutions] = useState(SOLUTIONS);
  const [tab, setTab] = useState(SOLUTIONS[0].id);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openTerm, setOpenTerm] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getPricing()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setLiveSolutions(res.data as any);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const active = liveSolutions.find((s) => s.id === tab) ?? liveSolutions[0] ?? SOLUTIONS[0];

  // "Pilih {PAKET}" → buka form kolaborasi dengan paket sudah ter-prefill.
  const pick = (packageId: string) => {
    if (onSelectPackage) {
      onSelectPackage(packageId);
    } else {
      openCollaborationModal({
        name: "",
        brandName: "",
        contact: "",
        budget: "",
        services: [packageId],
        notes: "",
      });
    }
  };

  return (
    <section
      id="pricing"
      className="py-12 sm:py-20 relative bg-transparent"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2
            className={`font-righteous tracking-normal text-[clamp(1.85rem,4.5vw,3.5rem)] text-black dark:text-white mb-2.5 sm:mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Rate Card
          </h2>
          <p
            className={`text-base text-[#666666] dark:text-[#999999] transition-all duration-700 delay-150 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Pilih paket layanan yang sesuai dengan tahap pertumbuhan bisnis Anda.
          </p>
        </div>

        {/* Individual Tab Buttons tanpa card pembungkus, serasi dengan Target Pasar */}
        <div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
          role="tablist"
          aria-label="Jenis solusi"
        >
          {liveSolutions.map((s) => {
            const Icon = solutionIcons[s.id] || Layers;
            const isActive = tab === s.id;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setTab(s.id);
                  setExpanded(null);
                }}
                className={`px-5 py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap border ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md backdrop-blur-md"
                    : "bg-white/60 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/20 border-black/10 dark:border-white/15 backdrop-blur-md shadow-sm"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        <div key={tab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 animate-fade-up">
          {active.packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col p-5 sm:p-8 rounded-2xl sm:rounded-3xl transition-all duration-500 hover:-translate-y-1 ${
                pkg.popular
                  ? "bg-black dark:bg-white border-2 border-black dark:border-white text-white dark:text-black shadow-xl"
                  : "glass-card"
              }`}
              style={{
                transitionDelay: `${isInView ? 80 + idx * 60 : 0}ms`,
              }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white dark:bg-black text-black dark:text-white text-xs font-bold uppercase tracking-wider rounded-full border border-black/10 dark:border-white/10 shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="mb-4 sm:mb-6">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                    pkg.popular
                      ? "text-white/70 dark:text-black/70"
                      : "text-[#666666] dark:text-[#999999]"
                  }`}
                >
                  {priceTypeLabel(pkg.unit)}
                </p>
                <h3 className="text-xl sm:text-2xl font-display font-medium mb-1.5 sm:mb-2">{pkg.name}</h3>
                <p
                  className={`text-sm font-semibold ${
                    pkg.popular
                      ? "text-white/70 dark:text-black/70"
                      : "text-[#666666] dark:text-[#999999]"
                  }`}
                >
                  {pkg.tagline}
                </p>
                <div className="mt-4">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      pkg.popular
                        ? "text-white/60 dark:text-black/60"
                        : "text-[#666666] dark:text-[#999999]"
                    }`}
                  >
                    {START_FROM_LABEL}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {formatPrice(pkg.price)}
                    <span
                      className={`text-sm font-semibold ml-1.5 ${
                        pkg.popular
                          ? "text-white/70 dark:text-black/70"
                          : "text-[#666666] dark:text-[#999999]"
                      }`}
                    >
                      {priceUnitLabel(pkg.unit)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex-grow mb-4 sm:mb-6">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === pkg.id ? null : pkg.id)}
                  aria-expanded={expanded === pkg.id}
                  className={`inline-flex items-center gap-1.5 min-h-[44px] -my-2 text-sm font-semibold transition-all duration-200 ${
                    pkg.popular
                      ? "text-white/90 dark:text-black/90 hover:opacity-80"
                      : "text-[#444444] dark:text-[#CCCCCC] hover:text-black dark:hover:text-white"
                  }`}
                >
                  <span className="underline underline-offset-2">
                    {expanded === pkg.id ? "Sembunyikan rincian" : "Lihat rincian paket"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      expanded === pkg.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    expanded === pkg.id ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    {pkg.intro && (
                      <p
                        className={`text-sm font-semibold ${
                          pkg.popular ? "text-white/90 dark:text-black/90" : "text-black dark:text-white"
                        }`}
                      >
                        {pkg.intro}
                      </p>
                    )}
                    <ol className="mt-4 space-y-3">
                      {pkg.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          {pkg.numbered ? (
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full text-[11px] font-bold flex items-center justify-center ${
                                pkg.popular
                                  ? "bg-white/15 dark:bg-black/10 text-white dark:text-black"
                                  : "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                              }`}
                            >
                              {i + 1}
                            </span>
                          ) : (
                            <Check
                              className={`w-5 h-5 shrink-0 ${
                                pkg.popular ? "text-white dark:text-black" : "text-black dark:text-white"
                              }`}
                            />
                          )}
                          <span
                            className={`text-sm ${
                              pkg.popular
                                ? "text-white/90 dark:text-black/90"
                                : "text-[#444444] dark:text-[#BBBBBB]"
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ol>
                    {pkg.notes && pkg.notes.length > 0 && (
                      <div className="mt-4 space-y-1.5">
                        {pkg.notes.map((note, i) => (
                          <p
                            key={i}
                            className={`text-xs leading-relaxed ${
                              pkg.popular
                                ? "text-white/60 dark:text-black/60"
                                : "text-[#666666] dark:text-[#999999]"
                            }`}
                          >
                            {note}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => pick(pkg.id)}
                className={`w-full min-h-[44px] py-4 rounded-full text-sm font-bold text-center transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                  pkg.popular
                    ? "bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20"
                    : "bg-black dark:bg-white text-white dark:text-black"
                }`}
              >
                Pilih {pkg.name}
              </button>
            </div>
          ))}
        </div>

        {/* Syarat & Ketentuan accordion */}
        <div className="max-w-3xl mx-auto mt-20">
          <h3 className="font-righteous tracking-normal text-2xl text-black dark:text-white text-center mb-8">
            Syarat & Ketentuan Layanan
          </h3>
          <div className="space-y-3">
            {TERMS.map((term, i) => (
              <div
                key={term.title}
                className="glass-accordion rounded-2xl overflow-hidden transition-all duration-300 hover:border-black/20 dark:hover:border-white/20"
                onMouseEnter={() => setOpenTerm(i)}
                onMouseLeave={() => setOpenTerm((curr) => (curr === i ? null : curr))}
              >
                <button
                  type="button"
                  onClick={() => setOpenTerm(openTerm === i ? null : i)}
                  aria-expanded={openTerm === i}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 min-h-[48px] text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer"
                >
                  <span className="font-semibold text-black dark:text-white">{term.title}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#666666] dark:text-[#999999] transition-transform duration-300 ${
                      openTerm === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    openTerm === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="px-5 sm:px-6 pb-5 pt-1 space-y-2.5">
                      {term.body.map((b, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-sm text-[#444444] dark:text-[#BBBBBB] leading-relaxed"
                        >
                          <Check className="w-4 h-4 shrink-0 text-black dark:text-white mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-16 text-center space-y-6 transition-all duration-700 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            Butuh solusi di luar paket? Diskusikan kebutuhanmu bersama kami.
          </p>
          <div className="flex items-center justify-center">
            <a
              href="#kontak"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Diskusikan Kebutuhan Anda
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}