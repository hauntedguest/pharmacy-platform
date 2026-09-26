"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Microscope, FlaskConical } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface StoryOverlayProps {
  scrollProgress: number;
}

export default function StoryOverlay({ scrollProgress }: StoryOverlayProps) {
  // Smooth progressive opacity calculations for the 4 Acts
  const act1Opacity =
    scrollProgress < 0.22
      ? 1
      : Math.max(0, 1 - (scrollProgress - 0.22) / 0.08);

  const act2Opacity =
    scrollProgress >= 0.22 && scrollProgress < 0.52
      ? Math.min(1, (scrollProgress - 0.22) / 0.08) *
        Math.max(0, 1 - (scrollProgress - 0.44) / 0.08)
      : 0;

  const act3Opacity =
    scrollProgress >= 0.48 && scrollProgress < 0.76
      ? Math.min(1, (scrollProgress - 0.48) / 0.08) *
        Math.max(0, 1 - (scrollProgress - 0.68) / 0.08)
      : 0;

  const act4Opacity =
    scrollProgress >= 0.72
      ? Math.min(1, (scrollProgress - 0.72) / 0.08)
      : 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6 md:px-12 select-none">
      {/* ================= ACT I: The Precision Monolith (0% - 25%) ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none"
        style={{
          opacity: act1Opacity,
          transform: `translateY(${(1 - act1Opacity) * -20}px)`,
          visibility: act1Opacity > 0.01 ? "visible" : "hidden",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-blue-500/10">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Proprietary D2C Pharmaceutical Laboratory</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight mb-4 max-w-5xl">
          Precision Medicine.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-400">
            Engineered for Purity.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          Direct-from-lab bioequivalent formulations with 99.8% isolate purity, HPLC batch certification, and real-time cold-chain delivery.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/30 font-bold px-7">
            <Link href="/products">
              Explore Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 rounded-2xl backdrop-blur-md">
            <Link href="/prescriptions/upload">Upload Prescription</Link>
          </Button>
        </div>
      </div>

      {/* ================= ACT II: Cellular Deconstruction (25% - 50%) ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none"
        style={{
          opacity: act2Opacity,
          transform: `translateY(${(1 - act2Opacity) * -20}px)`,
          visibility: act2Opacity > 0.01 ? "visible" : "hidden",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-md">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Phase II: Micro-Particle Dispersion</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6 max-w-4xl">
          Formulated at the
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-400">
            Cellular Bio-Absorption Level.
          </span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl w-full px-4 pointer-events-auto">
          <div className="backdrop-blur-md bg-slate-900/60 rounded-2xl p-5 border border-white/15 shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-cyan-300 mb-1">99.8%</div>
            <div className="text-xs text-blue-200 font-medium">Active Bioavailability</div>
          </div>
          <div className="backdrop-blur-md bg-slate-900/60 rounded-2xl p-5 border border-white/15 shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-teal-300 mb-1">0.001µm</div>
            <div className="text-xs text-blue-200 font-medium">Micro-Encapsulation</div>
          </div>
          <div className="col-span-2 sm:col-span-1 backdrop-blur-md bg-slate-900/60 rounded-2xl p-5 border border-white/15 shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-indigo-300 mb-1">4.2x</div>
            <div className="text-xs text-blue-200 font-medium">Faster Cellular Uptake</div>
          </div>
        </div>
      </div>

      {/* ================= ACT III: Purity & Analytical Validation (50% - 75%) ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none"
        style={{
          opacity: act3Opacity,
          transform: `translateY(${(1 - act3Opacity) * -20}px)`,
          visibility: act3Opacity > 0.01 ? "visible" : "hidden",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4 shadow-sm">
          <Microscope className="w-3.5 h-3.5 text-blue-600" />
          <span>Phase III: Analytical Quality Assurance</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4 max-w-3xl">
          Clinically Validated.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600">
            Batch-Certified Purity.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-6">
          Every batch passes rigorous HPLC assay chromatography, heavy metal screening, and microbial sterility protocols prior to release.
        </p>

        <div className="flex flex-wrap gap-2.5 justify-center max-w-2xl px-4 pointer-events-auto">
          {["CDSCO Licensed", "WHO-GMP Validated", "HPLC Assayed", "Cold-Chain IoT Monitored"].map(
            (badge) => (
              <div
                key={badge}
                className="bg-white/95 rounded-full px-4 py-2 border border-gray-200 shadow-sm text-xs font-bold text-gray-800 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>{badge}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* ================= ACT IV: The Pharmacy Ecosystem (75% - 100%) ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none"
        style={{
          opacity: act4Opacity,
          transform: `translateY(${(1 - act4Opacity) * -20}px)`,
          visibility: act4Opacity > 0.01 ? "visible" : "hidden",
        }}
      >
        <Badge variant="success" className="mb-4">
          Phase IV: Enterprise D2C Ecosystem
        </Badge>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4 max-w-3xl">
          Experience Next-Gen
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
            Healthcare Commerce.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-xl mx-auto">
          Explore over 28 lab-verified pharmaceutical compounds with real-time inventory and clinical pharmacist consultation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
          <Button asChild size="lg" variant="primary" className="rounded-2xl px-6 font-bold shadow-lg shadow-blue-500/20">
            <Link href="/products">
              Shop All Formulations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-2xl px-6 font-bold bg-white">
            <Link href="/interaction-checker">Check Drug Interactions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
