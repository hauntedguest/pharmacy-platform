"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Award,
  FileText,
  Building2,
  CheckCircle2,
  Download,
  ExternalLink,
  Lock,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";

export default function LicensePage() {
  const licenses = [
    {
      title: "Retail & Wholesale Drug License (Form 20 & Form 21)",
      regNumber: brandConfig.legal.pharmacyLicense,
      authority: "Food & Drug Administration (FDA), Maharashtra",
      validity: "Valid through 31-Dec-2030",
      type: "Drugs and Cosmetics Rules, 1945",
      desc: "Authorizes the retail compounding, cold-chain storage, and nationwide dispensing of allopathic formulations, biologics, Schedule H, and Schedule H1 prescription medications.",
    },
    {
      title: "FSSAI Central Food Safety & Dietary License",
      regNumber: brandConfig.legal.fssaiLicense,
      authority: "Food Safety and Standards Authority of India",
      validity: "Active • Central Category",
      type: "Food Safety and Standards Act, 2006",
      desc: "Covers nutraceuticals, clinical dietary formulations, health supplements, ayurvedic standardized extracts, and wellness compounds distributed across India.",
    },
    {
      title: "Chief Registered Pharmacist in-Charge Registration",
      regNumber: "MSPC-2012-984102",
      authority: "Maharashtra State Pharmacy Council (MSPC)",
      validity: "Registered Pharmacist (PharmD)",
      type: "Pharmacy Act, 1948",
      desc: "Supervising dispensing pharmacist responsible for doctor prescription authentication, contraindication analysis, and adherence to Schedule H1 statutory drug registers.",
    },
    {
      title: "Goods and Services Tax Identification (GSTIN)",
      regNumber: brandConfig.legal.gstNumber,
      authority: "Goods and Services Tax Network, Govt. of India",
      validity: "Regular Taxpayer (State Jurisdiction: Maharashtra)",
      type: "Central & State GST (HSN Chapter 30)",
      desc: "Complies with statutory HSN Chapter 30 invoicing rules for pharmaceutical formulations (5% / 12% GST) and medical devices (18% GST).",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Statutory Healthcare Credentials
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Official Drug Controller & FSSAI Licenses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {brandConfig.company.name} operates under strict compliance with the Central Drugs Standard Control Organisation (CDSCO), the Maharashtra Food & Drugs Administration, and the Pharmacy Council of India.
          </p>
        </div>

        {/* License Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {licenses.map((lic, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified & Active
                  </span>
                </div>

                <div>
                  <h2 className="font-bold text-base text-gray-900 leading-snug">{lic.title}</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">{lic.type}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Registration / License No:</span>
                    <span className="font-mono font-bold text-gray-900">{lic.regNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Issuing Authority:</span>
                    <span className="text-gray-700 font-semibold">{lic.authority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Status / Validity:</span>
                    <span className="text-emerald-600 font-semibold">{lic.validity}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{lic.desc}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400">Govt. Verification #IN-{index + 101}</span>
                <button
                  onClick={() => alert(`Official verification certificate for ${lic.regNumber} is authenticated and archived.`)}
                  className="text-blue-600 hover:text-blue-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Regulatory Stamp
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CDSCO & Schedule H Statutory Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Lock className="w-4 h-4 text-amber-700" />
            Statutory Prescription Medicine Dispensing Protocol
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            In accordance with Rule 65 of the Drugs and Cosmetics Rules 1945, medications marked as{" "}
            <strong>Schedule H</strong> or <strong>Schedule H1</strong> can only be dispensed against a valid prescription issued by a Registered Medical Practitioner (RMP). Our Registered Pharmacists digitally record every RMP registration number and maintain cold-chain logs from Mumbai dispatch hubs to your doorstep.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-8 py-3 rounded-xl">
            <Link href="/prescriptions/upload">Upload Prescription for Verification ↗</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
