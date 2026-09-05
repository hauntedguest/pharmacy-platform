import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Heart,
  Award,
  Users,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Pill,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";

export const metadata = {
  title: "About Us | Clinical Precision & Cold-Chain Pharmacy in India",
  description:
    "Learn about MediCare Plus India - our licensed pharmacy headquarters in Mumbai, nationwide cold-chain delivery network across 19,000+ PIN codes, and CDSCO compliance.",
};

export default function AboutPage() {
  const pillars = [
    {
      title: "100% Genuine Direct Formulations",
      desc: "Every medicine is sourced directly from CDSCO-licensed pharmaceutical manufacturers including Cipla, Sun Pharma, Dr. Reddy's, and GSK with tamper-evident seals.",
      icon: ShieldCheck,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-100",
    },
    {
      title: "Active Cold-Chain Storage (2°C - 8°C)",
      desc: "Biologics, vaccines, and insulin are maintained in climate-controlled temperature zones monitored by real-time IoT sensors from vault to doorstep.",
      icon: Truck,
      color: "from-teal-500/10 to-emerald-500/10 text-teal-600 border-teal-100",
    },
    {
      title: "Registered Pharmacist Supervision",
      desc: "Every Schedule H and H1 order is verified by a state-registered clinical pharmacist checking RMP doctor credentials, interactions, and therapeutic safety.",
      icon: Award,
      color: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-100",
    },
    {
      title: "19,000+ Indian PIN Codes Covered",
      desc: "From metro centers (Mumbai, Delhi NCR, Bengaluru, Hyderabad) to tier-2 & tier-3 districts, our dedicated healthcare logistics network ensures rapid express delivery.",
      icon: MapPin,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            India&apos;s Next-Generation Digital Pharmacy
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Setting the Gold Standard for Pharmaceutical Care in India
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Headquartered at the BKC Innovation Hub in Mumbai, {brandConfig.company.name} combines
            hospital-grade cold-chain infrastructure with state-of-the-art digital dispensing to bring genuine medicines to every Indian family.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} border flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate & Regulatory Credentials */}
        <div className="bg-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs uppercase font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Statutory Regulatory Adherence
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Licensed by the Food and Drugs Administration, Maharashtra
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We operate under Retail and Wholesale Drug Licenses Form 20 & 21 (License:{" "}
              <strong className="text-white font-mono">{brandConfig.legal.pharmacyLicense}</strong>
              ) granted under the Drugs and Cosmetics Rules 1945. All nutritional supplements comply with
              FSSAI Central Licensing ({brandConfig.legal.fssaiLicense}).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <p className="text-slate-400">Headquarters</p>
                <p className="font-bold text-white mt-0.5">BKC Hub, Mumbai</p>
              </div>
              <div>
                <p className="text-slate-400">Pharmacy Council</p>
                <p className="font-bold text-white mt-0.5">MSPC Registered</p>
              </div>
              <div>
                <p className="text-slate-400">Toll-Free Helpline</p>
                <p className="font-bold text-teal-300 mt-0.5">{brandConfig.contact.phone}</p>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
                <Link href="/license">View Official Licenses & Certificates ↗</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 text-center shadow-xs space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Experience Precision Healthcare Today</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
            Order your doctor-prescribed medications or daily wellness formulations with guaranteed cold-chain integrity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-blue-500/20"
            >
              <Link href="/products">
                Browse Medicine Catalogue <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-xs font-semibold border-gray-300"
            >
              <Link href="/prescriptions/upload">Upload Prescription (Rx)</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
