"use client";

import React, { useState, useEffect } from "react";
import { LiquidNavbar } from "@/components/LiquidNavbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { MorphingBlob } from "@/components/MorphingBlob";
import { HeroSection } from "@/components/sections/HeroSection";
import { BackgroundTargetSection } from "@/components/sections/BackgroundTargetSection";
import { CompanyProfileSection } from "@/components/sections/CompanyProfileSection";
import { SWOTRoadmapSection } from "@/components/sections/SWOTRoadmapSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SustainabilitySection } from "@/components/sections/SustainabilitySection";
import { FooterSection } from "@/components/sections/FooterSection";
import { CollaborationModal } from "@/components/CollaborationModal";
import Image from "next/image";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main
      className="relative min-h-screen bg-bg-primary text-text-primary overflow-x-hidden selection:bg-accent-primary selection:text-white"
      style={
        {
          "--mouse-x": `${mousePos.x}px`,
          "--mouse-y": `${mousePos.y}px`,
        } as React.CSSProperties
      }
    >
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Decorative background images — low opacity, blurred, non-intrusive */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden hidden md:block" aria-hidden="true">
        {/* Background Asset 1 */}
        <div className="bg-aset bg-aset-1">
          <Image
            src="/asetbg1.png"
            alt=""
            fill
            className="object-contain"
            loading="lazy"
            sizes="500px"
          />
        </div>
        {/* Background Asset 2 */}
        <div className="bg-aset bg-aset-2">
          <Image
            src="/asetbg2.png"
            alt=""
            fill
            className="object-contain"
            loading="lazy"
            sizes="500px"
          />
        </div>

        {/* Morphing blob decorations (Max 2 total) */}
        <MorphingBlob
          className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] text-accent-primary blur-[100px]"
        />
        <MorphingBlob
          className="absolute bottom-[20%] -right-[10%] w-[400px] h-[400px] text-accent-secondary blur-[80px]"
        />
      </div>

      {/* Floating Liquid Navbar */}
      <LiquidNavbar onOpenCollaboration={() => setIsModalOpen(true)} />

      <div className="relative z-10 flex flex-col gap-24 md:gap-32 lg:gap-40 py-24 md:py-32 lg:py-40 container mx-auto">
        {/* Hero Section */}
        <HeroSection onOpenCollaboration={() => setIsModalOpen(true)} />

        {/* Profile, Visi, Misi */}
        <CompanyProfileSection />

        {/* Services */}
        <ServicesSection onOpenCollaboration={() => setIsModalOpen(true)} />

        {/* Background & Target Market */}
        <BackgroundTargetSection />

        {/* SWOT Matrix & 5-Year Roadmap */}
        <SWOTRoadmapSection />

        {/* Sustainability Model */}
        <SustainabilitySection />
      </div>

      {/* Footer */}
      <FooterSection onOpenCollaboration={() => setIsModalOpen(true)} />

      {/* Interactive Collaboration Modal */}
      <CollaborationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
