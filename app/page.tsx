"use client";

import PillNav from "@/components/PillNav";
import Logo3D from "@/components/Logo3d";
import VideoBackground from "@/components/VideoBackground";
import Footer from "@/components/Footer";
import EpisodesSection from "@/components/EpisodesSection";
import SpectraStepperForm from "@/components/SpectraStepperForm";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      event.preventDefault();
      const el = document.getElementById(href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="font-sans min-h-screen w-full bg-black text-white relative overflow-x-hidden">
      {/* Fixed Navigation */}
      <div className="fixed top-0 z-50 w-full flex justify-center pt-6 pointer-events-auto">
        <PillNav
          logo="/w.png"
          logoAlt="spectra logo"
          items={[
            { label: "home", href: "#home" },
            { label: "mini app", href: "#miniapp" },
            { label: "episodes", href: "#episodes" },    
            { label: "contact", href: "#contact" },
          ]}
          activeHref="#home"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000"
          pillColor="#fff"
          hoveredPillTextColor="#000"
          pillTextColor="#000"
        />
      </div>

      {/* Fullscreen Video Background — plays, loops, no sound */}
      <VideoBackground />

      {/* Interactive 3D Logo — user can drag, rotate, pinch, AR */}
      <Logo3D />

      <main className="w-full overflow-x-hidden relative z-10">
        {/* EMPTY HOME SECTION */}
        <section id="home" className="h-screen" />

        {/* EMPTY MINI APP SECTION */}
        <section id="miniapp" className="h-screen" />

        <EpisodesSection />

        {/* CONTACT SECTION */}
        <section
          id="contact"
          className="min-h-screen flex items-center justify-center py-32 px-4 overflow-x-hidden relative"
          style={{
            background: `
              radial-gradient(circle at 50% 40%, rgba(255,255,255,0.08) 0%, transparent 60%),
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
              #000000
            `,
            boxShadow: "inset 0 0 150px rgba(0,0,0,0.9)",
          }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.01) 10px, rgba(255,255,255,0.01) 20px)",
            }}
          />
          <div className="w-full max-w-screen-2xl mx-auto relative z-10">
            <SpectraStepperForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}