"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Footer from "@/components/sections/Footer";

const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />
});

export default function Home() {
  return (
    <main className="relative w-full bg-background selection:bg-primary selection:text-white">
      {/* 3D WebGL Background for Hero */}
      <div className="relative h-screen w-full">
        <HeroScene />
        <HeroSection />
      </div>
      
      {/* Content Sections */}
      <AboutSection />
      <ProjectsSection />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
