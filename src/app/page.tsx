"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SplashScreen } from "@/components/SplashScreen";
import { LiquidNavbar } from "@/components/LiquidNavbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { HeroSection } from "@/components/sections/HeroSection";

const BackgroundTargetSection = dynamic(
  () => import("@/components/sections/BackgroundTargetSection").then((mod) => mod.BackgroundTargetSection),
  { ssr: true }
);
const CompanyProfileSection = dynamic(
  () => import("@/components/sections/CompanyProfileSection").then((mod) => mod.CompanyProfileSection),
  { ssr: true }
);
const ServicesSection = dynamic(
  () => import("@/components/sections/ServicesSection").then((mod) => mod.ServicesSection),
  { ssr: true }
);
const PortfolioSection = dynamic(
  () => import("@/components/sections/PortfolioSection").then((mod) => mod.PortfolioSection),
  { ssr: true }
);
const PricingSection = dynamic(
  () => import("@/components/sections/PricingSection").then((mod) => mod.PricingSection),
  { ssr: true }
);
const TestimonialSection = dynamic(
  () => import("@/components/sections/TestimonialSection").then((mod) => mod.TestimonialSection),
  { ssr: true }
);
const FooterSection = dynamic(
  () => import("@/components/sections/FooterSection").then((mod) => mod.FooterSection),
  { ssr: true }
);

const Logo3DBackground = dynamic(
  () => import("@/components/Logo3DBackground").then((mod) => mod.Logo3DBackground),
  { ssr: false, loading: () => null }
);
const CollaborationModal = dynamic(
  () => import("@/components/CollaborationModal").then((mod) => mod.CollaborationModal),
  { ssr: false, loading: () => null }
);
const ChatWidget = dynamic(
  () => import("@/components/ChatWidget").then((mod) => mod.ChatWidget),
  { ssr: false, loading: () => null }
);

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collabDraft, setCollabDraft] = useState<import("@/lib/receipt").CollabDraft | null>(null);
  const [loadChat, setLoadChat] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const id = (window as any).requestIdleCallback(() => setLoadChat(true), { timeout: 2000 });
        return () => (window as any).cancelIdleCallback(id);
      } else {
        const t = setTimeout(() => setLoadChat(true), 1200);
        return () => clearTimeout(t);
      }
    }
  }, []);

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

      {/* 3D Logo Background - follows cursor on desktop */}
      <React.Suspense fallback={null}>
        <Logo3DBackground />
      </React.Suspense>

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
      {isModalOpen && (
        <React.Suspense fallback={null}>
          <CollaborationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialDraft={collabDraft}
            onDraftConsumed={() => setCollabDraft(null)}
          />
        </React.Suspense>
      )}

      {/* AI chatbox pelanggan - lazy setelah idle */}
      <React.Suspense fallback={null}>
        {loadChat && <ChatWidget onAutofill={(d) => { setCollabDraft(d); setIsModalOpen(true); }} />}
      </React.Suspense>
    </main>
  );
}
