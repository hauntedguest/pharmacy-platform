"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  Truck,
  Clock,
  Award,
  Pill,
  Heart,
  Activity,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  FlaskConical,
  Microscope,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductCard3D from "@/components/products/ProductCard3D";
import { getFeaturedProducts, type Product } from "@/lib/data/products";
import { brandConfig } from "@/lib/config/brand";

const CinematicHeroScroll = dynamic(
  () => import("@/components/home/CinematicHeroScroll"),
  { ssr: false }
);

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(getFeaturedProducts());
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const liveFeatured = (json.data as Product[]).filter((p) => p.featured);
            if (liveFeatured.length > 0) {
              setFeaturedProducts(liveFeatured);
            } else if (json.data.length > 0) {
              setFeaturedProducts((json.data as Product[]).slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch live featured products:", err);
      }
    }
    fetchLiveProducts();
  }, []);

  const categories = [
    {
      name: "Prescription",
      icon: Pill,
      href: "/products?category=prescription",
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-100",
      description: "Doctor-prescribed precision medications",
    },
    {
      name: "Supplements",
      icon: Heart,
      href: "/products?category=supplement",
      color: "from-teal-500/10 to-emerald-500/10 text-teal-600 border-teal-100",
      description: "Bioavailable wellness & cellular nutrition",
    },
    {
      name: "Medical Devices",
      icon: Activity,
      href: "/products?category=medical-device",
      color: "from-cyan-500/10 to-sky-500/10 text-cyan-600 border-cyan-100",
      description: "Clinical-grade diagnostic monitors",
    },
    {
      name: "OTC Medications",
      icon: Stethoscope,
      href: "/products?category=otc",
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-100",
      description: "Targeted over-the-counter therapeutic relief",
    },
  ];

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: "Licensed Pharmacy",
      description: `State Board Lic. ${brandConfig.legal.pharmacyLicense}`,
    },
    {
      icon: Truck,
      title: "Cold-Chain Shipping",
      description: "Temperature-controlled priority delivery",
    },
    {
      icon: Clock,
      title: "24/7 Clinical Support",
      description: "Licensed PharmDs on-demand",
    },
    {
      icon: Award,
      title: "100% Verified Purity",
      description: "Third-party analytical batch testing",
    },
  ];

  const faqs = [
    {
      q: "How does prescription verification work?",
      a: "Our automated intake system connects directly to your prescriber's EMR or allows you to securely upload an Rx image. A licensed clinical pharmacist reviews and verifies each order within 15 minutes.",
    },
    {
      q: "What makes your formulations pharmaceutical grade?",
      a: "All medications and nutraceuticals undergo HPLC purity assays, dissolution testing, and micro-encapsulation to guarantee maximum cellular bioavailability and zero contaminants.",
    },
    {
      q: "How fast is delivery for critical medications?",
      a: "We offer same-day refrigerated courier delivery in select metropolitan areas and next-morning priority cold-chain shipping nationwide.",
    },
    {
      q: "Can I consult with a pharmacist before ordering?",
      a: "Yes. Our licensed PharmDs are available 24/7 via private video consultation or direct phone line at no extra cost.",
    },
  ];

  return (
    <div className="w-full bg-slate-50/50">
      {/* 4-Act Cinematic Scroll Experience */}
      <CinematicHeroScroll />

      {/* Trust Credentials Bar */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 border border-blue-100 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-0.5">{badge.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="info" className="mb-3">
                Curated Therapeutics
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Explore by Clinical Category
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-md mt-2 md:mt-0">
              Formulations organized by therapeutic mechanism and biological target.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href={category.href} className="group">
                  <div className="h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-xs font-semibold text-blue-600 gap-1">
                      Browse Category
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase with 3D Tilt Cards */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <Badge variant="success" className="mb-3">
                Flagship Formulations
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Featured Clinical Products
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Engineered with high bioavailability and maximum active purity.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex mt-4 md:mt-0">
              <Link href="/products">
                View Full Catalogue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/products">View Full Catalogue</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Scientific Commitment & Quality Pillars */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              The MediCare Purity Standard
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Purity Without Compromise
            </h2>
            <p className="text-base text-blue-200">
              Every compound is rigorously analyzed at molecular precision before release.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-6">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">HPLC Chromatography</h3>
              <p className="text-sm text-blue-200 leading-relaxed mb-4">
                High-performance liquid chromatography ensures zero heavy metals, microbial contaminants, or synthetic binders.
              </p>
              <div className="text-xs font-mono text-cyan-300">99.98% Isolate Purity</div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 mb-6">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Micro-Encapsulation</h3>
              <p className="text-sm text-blue-200 leading-relaxed mb-4">
                Enteric phospholipid liposomes bypass destructive stomach acid for targeted intestinal cellular absorption.
              </p>
              <div className="text-xs font-mono text-teal-300">4.2x Faster Bio-uptake</div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">cGMP Validated</h3>
              <p className="text-sm text-blue-200 leading-relaxed mb-4">
                Manufactured strictly in FDA-registered cleanroom facilities adhering to current Good Manufacturing Practices.
              </p>
              <div className="text-xs font-mono text-indigo-300">ISO 9001 Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="info" className="mb-3">
              Patient Guidance
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500">
              Clear answers regarding prescription protocols, safety standards, and delivery.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
                      openFaq === index ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Action Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Ready for Precision Healthcare?
              </h2>
              <p className="text-blue-100 text-base max-w-xl">
                Consult with our clinical pharmacists today or explore our precision pharmaceutical catalogue.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                <Link href="/products">
                  Shop Formulations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/contact">Consult a Pharmacist</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
