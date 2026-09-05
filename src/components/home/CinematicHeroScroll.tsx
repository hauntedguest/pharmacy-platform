"use client";

import { useRef, useEffect, useState } from "react";
import CinematicCanvas from "@/components/3d/CinematicCanvas";
import StoryOverlay from "./StoryOverlay";

export default function CinematicHeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress as the container moves through the viewport
      // 0 = container top at viewport top
      // 1 = container bottom at viewport bottom
      const scrollStart = 0;
      const scrollEnd = containerHeight - viewportHeight;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, (scrolled - scrollStart) / scrollEnd));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (prefersReducedMotion) {
    // Accessible fallback - static beautiful hero
    return (
      <section className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center px-6 z-10">
          <div className="mb-6 inline-block backdrop-blur-md bg-white/10 rounded-full px-4 py-2 border border-white/20">
            <span className="text-sm font-medium text-blue-100">
              Pharmaceutical Grade Formulation
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            Precision Medicine.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              Engineered for Human Potential.
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Cellular-level formulation. Clinical validation. Human results.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "400vh" }} // 4x viewport height for scroll range
    >
      {/* Fixed/Pinned Canvas & Overlay */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Dynamic Background - transitions from dark to light */}
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background:
              scrollProgress < 0.5
                ? `linear-gradient(to bottom, rgb(15, 23, 42), rgb(30, 58, 138), rgb(15, 23, 42))`
                : `linear-gradient(to bottom, rgb(241, 245, 249), rgb(226, 232, 240), rgb(248, 250, 252))`,
          }}
        />

        {/* 3D Canvas */}
        <CinematicCanvas scrollProgress={scrollProgress} />

        {/* Typography Overlay */}
        <StoryOverlay scrollProgress={scrollProgress} />

        {/* Scroll Indicator (only show in Act I) */}
        {scrollProgress < 0.15 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <div className="text-sm font-medium text-blue-200 uppercase tracking-wider">
              Scroll to explore
            </div>
            <svg
              className="w-6 h-6 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
