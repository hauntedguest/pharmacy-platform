"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Phone,
  Trash2,
  PauseCircle,
  PlayCircle,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";
import { isValidIndianPhone } from "@/lib/validation/validators";

interface Refill {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  intervalDays: number;
  nextRefillDate: string;
  status: "Active" | "Paused" | "Cancelled";
  whatsappReminder: boolean;
  rxValidityMonths: number;
  remainingPillsEstimate: number;
}

export default function AccountRefillsPage() {
  const [refills, setRefills] = useState<Refill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productName: "MediCare Plus CardioGuard Telmisartan 40mg",
    productId: "prod_telmisartan_40",
    customerName: "Pranav Gupta",
    customerPhone: "9876543210",
    quantity: 1,
    intervalDays: 30,
    whatsappReminder: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchRefills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/refills");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setRefills(json.data);
        }
      }
    } catch (err) {
      console.warn("Error fetching refills:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefills();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: Refill["status"]) => {
    const newStatus = currentStatus === "Active" ? "Paused" : "Active";
    try {
      const res = await fetch(`/api/refills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRefills((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      console.error("Error updating refill status:", err);
    }
  };

  const handleCreateRefill = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      errors.productName = "Formulation name is required.";
    }
    if (!isValidIndianPhone(formData.customerPhone)) {
      errors.customerPhone = "Please enter a valid 10-digit Indian phone number.";
    }
    if (formData.quantity < 1) {
      errors.quantity = "Quantity must be at least 1 pack.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/refills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setRefills((prev) => [json.data, ...prev]);
          setIsModalOpen(false);
          setFormData({
            productName: "MediCare Plus CardioGuard Telmisartan 40mg",
            productId: "prod_telmisartan_40",
            customerName: "Pranav Gupta",
            customerPhone: "9876543210",
            quantity: 1,
            intervalDays: 30,
            whatsappReminder: true,
          });
        }
      }
    } catch (err) {
      console.error("Error creating refill schedule:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/account" className="hover:text-blue-600">
                Patient Account
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-semibold">Pill Subscriptions & Auto-Refills</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Chronic Care Pill Subscriptions
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Never miss a daily dose. Formulations automatically dispatched to your doorstep with WhatsApp dosage alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRefills}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-gray-900 shadow-xs cursor-pointer"
              title="Refresh refill schedules"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            </button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule New Auto-Refill
            </Button>
          </div>
        </div>

        {/* Informational CDSCO Compliance Banner */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              <strong>Statutory Compliance:</strong> Schedule H chronic subscriptions are linked to valid Doctor Prescriptions with automatic 6-month clinical re-verification.
            </span>
          </div>
          <Link
            href="/prescriptions/upload"
            className="font-bold underline hover:text-blue-700 whitespace-nowrap text-[11px]"
          >
            Upload Rx Renewal &rarr;
          </Link>
        </div>

        {/* Refills List */}
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
            Loading your chronic refill subscriptions...
          </div>
        ) : refills.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Pill className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-gray-900">No Active Pill Subscriptions</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Set up automated re-orders for hypertension, diabetes, cardiac, or daily supplement regimens.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
            >
              Add First Auto-Refill Schedule
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {refills.map((refill) => (
              <div
                key={refill.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-gray-400 block font-semibold">
                          {refill.id}
                        </span>
                        <h3 className="font-bold text-sm text-gray-900 leading-snug">
                          {refill.productName}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                        refill.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {refill.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                        Interval Cadence
                      </span>
                      <span className="font-bold text-gray-900">
                        Every {refill.intervalDays} Days ({refill.quantity} Pack)
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                        Next Auto-Dispatch
                      </span>
                      <span className="font-bold text-blue-600">
                        {refill.nextRefillDate || "In 14 Days"}
                      </span>
                    </div>
                  </div>

                  {refill.whatsappReminder && (
                    <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp re-order notification active on +91 {refill.customerPhone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                  <span className="text-gray-400 text-[11px]">
                    Prescription Valid: {refill.rxValidityMonths || 6} Months
                  </span>

                  <button
                    onClick={() => handleStatusToggle(refill.id, refill.status)}
                    className="flex items-center gap-1.5 font-bold text-xs text-gray-700 hover:text-blue-600 cursor-pointer"
                  >
                    {refill.status === "Active" ? (
                      <>
                        <PauseCircle className="w-4 h-4 text-amber-600" />
                        <span>Pause Schedule</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 text-emerald-600" />
                        <span>Resume Schedule</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Schedule New Refill */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-gray-900">
                    Schedule Chronic Care Auto-Refill
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRefill} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Formulation Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => {
                      setFormData({ ...formData, productName: e.target.value });
                      if (formErrors.productName) setFormErrors((prev) => ({ ...prev, productName: "" }));
                    }}
                    placeholder="e.g. MediCare Plus CardioGuard Telmisartan 40mg"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                  {formErrors.productName && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">{formErrors.productName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Patient Phone (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => {
                        setFormData({ ...formData, customerPhone: e.target.value });
                        if (formErrors.customerPhone) setFormErrors((prev) => ({ ...prev, customerPhone: "" }));
                      }}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                    {formErrors.customerPhone && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">{formErrors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Refill Frequency Cadence
                    </label>
                    <select
                      value={formData.intervalDays}
                      onChange={(e) => setFormData({ ...formData, intervalDays: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value={15}>Every 15 Days (Bi-weekly)</option>
                      <option value={30}>Every 30 Days (Monthly)</option>
                      <option value={60}>Every 60 Days (Bi-monthly)</option>
                      <option value={90}>Every 90 Days (Quarterly)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Quantity per Refill
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.whatsappReminder}
                        onChange={(e) => setFormData({ ...formData, whatsappReminder: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 font-semibold text-xs">
                        WhatsApp 3-day Advance Alert
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs py-2.5 px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Confirm Auto-Refill
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
