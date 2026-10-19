import React from "react";
import dynamic from "next/dynamic";
const SplashScreen = dynamic(
  () => import("@/components/SplashScreen").then((m) => m.SplashScreen)
);
const LiquidNavbar = dynamic(
  () => import("@/components/LiquidNavbar").then((m) => m.LiquidNavbar)
);
const ScrollProgress = dynamic(
  () => import("@/components/ScrollProgress").then((m) => m.ScrollProgress)
);
import { HeroSection } from "@/components/sections/HeroSection";
const CollaborationManager = dynamic(
  () => import("@/components/CollaborationManager").then((m) => m.CollaborationManager)
);
const Logo3DBackground = dynamic(
  () => import("@/components/Logo3DBackground").then((m) => m.Logo3DBackground)
);

const BackgroundTargetSection = dynamic(
  () => import("@/components/sections/BackgroundTargetSection").then((m) => m.BackgroundTargetSection)
);
const CompanyProfileSection = dynamic(
  () => import("@/components/sections/CompanyProfileSection").then((m) => m.CompanyProfileSection)
);
import { ServicesSection } from "@/components/sections/ServicesSection";
const PortfolioSection = dynamic(
  () => import("@/components/sections/PortfolioSection").then((m) => m.PortfolioSection)
);
const PricingSection = dynamic(
  () => import("@/components/sections/PricingSection").then((m) => m.PricingSection)
);
const TestimonialSection = dynamic(
  () => import("@/components/sections/TestimonialSection").then((m) => m.TestimonialSection)
);
const FooterSection = dynamic(
  () => import("@/components/sections/FooterSection").then((m) => m.FooterSection)
);

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
      {/* Full-Length Ambient Background Artwork */}
      <div className="site-bg-overlay" aria-hidden="true" />

      {/* Faux-3D Perspective Initial Splash Screen */}
      <SplashScreen />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* 3D Logo Background - follows cursor on desktop */}
      <React.Suspense fallback={null}>
        <Logo3DBackground />
      </React.Suspense>

      {/* Floating Liquid Glass Navbar */}
      <LiquidNavbar />

      {/* Hero Section with Kinetic Typography & Parallax */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* Proposal Poin 3: Background & Target Market */}
      <section data-cv="true" className="relative z-10">
        <React.Suspense fallback={null}>
          <BackgroundTargetSection />
        </React.Suspense>
      </section>

      {/* Proposal Poin 4 (Part 1): Profile, Visi, Misi, Filosofi */}
      <section data-cv="true" className="relative z-10">
        <React.Suspense fallback={null}>
          <CompanyProfileSection />
        </React.Suspense>
      </section>

      {/* Creative & Tech Services */}
      <section data-cv="true" className="relative z-10">
        <ServicesSection />
      </section>

      {/* Karya & Portfolio */}
      <section data-cv="true" className="relative z-10">
        <React.Suspense fallback={null}>
          <PortfolioSection />
        </React.Suspense>
      </section>

      {/* Pricing Catalog */}
      <section data-cv="true" className="relative z-10">
        <React.Suspense fallback={null}>
          <PricingSection />
        </React.Suspense>
      </section>

      {/* Client Testimonials */}
      <section data-cv="true" className="relative z-10">
        <React.Suspense fallback={null}>
          <TestimonialSection />
        </React.Suspense>
      </section>

      {/* Footer & Collaboration Closing */}
      <section data-cv="true" className="relative z-10">
        <React.Suspense fallback={null}>
          <FooterSection />
        </React.Suspense>
      </section>

      {/* Interactive Collaboration Modal & Chat Manager */}
      <CollaborationManager />
    </main>
  );
}
