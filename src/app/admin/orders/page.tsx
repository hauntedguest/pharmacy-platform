"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  Thermometer,
  ShieldCheck,
  Eye,
  X,
  Printer,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/data/products";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  pinCode: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  paymentMethod: string;
  status: "Verified" | "Dispensing" | "Dispatched" | "Out for Delivery" | "Delivered" | "Cancelled";
  isColdChain: boolean;
  coldChainTemp: string;
  date: string;
  trackingNumber: string;
}

const mockOrdersList: Order[] = [
  {
    id: "ORD-IN-98401",
    customerName: "Vikram Malhotra",
    phone: "+91 98210 11223",
    city: "Bandra Kurla Complex, Mumbai",
    pinCode: "400051",
    items: [
      { name: "MediCare Plus D3 Max 60K High Potency", qty: 2, price: 349 },
      { name: "MediCare Plus Pure Arctic Omega-3 1000mg", qty: 1, price: 550 },
    ],
    totalAmount: 1248,
    paymentMethod: "UPI (Google Pay)",
    status: "Dispatched",
    isColdChain: true,
    coldChainTemp: "4.2°C",
    date: "2026-09-05 14:20",
    trackingNumber: "BD-EXP-889104",
  },
  {
    id: "ORD-IN-98400",
    customerName: "Dr. Meera Sengupta",
    phone: "+91 98300 44556",
    city: "Salt Lake Sector 5, Kolkata",
    pinCode: "700091",
    items: [{ name: "MediCare Plus SmartGuard Pro BP Monitor", qty: 1, price: 2199 }],
    totalAmount: 2199,
    paymentMethod: "NetBanking (HDFC)",
    status: "Dispensing",
    isColdChain: false,
    coldChainTemp: "Ambient",
    date: "2026-09-05 13:45",
    trackingNumber: "DLV-EXP-992100",
  },
  {
    id: "ORD-IN-98399",
    customerName: "Rohan Kulkarni",
    phone: "+91 98900 77889",
    city: "Kothrud, Pune",
    pinCode: "411038",
    items: [
      { name: "MediCare Plus AccuCheck Smart Kit", qty: 1, price: 1199 },
      { name: "MediCare Plus Paracetamol 650mg (Strip of 15)", qty: 6, price: 30.7 },
    ],
    totalAmount: 1383,
    paymentMethod: "UPI (PhonePe)",
    status: "Verified",
    isColdChain: true,
    coldChainTemp: "3.9°C",
    date: "2026-09-05 13:10",
    trackingNumber: "BD-EXP-772911",
  },
  {
    id: "ORD-IN-98398",
    customerName: "Ananya Pillai",
    phone: "+91 98480 33445",
    city: "Jubilee Hills, Hyderabad",
    pinCode: "500033",
    items: [
      { name: "MediCare Plus KSM-66 Ashwagandha Pure Root", qty: 1, price: 899 },
      { name: "MediCare Plus FloraMax Daily Probiotic 50 Billion", qty: 1, price: 849 },
    ],
    totalAmount: 1748,
    paymentMethod: "Credit Card (RuPay)",
    status: "Delivered",
    isColdChain: true,
    coldChainTemp: "4.0°C",
    date: "2026-09-04 18:30",
    trackingNumber: "BD-EXP-662919",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrdersList);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: Order[] = json.data.map((o: any) => {
            const calculatedSum = (o.items || []).reduce(
              (s: number, it: any) => s + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1),
              0
            );
            const total = Number(o.totalAmount) > 0 ? Number(o.totalAmount) : calculatedSum;
            return {
              id: o.id,
              customerName: o.customerName || "Customer",
              phone: o.customerPhone || "N/A",
              city: o.shippingCity || "India",
              pinCode: o.shippingPincode || "",
              items: (o.items || []).map((it: any) => ({
                name: it.productName || "Formulation",
                qty: Number(it.quantity) || 1,
                price: Number(it.unitPrice) || 0,
              })),
              totalAmount: total,
              paymentMethod: o.paymentMethod || "UPI",
              status: o.status || "Verified",
              isColdChain: Boolean(o.isColdChain),
              coldChainTemp: o.currentPayloadTemp || (o.isColdChain ? "3.6°C" : "Ambient"),
              date: o.createdAt
                ? new Date(o.createdAt).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date().toLocaleDateString("en-IN"),
              trackingNumber: o.trackingNumber || `MCP-${o.id}`,
            };
          });
          setOrders(mapped);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live orders from API, using fallback data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: Order["status"]) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Status update error", err);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Orders & Cold-Chain Dispatch Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time tracking of nationwide dispatches across Indian PIN codes with thermal sensor monitoring.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : "text-slate-400"}`} />
          <span>{isLoading ? "Refreshing..." : "Refresh Dispatches"}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, Customer, PIN Code, or AWB tracking..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Dispatch Statuses ({orders.length})</option>
            <option value="Verified">Pharmacist Verified</option>
            <option value="Dispensing">Cold-Chain Dispensing</option>
            <option value="Dispatched">Out for Express Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-900/50">
                <th className="py-3.5 px-6 font-semibold">Order ID & Date</th>
                <th className="py-3.5 px-4 font-semibold">Patient & Location</th>
                <th className="py-3.5 px-4 font-semibold">Formulations</th>
                <th className="py-3.5 px-4 font-semibold">Payment & Total</th>
                <th className="py-3.5 px-4 font-semibold">Cold-Chain Sensor</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* ID */}
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-blue-400">{order.id}</span>
                    <p className="text-[10px] text-slate-500">{order.date}</p>
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-white">{order.customerName}</p>
                    <p className="text-[11px] text-slate-400">
                      {order.city} • PIN: {order.pinCode}
                    </p>
                  </td>

                  {/* Formulations */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5 max-w-xs truncate">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-slate-300">
                          {item.name} <strong className="text-slate-500">x{item.qty}</strong>
                        </p>
                      ))}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-white">{formatINR(order.totalAmount)}</p>
                    <p className="text-[10px] text-slate-400">{order.paymentMethod}</p>
                  </td>

                  {/* Cold Chain Sensor */}
                  <td className="py-4 px-4">
                    {order.isColdChain ? (
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-md text-[10px]">
                        <Thermometer className="w-3 h-3 text-teal-400" />
                        {order.coldChainTemp}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Ambient Log</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        order.status === "Delivered"
                          ? "bg-slate-500/10 border-slate-500/30 text-slate-400"
                          : order.status === "Dispatched" || order.status === "Out for Delivery"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : order.status === "Dispensing"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                          : "bg-teal-500/10 border-teal-500/30 text-teal-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 ml-auto transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-white">
                  Dispatch Docket: {selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-400">AWB Tracking: {selectedOrder.trackingNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Patient Profile</p>
                <p className="text-white font-bold text-sm">{selectedOrder.customerName}</p>
                <p className="text-slate-300">{selectedOrder.phone}</p>
                <p className="text-slate-400">{selectedOrder.city} (PIN {selectedOrder.pinCode})</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Cold-Chain Packaging</p>
                <p className="text-teal-400 font-bold text-sm">
                  Active Temp: {selectedOrder.coldChainTemp}
                </p>
                <p className="text-slate-300">Phase-Change Gel Insulated Box #402</p>
                <p className="text-emerald-400">✓ CDSCO Schedule H Dispense Approved</p>
              </div>
            </div>

            {/* Item Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Formulations & Pack Sizes</p>
              <div className="divide-y divide-slate-800">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-slate-200">
                    <span>
                      {item.name} <strong className="text-blue-400">x{item.qty}</strong>
                    </span>
                    <span className="font-bold">{formatINR(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                <span>Total Amount</span>
                <span className="text-blue-400 text-sm">{formatINR(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Status Transition Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "Dispensing")}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-xs hover:bg-blue-600/30"
                >
                  Mark Dispensing
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "Dispatched")}
                  className="px-3 py-1.5 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30 font-bold text-xs hover:bg-teal-600/30"
                >
                  Mark Dispatched
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "Delivered")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-600/30"
                >
                  Mark Delivered
                </button>
              </div>

              <button
                onClick={() => alert("Printing CDSCO Drug Dispense Invoice...")}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Rx Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
