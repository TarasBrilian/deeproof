"use client";

import { Hero } from "@/components/landing/Hero";
import { IdentityVisualization } from "@/components/landing/IdentityVisualization";
import { Technology } from "@/components/landing/Technology";
import { CryptographicSpecs } from "@/components/landing/CryptographicSpecs";
import { Features } from "@/components/landing/Features";

export default function Home() {
  return (
    <main className="min-h-screen pt-24 pb-20 overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-60 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-void-black to-void-black" />

      <Hero />
      <IdentityVisualization />
      <Technology />
      <CryptographicSpecs />
      <Features />
    </main>
  );
}
