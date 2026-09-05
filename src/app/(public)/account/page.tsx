"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Pill,
  FileText,
  Truck,
  ShieldCheck,
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Plus,
  MapPin,
  Phone,
  Thermometer,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";
import { formatINR } from "@/lib/data/products";

export default function PatientAccountPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "refills" | "prescriptions" | "orders">("overview");

  const patientProfile = {
    name: "Pranav Gupta",
    phone: "+91 98765 43210",
    email: "pranav@medicareplus.in",
    city: "Bandra West, Mumbai",
    pinCode: "400050",
    memberSince: "January 2026",
    activePrescriptions: 2,
    activeRefills: 3,
    pendingDeliveries: 1,
  };

  const activeRefills = [
    {
      id: "SUB-IND-881",
      name: "MediCare Plus CardioGuard Telmisartan 40mg",
      pack: "Strip of 15 Tablets (2 packs/mo)",
      nextDate: "2026-09-18",
      status: "Active",
      daysLeft: 12,
    },
    {
      id: "SUB-IND-882",
      name: "MediCare Plus Pure Arctic Omega-3 1000mg",
      pack: "Bottle of 60 Softgels",
      nextDate: "2026-10-05",
      status: "Active",
      daysLeft: 28,
    },
  ];

  const recentPrescriptions = [
    {
      id: "RX-IND-9921",
      doctor: "Dr. K. S. Murthy, MD (Cardiology)",
      regNo: "MMC-2004-49102",
      hospital: "Lilavati Hospital, Mumbai",
      date: "2026-09-05",
      status: "Verified & Active",
      drugs: ["CardioGuard Telmisartan 40mg", "D3 Max 60K Softgels"],
    },
  ];

  const activeShipment = {
    orderId: "ORD-IND-9932",
    date: "Today, 09:40 AM",
    status: "Out for Delivery",
    temp: "3.6°C",
    eta: "Within 45 mins",
    carrier: "MediCare Reefer Express Van",
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 p-0.5 shadow-lg shadow-blue-500/30 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-white">
                PG
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {patientProfile.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CDSCO Verified Patient
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {patientProfile.phone} • {patientProfile.city} ({patientProfile.pinCode})
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Member of MediCare Plus Direct Care since {patientProfile.memberSince}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md"
            >
              <Link href="/account/refills">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Manage Refills
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs rounded-xl"
            >
              <Link href="/account/prescriptions">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Prescription Vault
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/account/refills"
            className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500">Active Refills</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Pill className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{patientProfile.activeRefills} Scheduled</p>
            <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
              Next delivery Sept 18 <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </Link>

          <Link
            href="/account/prescriptions"
            className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs hover:border-teal-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500">Doctor Prescriptions</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{patientProfile.activePrescriptions} Registered</p>
            <p className="text-xs text-teal-600 font-semibold mt-1 flex items-center gap-1">
              All RMP Signatures Valid <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </Link>

          <Link
            href={`/orders/track/${activeShipment.orderId}`}
            className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs hover:border-emerald-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500">Active Cold-Chain</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-emerald-700 font-mono">{activeShipment.temp}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              ETA: {activeShipment.eta} <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </Link>
        </div>

        {/* Live Active Delivery Alert */}
        <div className="bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-indigo-500/10 border border-teal-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/30 shrink-0">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">
                  Shipment #{activeShipment.orderId} in Transit
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  Cold-Chain Live: {activeShipment.temp}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Delivery to Bandra West, Mumbai • {activeShipment.carrier} ({activeShipment.eta})
              </p>
            </div>
          </div>

          <Button
            asChild
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 shadow-sm"
          >
            <Link href={`/orders/track/${activeShipment.orderId}`}>
              <Thermometer className="w-3.5 h-3.5 mr-1" />
              Open Live Sensor Telemetry
            </Link>
          </Button>
        </div>

        {/* Two-Column Section: Active Refills & Recent Prescriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Refill Subscriptions */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Active Chronic Refills</span>
              </div>
              <Link
                href="/account/refills"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                View All Refills <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {activeRefills.map((refill) => (
                <div
                  key={refill.id}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 hover:bg-gray-100/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {refill.id}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ~{refill.daysLeft} Days Supply Remaining
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900">{refill.name}</h4>
                  <p className="text-[11px] text-gray-500">{refill.pack}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1 border-t border-gray-200/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-600" /> Next Doorstep Dispatch:
                    </span>
                    <span className="font-bold text-gray-900">{refill.nextDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescriptions on File */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Prescriptions on Record</span>
              </div>
              <Link
                href="/account/prescriptions"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Open Rx Vault <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {rx.id}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {rx.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{rx.doctor}</h4>
                    <p className="text-[11px] text-emerald-600 font-mono font-medium">
                      Council Reg: {rx.regNo}
                    </p>
                    <p className="text-[10px] text-gray-500">{rx.hospital}</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Authorised Formulations:
                    </p>
                    {rx.drugs.map((d, i) => (
                      <p key={i} className="text-xs text-gray-800 font-medium">
                        • {d}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold border-gray-200 hover:bg-gray-50"
              >
                <Link href="/prescriptions/upload">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Upload New Prescription
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* CDSCO Regulatory Compliance Notice */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All pharmaceutical data is stored in accordance with the CDSCO e-Pharmacy guidelines and Drugs & Cosmetics Rules 1945.
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500 shrink-0">
            License: {brandConfig.legal.pharmacyLicense}
          </span>
        </div>
      </div>
    </div>
  );
}
