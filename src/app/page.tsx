"use client";

import React, { useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { LiquidNavbar } from "@/components/LiquidNavbar";
import { Logo3DBackground } from "@/components/Logo3DBackground";
import { ScrollProgress } from "@/components/ScrollProgress";
import { MorphingBlob } from "@/components/MorphingBlob";
import { HeroSection } from "@/components/sections/HeroSection";
import { BackgroundTargetSection } from "@/components/sections/BackgroundTargetSection";
import { CompanyProfileSection } from "@/components/sections/CompanyProfileSection";
import { SWOTRoadmapSection } from "@/components/sections/SWOTRoadmapSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SustainabilitySection } from "@/components/sections/SustainabilitySection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { CollaborationModal } from "@/components/CollaborationModal";
import Image from "next/image";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-x-hidden selection:bg-brand-primary selection:text-white">
      {/* Faux-3D Perspective Initial Splash Screen */}
      <SplashScreen />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* 3D Logo Background — follows cursor on desktop */}
      <Logo3DBackground />

      {/* Decorative background images — low opacity, blurred, non-intrusive */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Group 3 decoration — top-right */}
        <div className="absolute -top-[10%] -right-[15%] w-[700px] h-[700px] opacity-[0.025] dark:opacity-[0.04]">
          <Image
            src="/Group 3.png"
            alt=""
            fill
            className="object-contain blur-[2px]"
            loading="lazy"
            sizes="700px"
          />
        </div>
        {/* Group 1 decoration — bottom-left */}
        <div className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] opacity-[0.03] dark:opacity-[0.05]">
          <Image
            src="/Group 1.png"
            alt=""
            fill
            className="object-contain blur-[1px]"
            loading="lazy"
            sizes="400px"
          />
        </div>
        {/* Morphing blob decorations */}
        <MorphingBlob
          size="lg"
          variant="slow"
          className="absolute top-[40%] -left-[20%] bg-gradient-to-br from-brand-primary/[0.06] to-brand-aqua/[0.03] blur-[100px]"
        />
        <MorphingBlob
          size="md"
          variant="alt"
          className="absolute top-[70%] -right-[15%] bg-gradient-to-bl from-brand-mint/[0.05] to-brand-slate/[0.03] blur-[80px]"
        />
      </div>

      {/* Floating Liquid Glass Navbar */}
      <LiquidNavbar onOpenCollaboration={() => setIsModalOpen(true)} />

      {/* Hero Section with Kinetic Typography & Parallax */}
      <HeroSection onOpenCollaboration={() => setIsModalOpen(true)} />

      {/* Proposal Poin 3: Background & Target Market */}
      <BackgroundTargetSection />

      {/* Proposal Poin 4 (Part 1): Profile, Visi, Misi, Filosofi */}
      <CompanyProfileSection />

      {/* Proposal Poin 4 (Part 2): SWOT Matrix & 5-Year Roadmap */}
      <SWOTRoadmapSection />

      {/* Proposal Poin 5: Creative & Tech Services & Capital Projection */}
      <ServicesSection onOpenCollaboration={() => setIsModalOpen(true)} />

      {/* Karya & Portfolio */}
      <PortfolioSection />

      {/* Client Testimonials */}
      <TestimonialSection />

      {/* Proposal Poin 6: Sustainability Model */}
      <SustainabilitySection />

      {/* Proposal Poin 7: Footer & Collaboration Closing */}
      <FooterSection onOpenCollaboration={() => setIsModalOpen(true)} />

      {/* Interactive Collaboration Modal with Confetti Celebration */}
      <CollaborationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
