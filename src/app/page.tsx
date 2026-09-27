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

const Logo3DBackground = dynamic(() => import("@/components/Logo3DBackground").then(mod => mod.Logo3DBackground), { ssr: false });

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
    <div className="w-full py-6 border-y border-black/10 dark:border-white/10 overflow-hidden bg-transparent">
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