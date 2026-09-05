"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Thermometer,
  Download,
  Share2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/data/products";
import { brandConfig } from "@/lib/config/brand";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-IN-889412";
  const rawTotal = searchParams.get("total");
  const total = rawTotal ? Number(rawTotal) : 1248;

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 text-center shadow-xs space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Payment & Prescription Authorized
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Order Confirmed & Sent to Pharmacy!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto">
              Our registered dispensing pharmacists are verifying formulation lots and preparing temperature-controlled cold-chain packaging.
            </p>
          </div>

          {/* Quick Order Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Order ID
              </span>
              <span className="font-mono font-bold text-blue-600">{orderId}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Total Paid
              </span>
              <span className="font-bold text-gray-900">{formatINR(total)}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Est. Delivery
              </span>
              <span className="font-bold text-emerald-700">Tomorrow, 2:00 PM</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Status
              </span>
              <span className="font-bold text-teal-700">Pharmacist Desk</span>
            </div>
          </div>
        </div>

        {/* Live Cold-Chain Telemetry & Tracking Timeline */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Thermometer className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-bold text-base text-gray-900">Cold-Chain Live Telemetry</h3>
                <p className="text-xs text-gray-500">Sensor Tag Active • Target 2.0°C – 8.0°C</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Sensor: 4.1°C (Optimal)
            </span>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-6 text-xs">
            {[
              {
                title: "Order Received & Payment Cleared",
                time: "Just now",
                desc: "INR payment settled via 256-bit SSL Banking Gateway.",
                status: "completed",
              },
              {
                title: "Schedule H Clinical Verification",
                time: "In progress (Est. 5 mins)",
                desc: "Registered Pharmacist checking RMP signature and batch purity.",
                status: "active",
              },
              {
                title: "Cold-Chain Phase Packing",
                time: "Pending",
                desc: "Formulations packed into thermal insulated boxes with cold gel packs.",
                status: "pending",
              },
              {
                title: "Express Dispatch to Address",
                time: "Pending",
                desc: "Handed over to cold-chain healthcare logistics courier.",
                status: "pending",
              },
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                    step.status === "completed"
                      ? "bg-emerald-600 text-white"
                      : step.status === "active"
                      ? "bg-blue-600 text-white animate-pulse"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.status === "completed" ? "✓" : idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                    <span className="text-[11px] text-gray-400">{step.time}</span>
                  </div>
                  <p className="text-gray-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons & Statutory Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto text-xs font-semibold border-gray-300"
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Button
              asChild
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-500/20"
            >
              <Link href={`/orders/track/${orderId}`}>
                <Thermometer className="w-3.5 h-3.5 mr-1" />
                Live IoT Cold-Chain Tracking
              </Link>
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              <Link href="/admin">
                Pharmacist Desk <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
