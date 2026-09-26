"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  ShieldCheck,
  AlertTriangle,
  Pill,
  X,
  CheckCircle2,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { mockProducts, formatINR, type Product } from "@/lib/data/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingVisibilityId, setTogglingVisibilityId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields for Add/Edit
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("MediCare Plus Cleanroom Labs");
  const [category, setCategory] = useState("prescription");
  const [activeIngredient, setActiveIngredient] = useState("");
  const [packSize, setPackSize] = useState("Strip of 10");
  const [originalPrice, setOriginalPrice] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("100");
  const [requiresPrescription, setRequiresPrescription] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products?all=true");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch products from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName("");
    setBrand("MediCare Plus Cleanroom Labs");
    setCategory("prescription");
    setActiveIngredient("");
    setPackSize("Strip of 10");
    setOriginalPrice("");
    setPrice("");
    setStock("100");
    setRequiresPrescription(true);
    setIsVisible(true);
    setFormError(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setSelectedProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setActiveIngredient(p.activeIngredient || "");
    setPackSize(p.packSize);
    setOriginalPrice(p.originalPrice ? String(p.originalPrice) : "");
    setPrice(String(p.price));
    setStock(String(p.stock));
    setRequiresPrescription(p.requiresPrescription);
    setIsVisible(p.isVisible !== false);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleToggleVisibility = async (p: Product) => {
    const newVisibility = p.isVisible === false ? true : false;
    setTogglingVisibilityId(p.id);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, isVisible: newVisibility } : item))
    );

    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: newVisibility }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update visibility");
      }
      setSuccessMsg(
        `"${p.name}" is now ${newVisibility ? "VISIBLE on Storefront UI" : "HIDDEN from Storefront UI"}.`
      );
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      // Revert optimistic update on failure
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isVisible: p.isVisible !== false } : item))
      );
      setFormError(`Failed to update visibility: ${err.message}`);
    } finally {
      setTogglingVisibilityId(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete formulation");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setSuccessMsg(`Formulation "${productToDelete.name}" was permanently deleted.`);
      setProductToDelete(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveProduct = async (isEdit: boolean) => {
    setFormError(null);

    if (!name.trim()) {
      setFormError("Product formulation name is required.");
      return;
    }
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Valid selling price greater than ₹0 is required.");
      return;
    }
    const parsedStock = Number(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setFormError("Valid stock quantity (0 or greater) is required.");
      return;
    }

    const payload = {
      name: name.trim(),
      brand: brand.trim() || "MediCare Plus Cleanroom Labs",
      category,
      activeIngredient: activeIngredient.trim(),
      packSize: packSize.trim() || "Strip of 10",
      price: parsedPrice,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: parsedStock,
      requiresPrescription,
      isVisible,
    };

    setIsSubmitting(true);
    try {
      if (isEdit && selectedProduct) {
        const res = await fetch(`/api/products/${selectedProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to update product formulation");
        }
        setSuccessMsg(`Formulation "${name.trim()}" updated successfully.`);
        setIsEditModalOpen(false);
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to add product formulation");
        }
        setSuccessMsg(`New formulation "${name.trim()}" successfully registered to database.`);
        setIsAddModalOpen(false);
      }

      await fetchProducts();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setFormError(err.message || "Operation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Manage pharmaceutical master data, live PostgreSQL sync, Storefront UI visibility, and Schedule H compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            disabled={isLoading}
            className="border-slate-800 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Formulation
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-300 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Form Error Toast */}
      {formError && !isAddModalOpen && !isEditModalOpen && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between gap-2.5 text-xs text-rose-300 font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{formError}</span>
          </div>
          <button onClick={() => setFormError(null)} className="text-rose-400 hover:text-rose-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by generic salt, trade name, or active ingredient..."
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
                <th className="py-3.5 px-4 font-semibold text-center">Storefront UI Visibility</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => {
                const isProductVisible = p.isVisible !== false;
                const isToggling = togglingVisibilityId === p.id;

                return (
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

                    {/* Storefront Visibility Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleVisibility(p)}
                        disabled={isToggling}
                        title={
                          isProductVisible
                            ? "Currently Visible on Storefront. Click to Hide."
                            : "Currently Hidden from Storefront. Click to Show."
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isProductVisible
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {isToggling ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                        ) : isProductVisible ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-blue-400" />
                          Edit
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/40 text-xs font-semibold transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-white">Delete Formulation?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to permanently delete{" "}
                <strong className="text-white font-semibold">{productToDelete.name}</strong> from
                the catalogue and PostgreSQL database?
              </p>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <div>
                <span className="text-slate-500">Molecule:</span>{" "}
                <span className="text-slate-300 font-medium">
                  {productToDelete.activeIngredient || productToDelete.name}
                </span>
              </div>
              <div>
                <span className="text-slate-500">ID / Slug:</span>{" "}
                <span className="text-slate-300 font-mono">{productToDelete.slug || productToDelete.id}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="flex-1 border-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Formulation Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {isEditModalOpen ? "Edit Clinical Formulation" : "Add New Clinical Formulation"}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
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

            <div className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Commercial Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MediCare Plus CardioGuard Telmisartan 40mg"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Active Molecule / Generic Salt</label>
                  <input
                    type="text"
                    value={activeIngredient}
                    onChange={(e) => setActiveIngredient(e.target.value)}
                    placeholder="e.g. Telmisartan IP 40mg"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="prescription">Prescription (Schedule H)</option>
                    <option value="supplement">Supplements & Vitamins</option>
                    <option value="medical-device">Medical Devices</option>
                    <option value="ayurvedic">Ayurvedic</option>
                    <option value="otc">OTC Medications</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Formulation Division / Lab</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. MediCare Plus Cleanroom Labs"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Pack Size *</label>
                  <input
                    type="text"
                    value={packSize}
                    onChange={(e) => setPackSize(e.target.value)}
                    placeholder="e.g. Strip of 15 Tablets"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">MRP (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="250"
                    min="1"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="199"
                    min="1"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Stock Units *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="100"
                    min="0"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Prescription Rule Toggle */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={requiresPrescription}
                    onChange={(e) => setRequiresPrescription(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Requires Doctor Prescription (Schedule H / H1 under CDSCO Rules)</span>
                </label>
              </div>

              {/* Storefront UI Visibility Toggle */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-200">Show in Storefront UI</div>
                    <div className="text-[11px] text-slate-400">
                      When enabled, customers can view and purchase this product on the public website.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                disabled={isSubmitting}
                className="border-slate-800 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSaveProduct(isEditModalOpen)}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                {isSubmitting ? "Saving..." : isEditModalOpen ? "Save Changes" : "Save Formulation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
