"use client";

import React, { useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { LiquidNavbar } from "@/components/LiquidNavbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { BackgroundTargetSection } from "@/components/sections/BackgroundTargetSection";
import { CompanyProfileSection } from "@/components/sections/CompanyProfileSection";
import { SWOTRoadmapSection } from "@/components/sections/SWOTRoadmapSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SustainabilitySection } from "@/components/sections/SustainabilitySection";
import { FooterSection } from "@/components/sections/FooterSection";
import { CollaborationModal } from "@/components/CollaborationModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-brand-primary selection:text-white">
      {/* Faux-3D Perspective Initial Splash Screen */}
      <SplashScreen />

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
