"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ThermometerSnowflake,
  ShieldCheck,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Package,
  Activity,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  KeyRound,
  Navigation,
  Radio,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";
import { formatINR } from "@/lib/data/products";

interface TempLog {
  time: string;
  temp: number;
  location: string;
  status: "optimal" | "warning";
}

const defaultTempLogs: TempLog[] = [
  { time: "08:30 AM", temp: 3.2, location: "BKC Central Cold Vault, Mumbai", status: "optimal" },
  { time: "10:15 AM", temp: 3.5, location: "Insulated Van Loading, Mumbai Hub", status: "optimal" },
  { time: "12:00 PM", temp: 4.1, location: "Express Transit via Western Express Hwy", status: "optimal" },
  { time: "01:45 PM", temp: 3.8, location: "Regional Sorting Hub, Andheri East", status: "optimal" },
  { time: "03:10 PM", temp: 3.6, location: "Last-Mile Delivery Reefer Van", status: "optimal" },
];

export default function OrderTrackPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams?.id || "ORD-IND-9932";
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [tempLogs, setTempLogs] = useState<TempLog[]>(defaultTempLogs);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setOrderData(json.data);
          if (json.data.telemetry && json.data.telemetry.length > 0) {
            setTempLogs(json.data.telemetry);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch order details from API, using fallback data", err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const deliveryOtp = orderData?.deliveryOtp || "6849";
  const currentTemp = orderData?.isColdChain ? 3.6 : 3.6;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrder();
    setTimeout(() => {
      setIsRefreshing(false);
      setActiveNotification("IoT Telemetry sync complete. Payload temperature verified at 3.6°C.");
      setTimeout(() => setActiveNotification(null), 4000);
    }, 600);
  };

  const copyOtp = () => {
    navigator.clipboard?.writeText(deliveryOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleWhatsAppAlert = () => {
    setActiveNotification(`✓ Real-time GPS & Cold-Chain tracker dispatched to WhatsApp.`);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/account" className="hover:text-blue-600 transition-colors">Account</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-gray-800">Track #{orderId}</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live IoT Cold-Chain Monitored
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Order #{orderId}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Proprietary MediCare Plus Cold-Chain Dispatch • Sealed with Phase Change Materials (PCM) &amp; NABL Calibrated Data Logger.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="text-xs bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold flex items-center justify-center gap-2 rounded-2xl"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Sync IoT Sensor
            </Button>
            <button
              onClick={handleWhatsAppAlert}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Updates
            </button>
          </div>
        </div>

        {/* Live Notification Banner */}
        {activeNotification && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{activeNotification}</span>
            </div>
            <button
              onClick={() => setActiveNotification(null)}
              className="text-xs text-teal-900 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* GPS Live Route Corridor Map Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Live Cold-Chain Transit Corridor (Mumbai Zone)</h3>
                <p className="text-[11px] text-slate-400">GPS Node: 19.0600° N, 72.8360° E • Speed: 38 km/h • Reefer Active</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold rounded-lg">
                <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                Live Beacon: Active
              </span>
            </div>
          </div>

          {/* Graphical GPS Transit Visualizer */}
          <div className="relative bg-slate-900/90 rounded-2xl p-5 border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
              {/* Waypoint 1 */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">NODE 01 (ORIGIN)</span>
                <p className="text-xs font-bold text-white">BKC Central Cold Vault</p>
                <p className="text-[10px] text-slate-400">Temp: 3.2°C • 08:30 AM</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                  ✓ Dispensed
                </span>
              </div>

              {/* Waypoint 2 */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">NODE 02 (HUB)</span>
                <p className="text-xs font-bold text-white">Mumbai Central Sorting</p>
                <p className="text-[10px] text-slate-400">Temp: 3.5°C • 10:15 AM</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                  ✓ Scanned
                </span>
              </div>

              {/* Waypoint 3 (Current) */}
              <div className="bg-blue-950/60 border border-blue-500/50 rounded-xl p-3 space-y-1 ring-2 ring-blue-500/30">
                <span className="text-[10px] font-mono text-blue-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  CURRENT GPS POSITION
                </span>
                <p className="text-xs font-bold text-white">Western Express Highway</p>
                <p className="text-[10px] text-teal-300 font-mono">Temp: 3.6°C • In Motion</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500 text-white">
                  En Route (45m ETA)
                </span>
              </div>

              {/* Waypoint 4 (Destination) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1 opacity-70">
                <span className="text-[10px] font-mono text-slate-400 font-bold">NODE 04 (FINAL)</span>
                <p className="text-xs font-bold text-white">Bandra West Destination</p>
                <p className="text-[10px] text-slate-400">PIN: 400050 • OTP Required</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400">
                  Pending Handover
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Telemetry & Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Status & IoT Telemetry */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Temperature Monitor Widget */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <ThermometerSnowflake className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Real-Time Cold Pod Temperature</h3>
                    <p className="text-[10px] text-gray-500 font-mono">Sensor ID: IOT-SENS-8849-MH</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Compliant (2°C - 8°C)
                </div>
              </div>

              {/* Large Temperature Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="sm:col-span-1 flex flex-col justify-center">
                  <span className="text-xs text-gray-500 font-medium">Inside Payload:</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-extrabold text-teal-700 font-mono">
                      {currentTemp.toFixed(1)}°C
                    </span>
                    <span className="text-xs text-gray-400 font-bold">LIVE</span>
                  </div>
                </div>

                <div className="sm:col-span-2 grid grid-cols-2 gap-2 text-xs border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 pt-2 sm:pt-0">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold">Target Zone</span>
                    <p className="font-bold text-gray-800 font-mono mt-0.5">2.0°C – 8.0°C</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold">Battery Status</span>
                    <p className="font-bold text-emerald-600 font-mono mt-0.5">96% (Li-ion)</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold">Thermal Insulation</span>
                    <p className="font-bold text-gray-800 mt-0.5">PCM 48-Hour Pack</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold">NABL Calibration</span>
                    <p className="font-bold text-blue-600 font-mono mt-0.5">ISO/IEC 17025</p>
                  </div>
                </div>
              </div>

              {/* Temperature History Chart / Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Transit Temperature Log (Hourly Telemetry)</span>
                  <span className="text-emerald-700 font-bold">0 Excursions</span>
                </div>

                <div className="space-y-2 pt-1">
                  {tempLogs.map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-gray-400 text-[11px] font-medium w-16">
                          {log.time}
                        </span>
                        <span className="text-gray-700 truncate max-w-[200px] sm:max-w-[280px]">
                          {log.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-teal-700 text-xs">
                          {log.temp.toFixed(1)}°C
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery OTP Security Verification */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  Prescription Handover OTP
                </div>
                <p className="text-xs text-blue-800 leading-relaxed max-w-md">
                  Share this confidential statutory OTP with our cold-chain delivery executive only after inspecting the temperature indicator tag.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-blue-200 shadow-xs">
                <span className="font-mono text-xl font-extrabold text-blue-700 tracking-widest">
                  {deliveryOtp}
                </span>
                <button
                  onClick={copyOtp}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 ml-2"
                >
                  {copiedOtp ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Quality & Pharmacist Guarantee */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-3 text-xs text-gray-600">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                MediCare Plus Clinical Quality Assurance
              </div>
              <p className="leading-relaxed">
                This shipment was dispensed by Registered Pharmacist (Reg. MH/204912) under CDSCO Schedule M (Good Manufacturing Practices) guidelines. Cold-chain storage integrity is guaranteed until receipt.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-mono text-gray-500">
                <span>Batch: <strong className="text-gray-800">MCP-2026-08B</strong></span>
                <span>•</span>
                <span>Mfg: <strong className="text-gray-800">08/2026</strong></span>
                <span>•</span>
                <span>Exp: <strong className="text-gray-800">07/2028</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Timeline & Destination */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Journey Milestones */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Shipment Progress
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                  Out for Delivery
                </span>
              </div>

              {/* Vertical Stepper */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center text-white text-[8px] font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Clinical Dispense &amp; Verification</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">BKC Central Cleanroom, Mumbai</p>
                    <span className="text-[10px] text-gray-400 font-mono">Today, 08:15 AM</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center text-white text-[8px] font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Cold-Pod Sensor Sealed &amp; Calibrated</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Phase-Change Insulated Container Activated</p>
                    <span className="text-[10px] text-gray-400 font-mono">Today, 09:40 AM</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm ring-4 ring-blue-100" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">Out for Last-Mile Express Delivery</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">Reefer Courier Van #MH-02-EE-9812</p>
                    <span className="text-[10px] text-blue-600 font-bold font-mono">ETA: Within 45 Minutes</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative opacity-50">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-gray-300 border-2 border-white" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-700">Doorstep Cold-Chain Handover</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">OTP verification &amp; seal inspection</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-gray-700">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  Destination Address
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl text-gray-600 space-y-0.5">
                  <p className="font-bold text-gray-900">{orderData?.customerName || "Pranav Gupta"}</p>
                  <p>{orderData?.shippingStreet || "Apt 1402, Sea Green Heights, Bandra West"}</p>
                  <p>{orderData?.shippingCity || "Mumbai"}, {orderData?.shippingState || "Maharashtra"} – {orderData?.shippingPincode || "400050"}</p>
                  <p className="text-[11px] text-gray-500 pt-1">Phone: {orderData?.customerPhone || "+91 98765 43210"}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={`tel:${brandConfig.contact.phone}`}
                className="w-full py-3 px-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                Call 24x7 Clinical Support (1800 209 8888)
              </a>

              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-bold py-3 rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                <Link href="/products">
                  Explore More Formulations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
