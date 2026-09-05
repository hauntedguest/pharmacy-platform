"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Phone,
  MessageSquare,
  CheckCircle2,
  Pill,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { mockProducts } from "@/lib/data/products";
import { brandConfig } from "@/lib/config/brand";

interface InteractionResult {
  severity: "High" | "Moderate" | "Minor" | "Safe";
  title: string;
  drugsInvolved: string[];
  mechanism: string;
  clinicalAdvice: string;
  foodAdvisory?: string;
}

// Clinical interaction knowledge base
const clinicalInteractions: InteractionResult[] = [
  {
    severity: "High",
    title: "NSAID & ARB Antihypertensive Contraindication",
    drugsInvolved: ["Telmisartan", "Diclofenac"],
    mechanism:
      "Concomitant use of NSAIDs with Angiotensin II Receptor Blockers may attenuate the antihypertensive effect of Telmisartan and significantly increase the risk of acute renal deterioration and hyperkalemia.",
    clinicalAdvice:
      "Avoid frequent oral NSAIDs. If pain relief is necessary, use MediCare Plus Paracetamol 650mg or consult our clinical pharmacist for topical alternatives.",
    foodAdvisory: "Avoid high-potassium salt substitutes while on Telmisartan.",
  },
  {
    severity: "Moderate",
    title: "Proton Pump Inhibitor & Absorption Modification",
    drugsInvolved: ["Pantoprazole", "Vitamin D3"],
    mechanism:
      "Prolonged gastric acid suppression by Pantoprazole may mildly reduce the intestinal absorption of dietary calcium and fat-soluble vitamins.",
    clinicalAdvice:
      "Take Pantoprazole in the morning 30 minutes before breakfast, and schedule MediCare Plus D3 Max with a fat-rich meal (lunch or dinner) with an 8-hour separation.",
    foodAdvisory: "Take Vitamin D3 with whole milk, curd, or nuts for optimal micellar absorption.",
  },
  {
    severity: "Moderate",
    title: "High-Potency Omega-3 & Anti-Platelet Synergy",
    drugsInvolved: ["Omega-3", "Aspirin"],
    mechanism:
      "High doses of EPA/DHA (over 1000mg/day) possess mild anti-platelet aggregation properties which can have additive bleeding effects with antiplatelet drugs.",
    clinicalAdvice:
      "Maintain EPA/DHA dosage under clinical supervision and inform your surgeon prior to any elective dental or surgical procedures.",
    foodAdvisory: "Take with meals to eliminate fishy reflux and optimize lipid absorption.",
  },
  {
    severity: "Minor",
    title: "Probiotic Timing & Gastric Acid Sensitivity",
    drugsInvolved: ["FloraMax Probiotic", "Pantoprazole"],
    mechanism:
      "Although FloraMax uses delayed-release capsules, administering probiotics during peak PPI acid-suppression windows improves bacterial colonization in the small intestine.",
    clinicalAdvice:
      "Safe and synergistic combination. Take Probiotics 20 minutes before breakfast with a lukewarm glass of water.",
  },
  {
    severity: "Safe",
    title: "No Adverse Pharmacological Interaction Detected",
    drugsInvolved: ["Paracetamol", "Vitamin C"],
    mechanism:
      "No pharmacokinetic or pharmacodynamic antagonism. Vitamin C supports immune synthesis while Paracetamol modulates central prostaglandin thermoregulation.",
    clinicalAdvice:
      "Safe for concurrent administration according to recommended dosage guidelines.",
  },
];

export default function InteractionCheckerPage() {
  const [selectedMeds, setSelectedMeds] = useState<string[]>([
    "MediCare Plus CardioGuard Telmisartan 40mg",
    "MediCare Plus DeepRelief Diclofenac Active Gel 50g",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customMed, setCustomMed] = useState("");

  const handleAddProduct = (name: string) => {
    if (!selectedMeds.includes(name) && selectedMeds.length < 5) {
      setSelectedMeds([...selectedMeds, name]);
      setSearchTerm("");
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMed.trim() && !selectedMeds.includes(customMed.trim()) && selectedMeds.length < 5) {
      setSelectedMeds([...selectedMeds, customMed.trim()]);
      setCustomMed("");
    }
  };

  const handleRemove = (name: string) => {
    setSelectedMeds(selectedMeds.filter((m) => m !== name));
  };

  // Evaluate interactions
  const evaluatedInteractions = clinicalInteractions.filter((rule) => {
    const hasDrug1 = selectedMeds.some((m) =>
      m.toLowerCase().includes(rule.drugsInvolved[0].toLowerCase())
    );
    const hasDrug2 = selectedMeds.some((m) =>
      m.toLowerCase().includes(rule.drugsInvolved[1]?.toLowerCase() || "")
    );
    return hasDrug1 && hasDrug2;
  });

  const hasHighRisk = evaluatedInteractions.some((i) => i.severity === "High");

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Clinical Pharmacology Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Drug & Formulation Interaction Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Check safety contraindications, absorption timing, and food advisories between your prescribed MediCare Plus medications and daily supplements.
          </p>
        </div>

        {/* Main Checker Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Medication Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-600" />
                  Your Active Medicine List ({selectedMeds.length}/5)
                </h2>
                {selectedMeds.length > 0 && (
                  <button
                    onClick={() => setSelectedMeds([])}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Selected Pills */}
              <div className="space-y-2">
                {selectedMeds.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4 italic">
                    Add at least 2 formulations below to check clinical interactions.
                  </p>
                ) : (
                  selectedMeds.map((med) => (
                    <div
                      key={med}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-gray-800 animate-in fade-in"
                    >
                      <span className="font-semibold truncate max-w-[85%]">{med}</span>
                      <button
                        onClick={() => handleRemove(med)}
                        className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Add from MediCare Plus Catalog */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Select MediCare Plus Formulation
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {mockProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAddProduct(p.name)}
                      disabled={selectedMeds.includes(p.name) || selectedMeds.length >= 5}
                      className={`text-left text-[11px] p-2 rounded-xl border transition-all flex items-center justify-between ${
                        selectedMeds.includes(p.name)
                          ? "bg-blue-50/50 border-blue-200 text-blue-800 font-semibold cursor-default"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <Plus className="w-3 h-3 shrink-0 ml-1 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom / Other Medicine */}
              <form onSubmit={handleAddCustom} className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Or Add Other Prescription Drug / Food
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customMed}
                    onChange={(e) => setCustomMed(e.target.value)}
                    placeholder="e.g. Aspirin, Warfarin, Metformin..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                  <Button
                    type="submit"
                    disabled={!customMed.trim() || selectedMeds.length >= 5}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3"
                  >
                    Add
                  </Button>
                </div>
              </form>
            </div>

            {/* Pharmacist Consultation Help */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white space-y-3 shadow-md">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-300" />
                Unsure about your dosage schedule?
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Our in-house clinical pharmacists are available 24x7 to review your full prescription history and optimize your medicine timings.
              </p>
              <div className="flex gap-2 pt-1">
                <a
                  href={`https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-white text-blue-700 font-bold text-xs text-center hover:bg-blue-50 transition-colors"
                >
                  WhatsApp Pharmacist
                </a>
                <a
                  href={`tel:${brandConfig.contact.phone}`}
                  className="py-2 px-3 rounded-xl bg-blue-500/30 text-white font-bold text-xs hover:bg-blue-500/40 transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call 1800
                </a>
              </div>
            </div>
          </div>

          {/* Right: Clinical Analysis Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Summary Banner */}
            <div
              className={`p-6 rounded-3xl border shadow-xs transition-all ${
                selectedMeds.length < 2
                  ? "bg-white border-gray-200"
                  : hasHighRisk
                  ? "bg-rose-50 border-rose-200"
                  : evaluatedInteractions.length > 0
                  ? "bg-amber-50 border-amber-200"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    selectedMeds.length < 2
                      ? "bg-gray-100 text-gray-500"
                      : hasHighRisk
                      ? "bg-rose-600 text-white"
                      : evaluatedInteractions.length > 0
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {selectedMeds.length < 2 ? (
                    <Info className="w-6 h-6" />
                  ) : hasHighRisk ? (
                    <ShieldAlert className="w-6 h-6" />
                  ) : evaluatedInteractions.length > 0 ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-gray-900">
                    {selectedMeds.length < 2
                      ? "Select Medicines to Begin Analysis"
                      : hasHighRisk
                      ? "Potential Contraindication Detected"
                      : evaluatedInteractions.length > 0
                      ? "Precautions & Timing Adjustments Recommended"
                      : "All Formulations are Compatible & Safe"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedMeds.length < 2
                      ? "Add at least two medications, vitamins, or supplements from your routine to view pharmacological synergy and safety recommendations."
                      : hasHighRisk
                      ? "One or more combinations require doctor supervision or dose staggering to prevent adverse reactions."
                      : evaluatedInteractions.length > 0
                      ? "Review the clinical timing advice below to maximize therapeutic absorption."
                      : "No known adverse pharmacological or metabolic contraindications detected between the selected items."}
                  </p>
                </div>
              </div>
            </div>

            {/* Interaction Cards List */}
            <div className="space-y-4">
              {evaluatedInteractions.length > 0 ? (
                evaluatedInteractions.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 animate-in fade-in duration-300"
                  >
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            item.severity === "High"
                              ? "bg-rose-50 border-rose-200 text-rose-700"
                              : item.severity === "Moderate"
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-blue-50 border-blue-200 text-blue-700"
                          }`}
                        >
                          {item.severity} Caution
                        </span>
                        <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <p className="text-gray-400 font-bold uppercase text-[10px]">
                          Pharmacological Mechanism
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-0.5">{item.mechanism}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-blue-900 space-y-1">
                        <p className="font-bold flex items-center gap-1.5 text-xs text-blue-950">
                          <Zap className="w-3.5 h-3.5 text-blue-600" />
                          Clinical Pharmacist Recommendation
                        </p>
                        <p className="text-xs text-blue-900 leading-relaxed">{item.clinicalAdvice}</p>
                      </div>

                      {item.foodAdvisory && (
                        <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 text-amber-900 text-xs">
                          <strong className="text-amber-950">Dietary & Absorption Note:</strong>{" "}
                          {item.foodAdvisory}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : selectedMeds.length >= 2 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3 shadow-xs">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base text-gray-900">
                    No Clinical Antagonisms Found
                  </h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    The chosen MediCare Plus formulations can be taken alongside each other according to standard clinical dosing schedules.
                  </p>
                </div>
              ) : null}
            </div>

            {/* Prescriptions CTA Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-base text-white">Have a Doctor&apos;s Prescription?</h4>
                <p className="text-xs text-slate-400">
                  Upload your prescription slip for statutory Schedule H RMP verification and personalized dosage schedules.
                </p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 px-5">
                <Link href="/prescriptions/upload">
                  Upload Rx Now <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
