"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Pill,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Plus,
  Pause,
  Play,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  Truck,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatINR, mockProducts, Product } from "@/lib/data/products";
import { brandConfig } from "@/lib/config/brand";

interface SubscriptionRefill {
  id: string;
  product: Product;
  quantity: number;
  intervalDays: 30 | 60 | 90;
  nextRefillDate: string;
  status: "Active" | "Paused";
  whatsappReminder: boolean;
  rxValidityMonths: number;
  remainingPillsEstimate: number;
}

const initialSubscriptions: SubscriptionRefill[] = [
  {
    id: "SUB-IND-881",
    product: mockProducts[1], // Telmisartan 40mg
    quantity: 2, // 30 tablets
    intervalDays: 30,
    nextRefillDate: "2026-09-18",
    status: "Active",
    whatsappReminder: true,
    rxValidityMonths: 5,
    remainingPillsEstimate: 12,
  },
  {
    id: "SUB-IND-882",
    product: mockProducts[2], // Pure Arctic Omega-3
    quantity: 1, // 60 softgels
    intervalDays: 60,
    nextRefillDate: "2026-10-05",
    status: "Active",
    whatsappReminder: true,
    rxValidityMonths: 12,
    remainingPillsEstimate: 28,
  },
  {
    id: "SUB-IND-883",
    product: mockProducts[3], // Pantoprazole 40mg
    quantity: 2, // 30 tabs
    intervalDays: 30,
    nextRefillDate: "2026-09-22",
    status: "Active",
    whatsappReminder: true,
    rxValidityMonths: 3,
    remainingPillsEstimate: 16,
  },
];

export default function AccountRefillsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRefill[]>(initialSubscriptions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductSlug, setSelectedProductSlug] = useState(mockProducts[0].slug);
  const [selectedInterval, setSelectedInterval] = useState<30 | 60 | 90>(30);
  const [refillSuccessMsg, setRefillSuccessMsg] = useState<string | null>(null);

  const togglePause = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? { ...sub, status: sub.status === "Active" ? "Paused" : "Active" }
          : sub
      )
    );
  };

  const toggleWhatsApp = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, whatsappReminder: !sub.whatsappReminder } : sub
      )
    );
  };

  const handleRefillNowEarly = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;
    setRefillSuccessMsg(
      `✓ Immediate refill dispatched for ${sub.product.name}! Cold-chain tracking ID sent to your WhatsApp.`
    );
    setTimeout(() => setRefillSuccessMsg(null), 5000);
  };

  const handleAddNewSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = mockProducts.find((p) => p.slug === selectedProductSlug);
    if (!prod) return;

    const newSub: SubscriptionRefill = {
      id: `SUB-IND-${Math.floor(100 + Math.random() * 900)}`,
      product: prod,
      quantity: 1,
      intervalDays: selectedInterval,
      nextRefillDate: "2026-10-05",
      status: "Active",
      whatsappReminder: true,
      rxValidityMonths: prod.requiresPrescription ? 6 : 12,
      remainingPillsEstimate: 30,
    };

    setSubscriptions([newSub, ...subscriptions]);
    setShowAddModal(false);
    setRefillSuccessMsg(`✓ Successfully scheduled auto-refill for ${prod.name}!`);
    setTimeout(() => setRefillSuccessMsg(null), 5000);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <RefreshCw className="w-3.5 h-3.5" />
              Automated Chronic Care Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pill Subscriptions & Monthly Refills
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Never miss a dose of your maintenance medications. Enjoy automatic doorstep dispatch, 10% subscriber discount, and 24x7 clinical pharmacist adherence monitoring.
            </p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Refill Schedule
          </Button>
        </div>

        {/* Success Alert Banner */}
        {refillSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{refillSuccessMsg}</span>
            </div>
            <button
              onClick={() => setRefillSuccessMsg(null)}
              className="text-xs text-emerald-900 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Subscriptions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600" />
              Your Active Chronic Refill Subscriptions ({subscriptions.length})
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Free Cold-Chain Delivery on all refills
            </span>
          </div>

          {subscriptions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-xs">
              <Pill className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-bold text-gray-800 text-base">No Active Refills</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                You don&apos;t have any recurring medication schedules configured yet.
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white text-xs font-bold"
              >
                Schedule First Refill
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className={`bg-white rounded-3xl border transition-all p-6 shadow-xs flex flex-col justify-between space-y-5 ${
                    sub.status === "Active"
                      ? "border-gray-200 hover:border-blue-300"
                      : "border-gray-200 opacity-60 bg-gray-50"
                  }`}
                >
                  {/* Card Top */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {sub.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          sub.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {sub.product.brand}
                      </p>
                      <h3 className="font-bold text-sm text-gray-900 mt-0.5 line-clamp-1">
                        {sub.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {sub.product.packSize} • Qty: {sub.quantity}
                      </p>
                    </div>

                    {/* Pill Adherence Bar */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500 font-medium">Estimated Pills Left:</span>
                        <span className="font-bold text-gray-900 font-mono">
                          ~{sub.remainingPillsEstimate} Doses
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((sub.remainingPillsEstimate / 30) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3 h-3 text-blue-600" /> Next Dispatch:{" "}
                          <strong className="text-slate-800">{sub.nextRefillDate}</strong>
                        </span>
                        <span className="font-mono text-teal-700 font-semibold">
                          Every {sub.intervalDays} Days
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp Reminder Toggle */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-semibold">WhatsApp 3-Day Heads Up</span>
                      </div>
                      <button
                        onClick={() => toggleWhatsApp(sub.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${
                          sub.whatsappReminder ? "bg-emerald-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                            sub.whatsappReminder ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Schedule H Rx Validity */}
                    {sub.product.requiresPrescription && (
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 flex items-center justify-between">
                        <span>Schedule H Doctor Rx</span>
                        <span className="font-bold">{sub.rxValidityMonths} Months Left</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Subscription Price:</span>
                      <div className="text-right">
                        <span className="font-extrabold text-gray-900 text-sm">
                          {formatINR(sub.product.price * sub.quantity * 0.9)}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold ml-1.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                          10% OFF
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRefillNowEarly(sub.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-xl"
                      >
                        Refill Now Early
                      </Button>
                      <button
                        onClick={() => togglePause(sub.id)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                        title={sub.status === "Active" ? "Pause Refills" : "Resume Refills"}
                      >
                        {sub.status === "Active" ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteSubscription(sub.id)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-rose-50 hover:text-rose-600 text-gray-400 transition-colors"
                        title="Cancel Subscription"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Benefits & Pharmacist Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Zero Delivery Fees</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every monthly maintenance pack is shipped free of delivery charges in insulated cold-chain cartons.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Prescription Auto-Rollover</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our clinical pharmacists manage repeat dispense records in compliance with CDSCO Form 20/21 regulations.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">10% Flat Subscriber Savings</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Direct-from-laboratory pricing with an extra 10% lifetime discount applied to all recurring chronic refills.
            </p>
          </div>
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-gray-900">Schedule Chronic Pill Refill</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewSubscription} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Select MediCare Plus Formulation
                </label>
                <select
                  value={selectedProductSlug}
                  onChange={(e) => setSelectedProductSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                >
                  {mockProducts.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name} ({formatINR(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Refill Frequency Interval
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 60, 90].map((days) => (
                    <button
                      type="button"
                      key={days}
                      onClick={() => setSelectedInterval(days as 30 | 60 | 90)}
                      className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                        selectedInterval === days
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Every {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-1">
                <p className="font-bold flex items-center gap-1 text-teal-950">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Subscriber Benefit
                </p>
                <p className="text-[11px] leading-relaxed">
                  Automatic 10% discount + Free cold-chain shipping will be applied to every delivery cycle. You can pause or cancel anytime.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Confirm & Activate Refill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
