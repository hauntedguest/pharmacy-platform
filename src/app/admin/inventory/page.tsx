"use client";

import { useState, useEffect } from "react";
import {
  Boxes,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Package,
  ShieldCheck,
  RefreshCw,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface BatchItem {
  batchId: string;
  drugName: string;
  manufacturer: string;
  category: string;
  zone: "Cold Storage (2°C-8°C)" | "Controlled Ambient (15°C-25°C)";
  currentTemp: string;
  stockUnits: number;
  reorderLevel: number;
  mfgDate: string;
  expiryDate: string;
  status: "Optimal" | "Low Stock" | "Near Expiry";
}

const mockBatches: BatchItem[] = [
  {
    batchId: "BAT-MCP-99201",
    drugName: "MediCare Plus D3 Max 60,000 IU Softgels",
    manufacturer: "MediCare Plus Cleanroom Labs (Mumbai)",
    category: "Vitamins & Bio-Actives",
    zone: "Controlled Ambient (15°C-25°C)",
    currentTemp: "21.4°C",
    stockUnits: 180,
    reorderLevel: 50,
    mfgDate: "2026-01-15",
    expiryDate: "2028-01-14",
    status: "Optimal",
  },
  {
    batchId: "BAT-MCP-48192",
    drugName: "MediCare Plus CardioGuard Telmisartan 40mg IP",
    manufacturer: "MediCare Plus Advanced Therapeutics (BKC Facility)",
    category: "Cardiovascular (Schedule H)",
    zone: "Controlled Ambient (15°C-25°C)",
    currentTemp: "20.8°C",
    stockUnits: 420,
    reorderLevel: 100,
    mfgDate: "2026-02-10",
    expiryDate: "2028-01-31",
    status: "Optimal",
  },
  {
    batchId: "BAT-MCP-33109",
    drugName: "MediCare Plus FloraMax Daily Multi-Strain Probiotic",
    manufacturer: "MediCare Plus Bio-Fermentation Unit (Bengaluru)",
    category: "Microbiome Health",
    zone: "Cold Storage (2°C-8°C)",
    currentTemp: "3.8°C",
    stockUnits: 25,
    reorderLevel: 60,
    mfgDate: "2026-04-01",
    expiryDate: "2027-10-31",
    status: "Low Stock",
  },
  {
    batchId: "BAT-MCP-11029",
    drugName: "MediCare Plus DeepRelief Diclofenac Active Gel 50g",
    manufacturer: "MediCare Plus Topical Formulations (Pune)",
    category: "Pain & Orthopaedics",
    zone: "Controlled Ambient (15°C-25°C)",
    currentTemp: "21.5°C",
    stockUnits: 140,
    reorderLevel: 40,
    mfgDate: "2026-03-01",
    expiryDate: "2028-02-28",
    status: "Optimal",
  },
  {
    batchId: "BAT-MCP-77123",
    drugName: "MediCare Plus Pure Arctic Omega-3 1000mg (EPA/DHA)",
    manufacturer: "MediCare Plus Marine Lipid Processing (Mumbai)",
    category: "Cardio & Cellular Lipids",
    zone: "Cold Storage (2°C-8°C)",
    currentTemp: "3.9°C",
    stockUnits: 310,
    reorderLevel: 80,
    mfgDate: "2026-04-10",
    expiryDate: "2028-04-09",
    status: "Optimal",
  },
];

export default function AdminInventoryPage() {
  const [batches, setBatches] = useState<BatchItem[]>(mockBatches);
  const [search, setSearch] = useState("");
  const [filterZone, setFilterZone] = useState<string>("all");
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formBatchId, setFormBatchId] = useState("");
  const [formDrugName, setFormDrugName] = useState("");
  const [formQuantity, setFormQuantity] = useState("250");
  const [formZone, setFormZone] = useState("Cold Storage (2°C-8°C)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSaveConsignment = async () => {
    setFormError(null);
    if (!formBatchId.trim()) {
      setFormError("Batch ID is required (e.g. BAT-MCP-2026-901).");
      return;
    }
    if (!formDrugName.trim()) {
      setFormError("Pharmaceutical formulation name is required.");
      return;
    }
    const qty = parseInt(formQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setFormError("Please enter a valid positive quantity.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: formBatchId.trim(),
          productName: formDrugName.trim(),
          totalStockUnits: qty,
          storageVaultZone: formZone,
          manufacturer: "MediCare Plus Cleanroom Labs",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to log batch consignment");
      }

      setSuccessMsg(`Batch ${formBatchId.trim()} successfully registered in CDSCO ledger.`);
      setIsRestockModalOpen(false);
      setFormBatchId("");
      setFormDrugName("");
      setFormQuantity("250");
      await fetchBatches();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setFormError(err.message || "Failed to save consignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/batches");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: BatchItem[] = json.data.map((b: any) => ({
            batchId: b.batchId,
            drugName: b.productName,
            manufacturer: b.manufacturer,
            category: b.storageVaultZone?.includes("Cold") ? "Cold-Chain Formulation" : "General Therapeutics",
            zone: b.storageVaultZone?.includes("Cold")
              ? "Cold Storage (2°C-8°C)"
              : "Controlled Ambient (15°C-25°C)",
            currentTemp: b.currentVaultTemp || (b.storageVaultZone?.includes("Cold") ? "3.8°C" : "21.2°C"),
            stockUnits: Number(b.totalStockUnits) || 100,
            reorderLevel: Number(b.reorderLevel) || 50,
            mfgDate: b.mfgDate || "2026-01-01",
            expiryDate: b.expiryDate || "2028-01-01",
            status: Number(b.totalStockUnits) <= Number(b.reorderLevel) ? "Low Stock" : "Optimal",
          }));
          setBatches(mapped);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live batches", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBatchId.trim() || !formDrugName.trim()) {
      alert("Please enter both Batch ID and Formulation Name.");
      return;
    }

    const isCold = formZone.includes("Cold");
    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: formBatchId.trim(),
          productName: formDrugName.trim(),
          quantity: Number(formQuantity) || 250,
          storageVaultZone: formZone,
          currentVaultTemp: isCold ? "3.8°C" : "21.2°C",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSuccessMsg(`✓ Consignment ${formBatchId} successfully logged into CDSCO storage ledger.`);
          setTimeout(() => setSuccessMsg(null), 5000);
          setIsRestockModalOpen(false);
          setFormBatchId("");
          setFormDrugName("");
          fetchBatches();
        }
      }
    } catch (err) {
      console.error("Failed to save consignment", err);
    }
  };

  const filteredBatches = batches.filter((b) => {
    const matchSearch =
      b.drugName.toLowerCase().includes(search.toLowerCase()) ||
      b.batchId.toLowerCase().includes(search.toLowerCase()) ||
      b.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchZone = filterZone === "all" || b.zone.includes(filterZone);
    return matchSearch && matchZone;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Cold-Chain Inventory & Pharmaceutical Batch Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            CDSCO-monitored pharmaceutical storage vaults with real-time IoT temperature logging.
          </p>
        </div>

        <Button
          onClick={() => setIsRestockModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Log Inward Drug Consignment
        </Button>
      </div>

      {/* Hub Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-400 font-mono">MUMBAI BKC HUB</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">3.8°C</p>
          <p className="text-[11px] text-teal-300 font-medium mt-1">
            Zone A Vault • 1,420 Cold-Chain Units
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 font-mono">DELHI NCR HUB</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">4.2°C</p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Okhla Phase 3 Vault • 980 Units
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 font-mono">BENGALURU HUB</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">4.0°C</p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Electronic City Vault • 850 Units
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search formulation, batch number, or manufacturer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Storage Zones ({batches.length})</option>
            <option value="Cold Storage">Cold Storage (2°C - 8°C)</option>
            <option value="Controlled Ambient">Ambient Controlled (15°C - 25°C)</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-900/50">
                <th className="py-3.5 px-6 font-semibold">Batch & Formulation</th>
                <th className="py-3.5 px-4 font-semibold">Storage Vault Zone</th>
                <th className="py-3.5 px-4 font-semibold">Live Temp</th>
                <th className="py-3.5 px-4 font-semibold">Available Stock</th>
                <th className="py-3.5 px-4 font-semibold">Expiry Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBatches.map((b) => (
                <tr key={b.batchId} className="hover:bg-slate-900/40 transition-colors">
                  {/* Batch & Drug */}
                  <td className="py-4 px-6">
                    <p className="font-bold text-white text-xs">{b.drugName}</p>
                    <p className="text-[11px] font-mono text-blue-400">{b.batchId}</p>
                    <p className="text-[10px] text-slate-500">{b.manufacturer}</p>
                  </td>

                  {/* Storage Zone */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        b.zone.includes("Cold")
                          ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-300"
                      }`}
                    >
                      {b.zone}
                    </span>
                  </td>

                  {/* Temp */}
                  <td className="py-4 px-4">
                    <span className="font-mono font-bold text-white flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-teal-400" />
                      {b.currentTemp}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-white text-sm">{b.stockUnits} units</p>
                    <p className="text-[10px] text-slate-500">Reorder at {b.reorderLevel}</p>
                  </td>

                  {/* Expiry */}
                  <td className="py-4 px-4 font-mono text-slate-300">
                    <p>{b.expiryDate}</p>
                    <p className="text-[10px] text-slate-500">Mfg: {b.mfgDate}</p>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {b.status === "Optimal" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Optimal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        {b.status}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Reorder initiated for batch ${b.batchId}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold"
                    >
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Log Inward Drug Consignment</h3>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium">
                {formError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Batch ID / Consignment No. *</label>
                <input
                  type="text"
                  value={formBatchId}
                  onChange={(e) => setFormBatchId(e.target.value)}
                  placeholder="e.g. BAT-MCP-2026-901"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Pharmaceutical Formulation *</label>
                <input
                  type="text"
                  value={formDrugName}
                  onChange={(e) => setFormDrugName(e.target.value)}
                  placeholder="e.g. MediCare Plus CardioGuard Telmisartan 40mg"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity (Units) *</label>
                  <input
                    type="number"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    placeholder="250"
                    min="1"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Storage Vault Zone *</label>
                  <select
                    value={formZone}
                    onChange={(e) => setFormZone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white cursor-pointer focus:outline-none focus:border-blue-500"
                  >
                    <option value="Cold Storage (2°C-8°C)">Cold Storage (2°C-8°C)</option>
                    <option value="Controlled Ambient (15°C-25°C)">Controlled Ambient (15°C-25°C)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsRestockModalOpen(false);
                  setFormError(null);
                }}
                className="border-slate-800 text-slate-300"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveConsignment}
                className="bg-blue-600 hover:bg-blue-500 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Consignment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
