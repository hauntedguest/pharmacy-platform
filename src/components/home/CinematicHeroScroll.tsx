"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Play, Pause, ChevronDown, Sparkles } from "lucide-react";
import CinematicCanvas from "@/components/3d/CinematicCanvas";
import StoryOverlay from "./StoryOverlay";

const ACTS = [
  { id: 0, label: "Precision Structure", shortLabel: "Structure", progress: 0.05 },
  { id: 1, label: "Cellular Dispersion", shortLabel: "Dispersion", progress: 0.38 },
  { id: 2, label: "HPLC Batch QA", shortLabel: "HPLC QA", progress: 0.62 },
  { id: 3, label: "D2C Ecosystem", shortLabel: "Ecosystem", progress: 0.88 },
];

export default function CinematicHeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Check reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Smooth 60fps Lerp loop for scroll progress
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      // Smooth dampening factor
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.12;
        setScrollProgress(currentProgressRef.current);
      } else if (currentProgressRef.current !== targetProgressRef.current) {
        currentProgressRef.current = targetProgressRef.current;
        setScrollProgress(currentProgressRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Native Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (isAutoPlaying || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollRange = containerHeight - viewportHeight;

      if (scrollRange <= 0) return;

      const scrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / scrollRange));
      targetProgressRef.current = rawProgress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAutoPlaying]);

  // Auto-play timeline loop
  useEffect(() => {
    if (!isAutoPlaying) return;

    let startTime = performance.now();
    const duration = 14000; // 14 seconds full tour

    const autoPlayInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = (elapsed % duration) / duration;
      targetProgressRef.current = progress;
    }, 16);

    return () => clearInterval(autoPlayInterval);
  }, [isAutoPlaying]);

  // Jump to specific act
  const jumpToAct = useCallback((actProgress: number) => {
    setIsAutoPlaying(false);
    if (!containerRef.current) return;

    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollRange = containerHeight - viewportHeight;
    const targetY = containerRef.current.offsetTop + actProgress * scrollRange;

    window.scrollTo({ top: targetY, behavior: "smooth" });
    targetProgressRef.current = actProgress;
  }, []);

  if (prefersReducedMotion) {
    return (
      <section className="relative w-full min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center px-6 z-10">
          <div className="mb-6 inline-block backdrop-blur-md bg-blue-500/20 rounded-full px-4 py-1.5 border border-blue-400/30">
            <span className="text-xs font-semibold text-blue-200">
              Pharmaceutical Grade Formulation
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
            Precision Medicine.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              Engineered for Human Potential.
            </span>
          </h1>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
            Direct-from-lab bioequivalent formulations with 99.8% isolate purity and cold-chain integrity.
          </p>
        </div>
      </section>
    );
  }

  // Current active act index
  const currentActIndex =
    scrollProgress < 0.25 ? 0 : scrollProgress < 0.5 ? 1 : scrollProgress < 0.75 ? 2 : 3;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "300vh" }} // 3x viewport height for optimal scroll pacing
    >
      {/* Pinned Sticky Viewport with Dynamic Mobile Viewport Support */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden bg-slate-950">
        {/* Dynamic Theme Gradient Background */}
        <div
          className="absolute inset-0 transition-colors duration-700 pointer-events-none"
          style={{
            background:
              scrollProgress < 0.5
                ? `radial-gradient(ellipse at 50% 40%, rgba(30, 58, 138, 0.45) 0%, rgba(15, 23, 42, 0.95) 75%)`
                : `radial-gradient(ellipse at 50% 40%, rgba(241, 245, 249, 0.98) 0%, rgba(226, 232, 240, 0.95) 80%)`,
          }}
        />

        {/* Lightweight 3D Canvas (60+ FPS Hardware-Accelerated) */}
        <CinematicCanvas scrollProgress={scrollProgress} />

        {/* Story Typography & Feature Overlay */}
        <StoryOverlay scrollProgress={scrollProgress} />

        {/* Floating Storyline Navigator & Showcase Controls */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl text-xs max-w-[96vw] overflow-x-auto scrollbar-none">
          {/* Auto-Play Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full font-bold transition-all shrink-0 text-[11px] sm:text-xs ${
              isAutoPlaying
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title={isAutoPlaying ? "Pause 3D Tour" : "Auto-Play 3D Tour"}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden xs:inline">Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
                <span>3D Tour</span>
              </>
            )}
          </button>

          <div className="w-px h-3.5 bg-white/20 shrink-0" />

          {/* Act Progress Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {ACTS.map((act) => (
              <button
                key={act.id}
                onClick={() => jumpToAct(act.progress)}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                  currentActIndex === act.id
                    ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/40"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="hidden sm:inline">{act.label}</span>
                <span className="sm:hidden">{act.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Initial Scroll Prompt (Act I Only) */}
        {scrollProgress < 0.12 && !isAutoPlaying && (
          <div className="absolute bottom-14 sm:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-200/80 animate-bounce pointer-events-none">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase">
              Scroll or Tap 3D Tour to Explore
            </span>
            <ChevronDown className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-300" />
          </div>
        )}
      </div>
    </div>
  );
}
