"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SplashScreen } from "@/components/SplashScreen";
import { LiquidNavbar } from "@/components/LiquidNavbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { HeroSection } from "@/components/sections/HeroSection";
import { BackgroundTargetSection } from "@/components/sections/BackgroundTargetSection";
import { CompanyProfileSection } from "@/components/sections/CompanyProfileSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { CollaborationModal } from "@/components/CollaborationModal";
import Marquee from "@/components/animations/Marquee";
import Image from "next/image";

const Logo3DBackground = dynamic(() => import("@/components/Logo3DBackground").then(mod => mod.Logo3DBackground), { ssr: false });
const MorphingBlob = dynamic(() => import("@/components/MorphingBlob").then(mod => mod.MorphingBlob), { ssr: false });

function MarqueeStrip() {
  const words = [
    "BRAND IDENTITY",
    "UI/UX DESIGN",
    "WEB DEVELOPMENT",
    "SOCIAL MEDIA",
    "MOTION GRAPHICS",
    "AUTOMATION",
  ];

  return (
    <div className="w-full py-6 border-y border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm">
      <Marquee items={words} speed={30} />
    </div>
  );
}


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden selection:bg-gray-300 dark:selection:bg-gray-700 selection:text-black dark:selection:text-white pb-[env(safe-area-inset-bottom)]">
      {/* Faux-3D Perspective Initial Splash Screen */}
      <SplashScreen />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* 3D Logo Background — follows cursor on desktop */}
      <Logo3DBackground />

      {/* Decorative background images — low opacity, blurred, non-intrusive */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Group 3 decoration — top-right */}
        <div className="absolute -top-[10%] -right-[15%] w-[700px] h-[700px] opacity-[0.025] dark:opacity-[0.04] overflow-hidden">
          <Image
            src="/Group 3.png"
            alt=""
            fill
            className="object-contain blur-[2px]"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
        {/* Group 1 decoration — bottom-left */}
        <div className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] opacity-[0.03] dark:opacity-[0.05] overflow-hidden">
          <Image
            src="/Group 1.png"
            alt=""
            fill
            className="object-contain blur-[1px]"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        {/* Morphing blob decorations */}
        <MorphingBlob
          size="lg"
          variant="slow"
          className="absolute top-[40%] -left-[20%] bg-gradient-to-br from-white/[0.04] to-transparent blur-[100px]"
        />
        <MorphingBlob
          size="md"
          variant="alt"
          className="absolute top-[70%] -right-[15%] bg-gradient-to-bl from-white/[0.04] to-transparent blur-[80px]"
        />
      </div>

      {/* Floating Liquid Glass Navbar */}
      <LiquidNavbar onOpenCollaboration={() => setIsModalOpen(true)} />

      {/* Hero Section with Kinetic Typography & Parallax */}
      <HeroSection onOpenCollaboration={() => setIsModalOpen(true)} />
      <MarqueeStrip />

      {/* Proposal Poin 3: Background & Target Market */}
      <section data-cv="true">
        <BackgroundTargetSection onOpenCollaboration={() => setIsModalOpen(true)} />
      </section>

      {/* Proposal Poin 4 (Part 1): Profile, Visi, Misi, Filosofi */}
      <section data-cv="true">
        <CompanyProfileSection />
      </section>

      {/* Creative & Tech Services */}
      <section data-cv="true">
        <ServicesSection />
      </section>

      {/* Karya & Portfolio */}
      <section data-cv="true">
        <PortfolioSection />
      </section>

      {/* Pricing Catalog */}
      <section data-cv="true">
        <PricingSection />
      </section>

      {/* Client Testimonials */}
      <section data-cv="true">
        <TestimonialSection />
      </section>

      {/* Footer & Collaboration Closing */}
      <section data-cv="true">
        <FooterSection onOpenCollaboration={() => setIsModalOpen(true)} />
      </section>

      {/* Interactive Collaboration Modal with Confetti Celebration */}
      <CollaborationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}