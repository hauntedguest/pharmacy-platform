"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Package,
  FileCheck2,
  ThermometerSnowflake,
  ShieldCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Truck,
  UserCheck,
  Search,
  Filter,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatINR } from "@/lib/data/products";
import { brandConfig } from "@/lib/config/brand";

interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  status: "Verified" | "Dispensing" | "Dispatched" | "Out for Delivery" | "Delivered" | "Cancelled";
  isColdChain: boolean;
  currentPayloadTemp: string;
  deliveryOtp: string;
  trackingNumber: string;
  prescriptionId?: string;
  createdAt: string;
}

interface PrescriptionRecord {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientPhone: string;
  shippingCity: string;
  shippingPincode: string;
  doctorName: string;
  doctorRegNo: string;
  clinicHospital: string;
  dateIssued: string;
  validUntil: string;
  status: "pending" | "approved" | "rejected";
  urgency: "Normal" | "High";
  medications: string[];
  pharmacistRemarks?: string;
  approvedBy?: string;
  createdAt: string;
}

interface BatchRecord {
  batchId: string;
  productId: string;
  productName: string;
  mfgDate: string;
  expiryDate: string;
  purityAssayPct: number;
  heavyMetalsScreen: string;
  microbialTest: string;
  currentVaultTemp: string;
  totalStockUnits: number;
  releaseStatus: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "prescriptions" | "batches" | "telemetry">("orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch live records from API
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, rxRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/prescriptions"),
      ]);

      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        if (oData.success) setOrders(oData.data);
      }

      if (rxRes.ok) {
        const rData = await rxRes.json();
        if (rData.success) setPrescriptions(rData.data);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update Order Status (Calls PATCH /api/orders/[id])
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderRecord["status"]
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showNotification(`✓ Order #${orderId} status updated to: ${newStatus}`);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Approve / Reject Prescription (Calls PATCH /api/prescriptions/[id])
  const handleRxAction = async (rxId: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(`/api/prescriptions/${rxId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          pharmacistName: "Chief PharmD S. Kulkarni (Reg. MH/204912)",
          remarks: action === "approve" ? "Verified against CDSCO Schedule H register." : "Doctor license not verifiable on State Medical Council register.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPrescriptions((prev) =>
          prev.map((r) =>
            r.id === rxId
              ? {
                  ...r,
                  status: action === "approve" ? "approved" : "rejected",
                  approvedBy: "Chief PharmD S. Kulkarni",
                }
              : r
          )
        );
        showNotification(
          action === "approve"
            ? `✓ Prescription #${rxId} APPROVED & ready for dispensing.`
            : `⚠ Prescription #${rxId} marked REJECTED.`
        );
      }
    } catch (err) {
      console.error("Failed to review prescription", err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingRxCount = prescriptions.filter((r) => r.status === "pending").length;
  const activeOrdersCount = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;

  return (
    <div className="min-h-screen bg-slate-50/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Operational Bar */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> CDSCO / FDA Pharmacist Operational Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {brandConfig.company.name} Central Pharmacy Console
            </h1>
            <p className="text-xs text-slate-400">
              Live Clinical Dispensing Ledger • License: {brandConfig.compliance.drugLicenseNo} • Free-tier In-Memory DB
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchAllData}
              className="text-xs font-semibold border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
              Sync DB
            </Button>
            <Button
              asChild
              className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Link href="/products" target="_blank">
                Storefront <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Live Notification Banner */}
        {notification && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Active Orders</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-gray-900 font-mono">
                {activeOrdersCount}
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                Live
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Pending Rx Audits</span>
              <FileCheck2 className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-600 font-mono">
                {pendingRxCount}
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                Needs PharmD
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Cold-Chain Status</span>
              <ThermometerSnowflake className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-teal-700 font-mono">
                3.6°C
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                100% Compliant
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>DB Sync Status</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-600 font-mono">
                Active
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                $0 Free-Tier
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white rounded-2xl p-1.5 shadow-xs">
          {[
            { key: "orders", label: `Customer Orders (${orders.length})`, icon: Package },
            { key: "prescriptions", label: `Doctor Prescriptions (${prescriptions.length})`, icon: FileCheck2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Orders Table View */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, or City..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 bg-white outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Dispensing">Dispensing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No orders match your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Customer & Location</th>
                      <th className="py-3 px-3">Formulation Items</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Cold-Chain</th>
                      <th className="py-3 px-3">Status & Action</th>
                      <th className="py-3 px-3 text-right">Track</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-blue-600">
                          {order.id}
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-900">{order.customerName}</p>
                          <p className="text-[11px] text-gray-500">
                            {order.shippingCity} ({order.shippingPincode})
                          </p>
                          <p className="text-[10px] text-gray-400">{order.customerPhone}</p>
                        </td>
                        <td className="py-4 px-3">
                          <ul className="space-y-0.5">
                            {order.items.map((it, idx) => (
                              <li key={idx} className="text-gray-700">
                                • {it.productName} <span className="text-gray-400 font-mono">x{it.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-4 px-3 font-mono font-bold text-gray-900">
                          {formatINR(order.totalAmount)}
                        </td>
                        <td className="py-4 px-3">
                          {order.isColdChain ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full font-mono">
                              <ThermometerSnowflake className="w-3 h-3" /> {order.currentPayloadTemp}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">Ambient</span>
                          )}
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.id, e.target.value as any)
                              }
                              className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                                order.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : order.status === "Out for Delivery"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : order.status === "Dispatched"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              <option value="Verified">Verified</option>
                              <option value="Dispensing">Dispensing</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <Button asChild size="sm" variant="outline" className="text-[11px] h-8">
                            <Link href={`/orders/track/${order.id}`}>
                              <Eye className="w-3.5 h-3.5 mr-1" /> View Live
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Table View */}
        {activeTab === "prescriptions" && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Doctor Prescription (Rx) Compliance Verification Desk
                </h3>
                <p className="text-xs text-gray-500">
                  CDSCO Schedule H / H1 Verification Protocol: Validate State Medical Council RMP number before approving.
                </p>
              </div>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No prescription submissions on file.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                      <th className="py-3 px-3">Rx Reference</th>
                      <th className="py-3 px-3">Patient Details</th>
                      <th className="py-3 px-3">Doctor &amp; Council Registration</th>
                      <th className="py-3 px-3">Medications Requested</th>
                      <th className="py-3 px-3">Audit Status</th>
                      <th className="py-3 px-3 text-right">Pharmacist Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {prescriptions.map((rx) => (
                      <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-blue-600">
                          {rx.id}
                          <span className="block text-[10px] text-gray-400 font-sans mt-0.5">
                            {new Date(rx.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-900">{rx.patientName}</p>
                          <p className="text-[11px] text-gray-500">
                            {rx.patientAge} yrs • {rx.patientGender}
                          </p>
                          <p className="text-[10px] text-gray-400">{rx.patientPhone}</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-900">{rx.doctorName}</p>
                          <span className="inline-block text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 mt-0.5">
                            RMP Reg: {rx.doctorRegNo}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-0.5">{rx.clinicHospital}</p>
                        </td>
                        <td className="py-4 px-3">
                          <ul className="space-y-0.5">
                            {rx.medications.map((m, idx) => (
                              <li key={idx} className="text-gray-700 font-medium">
                                • {m}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-4 px-3">
                          {rx.status === "approved" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          ) : rx.status === "rejected" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" /> Pending Audit
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3 text-right">
                          {rx.status === "pending" ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRxAction(rx.id, "approve")}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] h-8 px-3 font-bold"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRxAction(rx.id, "reject")}
                                className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] h-8 px-3"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">
                              Audited by {rx.approvedBy || "PharmD"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
