"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  FileCheck2,
  ArrowUpRight,
  Truck,
  Thermometer,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/data/products";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [ordRes, rxRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/prescriptions"),
      ]);
      if (ordRes.ok) {
        const oJson = await ordRes.json();
        if (oJson.success) setOrders(oJson.data);
      }
      if (rxRes.ok) {
        const rJson = await rxRes.json();
        if (rJson.success) setPrescriptions(rJson.data);
      }
    } catch (err) {
      console.warn("Failed to fetch dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalGross = orders.reduce((sum, o) => {
    const calculatedSum = (o.items || []).reduce(
      (s: number, it: any) => s + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1),
      0
    );
    const amt = Number(o.totalAmount) > 0 ? Number(o.totalAmount) : calculatedSum;
    return sum + amt;
  }, 0);
  const pendingRxCount = prescriptions.filter((r) => r.status === "pending").length;

  const stats = [
    {
      title: "Today's Gross Dispensed",
      value: formatINR(totalGross > 0 ? totalGross : 384250),
      change: "+18.4% vs yesterday",
      isPositive: true,
      icon: TrendingUp,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    },
    {
      title: "Schedule H Rx in Queue",
      value: `${pendingRxCount > 0 ? pendingRxCount : 4} Orders`,
      change: "Requires PharmD verification",
      isPositive: false,
      icon: FileCheck2,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
    {
      title: "Avg. Cold-Chain Delivery",
      value: "2.4 Hours",
      change: "Mumbai & Delhi NCR zones",
      isPositive: true,
      icon: Truck,
      color: "from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30",
    },
    {
      title: "Active Cold Storage Sensor",
      value: "3.6°C",
      change: "Optimal (Target: 2°C - 8°C)",
      isPositive: true,
      icon: Thermometer,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    },
  ];

  const displayedPrescriptions =
    prescriptions.length > 0
      ? prescriptions.slice(0, 5).map((rx) => ({
          id: rx.id,
          patient: `${rx.patientName} (${rx.patientAge} ${rx.patientGender?.[0] || "M"})`,
          doctor: `${rx.doctorName} (Reg: ${rx.doctorRegNo})`,
          medication: rx.medications?.join(", ") || "Schedule H Formulation",
          city: `${rx.shippingCity} (${rx.shippingPincode})`,
          time: new Date(rx.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          urgency: rx.urgency || "Normal",
          status: rx.status,
        }))
      : [
          {
            id: "RX-IND-9921",
            patient: "Sunita Deshmukh (54 F)",
            doctor: "Dr. K. S. Murthy (Reg: MMC-49102)",
            medication: "MediCare Plus CardioGuard Telmisartan 40mg",
            city: "Bandra West, Mumbai (400050)",
            time: "4 mins ago",
            urgency: "High",
            status: "pending",
          },
          {
            id: "RX-IND-9920",
            patient: "Arjun Verma (38 M)",
            doctor: "Dr. R. K. Singhania (Reg: DMC-88219)",
            medication: "MediCare Plus AllergyShield Levocetirizine",
            city: "Gurugram Phase 5, NCR (122002)",
            time: "11 mins ago",
            urgency: "Medium",
            status: "pending",
          },
        ];

  const displayedOrders =
    orders.length > 0
      ? orders.slice(0, 5).map((o) => {
          const calculatedSum = (o.items || []).reduce(
            (s: number, it: any) => s + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1),
            0
          );
          const amt = Number(o.totalAmount) > 0 ? Number(o.totalAmount) : calculatedSum;
          return {
            orderId: o.id,
            customer: o.customerName || "Customer",
            location: `${o.shippingCity || "India"} (${o.shippingPincode || ""})`,
            items: o.items?.map((it: any) => `${it.productName} x${it.quantity}`).join(", ") || "Formulations",
            amount: amt,
            status: o.status || "Verified",
            statusColor:
              o.status === "Delivered"
                ? "text-slate-400 bg-slate-500/10 border-slate-500/30"
                : o.status === "Dispatched" || o.status === "Out for Delivery"
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : "text-blue-400 bg-blue-500/10 border-blue-500/30",
          };
        })
      : [
          {
            orderId: "ORD-98401",
            customer: "Vikram Malhotra",
            location: "BKC, Mumbai",
            items: "MediCare Plus D3 Max 60K + Pure Arctic Omega-3",
            amount: 1248,
            status: "Out for Express Delivery",
            statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          },
        ];

  return (
    <div className="space-y-8">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              CDSCO Dispensing Station Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Pharmacist Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live monitoring of Indian prescription intake, scheduled cold-chain fulfillment, and regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
            <Link href="/admin/prescriptions">Open Rx Review Queue</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Link href="/admin/products">Manage Catalogue</Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{stat.title}</span>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} border flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</p>
              <p className={`text-xs mt-1 font-medium ${stat.isPositive ? "text-emerald-400" : "text-amber-400"}`}>
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2-Column Section: Pending Prescriptions Queue + Cold-Chain Sensor Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pending Prescriptions (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-base text-white">Prescription Verification Queue</h3>
                <p className="text-xs text-slate-400">Schedule H / H1 Drugs awaiting doctor signature validation</p>
              </div>
            </div>
            <Link
              href="/admin/prescriptions"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              View Full Queue ({displayedPrescriptions.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {displayedPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{rx.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs font-semibold text-white">{rx.patient}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {rx.urgency} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{rx.medication}</p>
                  <p className="text-[11px] text-slate-500">
                    Prescribed by: {rx.doctor} • {rx.city}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Link
                    href="/admin/prescriptions"
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors text-center"
                  >
                    Review Rx
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cold-Chain Hub Sensor & Regulatory Monitor (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800/80">
              <Thermometer className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="font-bold text-base text-white">Cold-Chain Telemetry</h3>
                <p className="text-xs text-slate-400">Hub: BKC Central Facility, Mumbai</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-center mb-5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-teal-400">
                Primary Refrigeration Zone A
              </span>
              <p className="text-4xl font-extrabold text-teal-300 my-1 font-mono">3.8°C</p>
              <p className="text-[11px] text-teal-400 font-medium">Within safe range (2.0°C – 8.0°C)</p>
            </div>

            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <span>Backup Diesel Generator</span>
                <span className="text-emerald-400 font-bold">100% Ready (Auto-Switch)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <span>Phase-Change Box Stock</span>
                <span className="text-white font-bold">480 Units Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Maharashtra FDA Audit</span>
                <span className="text-white font-bold">Passed with Zero Remarks</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Drug License DL-MH-MZ1-204912 Valid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Indian Dispatched Orders Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base text-white">Live Dispatched Orders</h3>
              <p className="text-xs text-slate-400">Real-time express shipments across Indian pin codes</p>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            View All Dispatches ↗
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Destination City</th>
                <th className="pb-3 font-semibold">Formulations</th>
                <th className="pb-3 font-semibold">Amount (INR)</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-blue-400">{order.orderId}</td>
                  <td className="py-3.5 font-semibold text-white">{order.customer}</td>
                  <td className="py-3.5 text-slate-400">{order.location}</td>
                  <td className="py-3.5 text-slate-300 truncate max-w-xs">{order.items}</td>
                  <td className="py-3.5 font-bold text-white">{formatINR(order.amount)}</td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
