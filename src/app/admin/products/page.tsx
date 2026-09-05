"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  ShieldCheck,
  AlertTriangle,
  Pill,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { mockProducts, formatINR, type Product } from "@/lib/data/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtered List
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      (p.activeIngredient && p.activeIngredient.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Clinical Formulations & Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage pharmaceutical master data, Indian MRP / selling prices, and Schedule H compliance.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Formulation
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by generic salt, trade name, or manufacturer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            <option value="prescription">Prescription (Schedule H)</option>
            <option value="supplement">Supplements & Vitamins</option>
            <option value="medical-device">Medical Devices</option>
            <option value="ayurvedic">Ayurvedic</option>
            <option value="otc">OTC Medications</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-900/50">
                <th className="py-3.5 px-6 font-semibold">Formulation & Molecule</th>
                <th className="py-3.5 px-4 font-semibold">Category / Classification</th>
                <th className="py-3.5 px-4 font-semibold">Pack Size</th>
                <th className="py-3.5 px-4 font-semibold">Selling Price (₹)</th>
                <th className="py-3.5 px-4 font-semibold">Stock Level</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Name & Molecule */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs hover:text-blue-400 transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {p.brand} {p.activeIngredient && `• ${p.activeIngredient}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Classification */}
                  <td className="py-4 px-4">
                    {p.requiresPrescription ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        <AlertTriangle className="w-3 h-3" />
                        {p.prescriptionType || "Schedule H"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                        <ShieldCheck className="w-3 h-3" />
                        OTC
                      </span>
                    )}
                  </td>

                  {/* Pack Size */}
                  <td className="py-4 px-4 text-slate-300 font-medium">{p.packSize}</td>

                  {/* Pricing */}
                  <td className="py-4 px-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-white text-sm">{formatINR(p.price)}</span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-slate-500 line-through">
                          {formatINR(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-4 px-4">
                    {p.stock > 50 ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {p.stock} units
                      </span>
                    ) : p.stock > 0 ? (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Low ({p.stock} units)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-medium">Out of Stock</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">Add New Clinical Formulation</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Commercial Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. MediCare Plus CardioGuard Telmisartan 40mg"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Formulation Division / Lab *</label>
                  <input
                    type="text"
                    placeholder="e.g. MediCare Plus Cleanroom Labs"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Pack Size *</label>
                  <input
                    type="text"
                    placeholder="e.g. Strip of 15 Tablets"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">MRP (INR ₹) *</label>
                  <input
                    type="number"
                    placeholder="250"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Selling Price (INR ₹) *</label>
                  <input
                    type="number"
                    placeholder="199"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span>Requires Doctor Prescription (Schedule H / H1 under CDSCO Rules)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="border-slate-800 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                Save Formulation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
