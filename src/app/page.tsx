"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
const SplashScreen = dynamic(() => import("@/components/SplashScreen").then(mod => mod.SplashScreen), { ssr: false });
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

const Logo3DBackground = dynamic(() => import("@/components/Logo3DBackground").then(mod => mod.Logo3DBackground), { ssr: false });
const CollaborationModal = dynamic(() => import("@/components/CollaborationModal").then(mod => mod.CollaborationModal), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/ChatWidget").then(mod => mod.ChatWidget), { ssr: false });

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [collabDraft, setCollabDraft] = useState<import("@/lib/receipt").CollabDraft | null>(null);

    // "Pilih {PAKET}" di Rate Card → buka form dengan paket sudah ter-prefill.
    const selectPackage = (packageId: string) => {
      setCollabDraft({ name: "", brandName: "", contact: "", budget: "", services: [packageId], notes: "" });
      setIsModalOpen(true);
    };

  return (
    <main className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
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
              <PricingSection onSelectPackage={selectPackage} />
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
        initialDraft={collabDraft}
        onDraftConsumed={() => setCollabDraft(null)}
      />

      {/* AI chatbox pelanggan — lazy setelah idle */}
      <ChatWidget onAutofill={(d) => { setCollabDraft(d); setIsModalOpen(true); }} />
    </main>
  );
}