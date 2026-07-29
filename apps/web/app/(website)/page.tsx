"use client";

import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { EcosystemSection } from "@/components/ecosystem-section";
import { FeatureGrid } from "@/components/feature-grid";
import { WorkflowSection } from "@/components/workflow-section";
import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <EcosystemSection />
        <FeatureGrid />
        <WorkflowSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
