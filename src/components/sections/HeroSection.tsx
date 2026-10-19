import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { HeroCtaButton } from "@/components/HeroCtaButton";

const InteractiveShape = dynamic(
  () => import("@/components/InteractiveShape").then((m) => m.InteractiveShape)
);

interface HeroSectionProps {
  onOpenCollaboration?: () => void;
}

export function HeroSection({ onOpenCollaboration }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative bg-transparent min-h-[100dvh] sm:min-h-[92svh] flex items-center justify-center overflow-hidden pt-20 pb-8 sm:pt-32 sm:pb-28"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-2 lg:grid-cols-2 items-center gap-x-3 gap-y-5 sm:gap-4 lg:gap-8">
          {/* Left: Typography */}
          <div className="col-start-1 row-start-1 min-w-0 flex flex-col items-start justify-center">
            {/* Headline - max 7 words */}
            <h1 className="w-full font-display font-medium text-[clamp(2.1rem,9vw,3.5rem)] sm:text-[clamp(2rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em] text-black dark:text-white min-w-0">
              <span className="overflow-hidden block pb-1">
                <span className="block">
                  Craft Your<br />Brand Identity.
                </span>
              </span>
            </h1>
          </div>

          {/* Right: 3D Interactive Element (Server-rendered HTML + client-side tilt) */}
          <div className="col-start-2 row-start-1 sm:col-start-2 sm:row-start-1 sm:row-span-2 shrink-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div
                id="hero-interactive-shape"
                className="w-36 h-36 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] relative aspect-square"
                style={{ perspective: 1200 }}
              >
                <div
                  id="hero-tilt-target"
                  className="w-full h-full relative will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="absolute inset-0 overflow-hidden rounded-3xl border border-white/15"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    <Image
                      src="/LUOGIA2.webp"
                      alt="Potret kreator Logia Creative"
                      width={420}
                      height={420}
                      priority
                      sizes="(max-width: 640px) 144px, 420px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    id="hero-glare-target"
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ transform: "translateZ(51px)" }}
                  />
                </div>
              </div>
              <InteractiveShape />
            </div>
          </div>

          {/* CTA Buttons - pada mobile melebar penuh (col-span-2) agar tidak bertabrakan */}
          <div className="col-span-2 sm:col-span-1 sm:col-start-1 sm:row-start-2 w-full flex flex-col min-[350px]:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
            <HeroCtaButton onOpenCollaboration={onOpenCollaboration} />

            <a
              href="#portfolio"
              className="flex-1 sm:flex-none justify-center whitespace-nowrap px-4 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] inline-flex items-center text-sm font-semibold text-black dark:text-white border border-black/15 dark:border-white/15 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
            >
              Lihat Portfolio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
