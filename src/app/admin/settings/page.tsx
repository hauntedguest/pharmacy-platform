"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  FileText,
  UserCheck,
  Bell,
  Thermometer,
  Save,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [licenses, setLicenses] = useState({
    drugLicense: brandConfig.legal.pharmacyLicense,
    fssaiLicense: brandConfig.legal.fssaiLicense,
    gstNumber: brandConfig.legal.gstNumber,
    pharmacistName: "Dr. Ananya Iyer, PharmD",
    pharmacistRegNo: "MSPC-2012-984102",
    minColdChainTemp: "2.0",
    maxColdChainTemp: "8.0",
    alertPhone: "+91 98201 54321",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Pharmacy Regulatory Compliance & Operational Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Maintain Central Drugs Standard Control Organisation (CDSCO) & Maharashtra FDA registrations.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          Regulatory settings & licensing records saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Drug Licenses Section */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              CDSCO & State Drug Controller Licenses
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Retail Drug License (Form 20 / 21) *
              </label>
              <input
                type="text"
                value={licenses.drugLicense}
                onChange={(e) => setLicenses({ ...licenses, drugLicense: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                FSSAI Central Food Safety License *
              </label>
              <input
                type="text"
                value={licenses.fssaiLicense}
                onChange={(e) => setLicenses({ ...licenses, fssaiLicense: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Goods and Services Tax (GSTIN) *
              </label>
              <input
                type="text"
                value={licenses.gstNumber}
                onChange={(e) => setLicenses({ ...licenses, gstNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Dispensing Pharmacy Address
              </label>
              <input
                type="text"
                disabled
                value={`${brandConfig.contact.address.street}, ${brandConfig.contact.address.city} - ${brandConfig.contact.address.zip}`}
                className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Registered Pharmacist in-Charge */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <UserCheck className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">
              Chief Dispensing Pharmacist in-Charge (Form 19)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Pharmacist Full Name & Credentials *
              </label>
              <input
                type="text"
                value={licenses.pharmacistName}
                onChange={(e) => setLicenses({ ...licenses, pharmacistName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                State Pharmacy Council Registration No. *
              </label>
              <input
                type="text"
                value={licenses.pharmacistRegNo}
                onChange={(e) => setLicenses({ ...licenses, pharmacistRegNo: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Cold-Chain Telemetry Thresholds */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Thermometer className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Cold Storage Temperature Thresholds (°C)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Lower Limit Target (°C) *
              </label>
              <input
                type="number"
                step="0.1"
                value={licenses.minColdChainTemp}
                onChange={(e) => setLicenses({ ...licenses, minColdChainTemp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Upper Limit Target (°C) *
              </label>
              <input
                type="number"
                step="0.1"
                value={licenses.maxColdChainTemp}
                onChange={(e) => setLicenses({ ...licenses, maxColdChainTemp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Emergency Alert SMS Number *
              </label>
              <input
                type="tel"
                value={licenses.alertPhone}
                onChange={(e) => setLicenses({ ...licenses, alertPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Regulatory Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
