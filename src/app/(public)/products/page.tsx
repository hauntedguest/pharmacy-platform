"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  LayoutGrid,
  List,
  Sparkles,
  FileText,
  ChevronDown,
  Pill,
  Star,
  AlertCircle,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import ProductCard3D from "@/components/products/ProductCard3D";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { mockProducts, formatINR, type Product } from "@/lib/data/products";

type CategoryFilter = Product["category"] | "all";
type PrescriptionFilter = "all" | "rx-only" | "otc-only";
type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "bestseller";
type ViewMode = "grid" | "list";

function ProductsContent() {
  const searchParams = useSearchParams();

  // Initial states from URL params if available
  const initialCategory = (searchParams.get("category") as CategoryFilter) || "all";
  const initialSearch = searchParams.get("q") || "";

  // State hooks
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(initialCategory);
  const [selectedDosageForms, setSelectedDosageForms] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [prescriptionFilter, setPrescriptionFilter] = useState<PrescriptionFilter>("all");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Fetch live products inventory from database
  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setProducts(json.data);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch live inventory:", err);
      }
    }
    fetchLiveProducts();
  }, []);

  // Sync category param from URL
  useEffect(() => {
    const cat = searchParams.get("category") as CategoryFilter;
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Derived unique lists for filters
  const allBrands = useMemo(() => {
    const brands = Array.from(
      new Set(
        products
          .map((p) => p.brand)
          .filter((b): b is string => Boolean(b && typeof b === "string" && b.trim().length > 0))
      )
    );
    return brands.sort();
  }, [products]);

  const allDosageForms = useMemo(() => {
    const forms = Array.from(
      new Set(
        products
          .map((p) => p.dosageForm)
          .filter((f): f is Product["dosageForm"] => Boolean(f && typeof f === "string" && f.trim().length > 0))
      )
    );
    return forms.sort();
  }, [products]);

  // Category Tabs Configuration
  const categoryTabs: { label: string; value: CategoryFilter; count: number }[] = useMemo(() => [
    { label: "All Formulations", value: "all", count: products.length },
    {
      label: "Prescription (Rx)",
      value: "prescription",
      count: products.filter((p) => p.category === "prescription").length,
    },
    {
      label: "Supplements",
      value: "supplement",
      count: products.filter((p) => p.category === "supplement").length,
    },
    {
      label: "Medical Devices",
      value: "medical-device",
      count: products.filter((p) => p.category === "medical-device").length,
    },
    {
      label: "Ayurvedic & Herbal",
      value: "ayurvedic",
      count: products.filter((p) => p.category === "ayurvedic").length,
    },
    {
      label: "OTC Care",
      value: "otc",
      count: products.filter((p) => p.category === "otc").length,
    },
  ], [products]);

  // Toggle Handlers
  const toggleDosageForm = (form: string) => {
    setSelectedDosageForms((prev) =>
      prev.includes(form) ? prev.filter((f) => f !== form) : [...prev, form]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDosageForms([]);
    setSelectedBrands([]);
    setPrescriptionFilter("all");
    setMaxPrice(3000);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy("featured");
  };

  // Filter calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchIngredient = product.activeIngredient?.toLowerCase().includes(q) || false;
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchIngredient && !matchDesc && !matchTags) {
          return false;
        }
      }

      // Category match
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Prescription Type
      if (prescriptionFilter === "rx-only" && !product.requiresPrescription) {
        return false;
      }
      if (prescriptionFilter === "otc-only" && product.requiresPrescription) {
        return false;
      }

      // Dosage Forms
      if (
        selectedDosageForms.length > 0 &&
        !selectedDosageForms.includes(product.dosageForm)
      ) {
        return false;
      }

      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price Filter
      if (product.price > maxPrice) {
        return false;
      }

      // In-stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    prescriptionFilter,
    selectedDosageForms,
    selectedBrands,
    maxPrice,
    inStockOnly,
    minRating,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "bestseller":
        return list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
      case "featured":
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  // Active filter count
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (prescriptionFilter !== "all" ? 1 : 0) +
    selectedDosageForms.length +
    selectedBrands.length +
    (maxPrice < 3000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Verified CDSCO & FDA Approved Formulations
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Pharmaceutical Catalogue
              </h1>
              <p className="text-sm sm:text-base text-blue-200 mt-2 max-w-2xl">
                Explore clinical-grade prescription medications, standardized nutraceuticals, and medical diagnostics with cold-chain nationwide delivery.
              </p>
            </div>

            {/* Quick Rx Upload Pill Banner */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 md:max-w-sm shrink-0">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center shrink-0 text-blue-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Have a Doctor&apos;s Prescription?</h4>
                  <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">
                    Upload your Rx and our licensed PharmDs will verify and dispense your dosage.
                  </p>
                  <Button asChild size="sm" className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-xs">
                    <Link href="/prescriptions/upload">Upload Prescription (Rx)</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-gray-200">
          {categoryTabs.map((tab) => {
            const isActive = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort, and Controls Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, generic molecule (e.g. Paracetamol, D3, Telmisartan)..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort, View Toggle, Mobile Filter Button */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <span className="hidden sm:inline text-xs text-gray-500 mr-2 font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer"
                >
                  <option value="featured">Featured & Recommended</option>
                  <option value="bestseller">Bestsellers First</option>
                  <option value="price-asc">Price: Low to High (₹)</option>
                  <option value="price-desc">Price: High to Low (₹)</option>
                  <option value="rating">Highest Rated (★)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle (Grid / List) */}
            <div className="hidden sm:flex items-center p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-gray-400 font-medium">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
                Search: &quot;{searchQuery}&quot;
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium capitalize">
                Category: {selectedCategory.replace("-", " ")}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
              </span>
            )}
            {prescriptionFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                {prescriptionFilter === "rx-only" ? "Rx (Schedule H) Only" : "OTC Only"}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setPrescriptionFilter("all")} />
              </span>
            )}
            {selectedDosageForms.map((form, idx) => (
              <span
                key={`active-df-${form}-${idx}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-xs font-medium"
              >
                {form}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleDosageForm(form)} />
              </span>
            ))}
            {selectedBrands.map((brand, idx) => (
              <span
                key={`active-brand-${brand}-${idx}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium"
              >
                {brand}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(brand)} />
              </span>
            ))}
            {maxPrice < 3000 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium">
                Under {formatINR(maxPrice)}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(3000)} />
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                In Stock Only
                <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                {minRating}★ & above
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}

        {/* 2-Column Layout: Sidebar Filters + Products Grid/List */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Prescription Protocol Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Prescription Protocol
                </label>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Items" },
                    { id: "rx-only", label: "Schedule H / Rx Only" },
                    { id: "otc-only", label: "OTC (No Rx Required)" },
                  ].map((option) => (
                    <label
                      key={`desktop-rx-${option.id}`}
                      className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-gray-900"
                    >
                      <input
                        type="radio"
                        name="prescription"
                        checked={prescriptionFilter === option.id}
                        onChange={() => setPrescriptionFilter(option.id as PrescriptionFilter)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-gray-300"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range (INR) */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Max Price (INR)
                  </label>
                  <span className="text-xs font-bold text-blue-600">
                    {formatINR(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={3000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>₹50</span>
                  <span>₹3,000+</span>
                </div>
              </div>

              {/* Dosage Form */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Dosage Form
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {allDosageForms.map((form, idx) => {
                    const isChecked = selectedDosageForms.includes(form);
                    return (
                      <label
                        key={`desktop-dosage-${form}-${idx}`}
                        className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-gray-900"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDosageForm(form)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                          />
                          <span>{form}</span>
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {products.filter((p) => p.dosageForm === form).length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Top Pharmaceutical Brands */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Pharmaceutical Brand
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {allBrands.map((brand, idx) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={`desktop-brand-${brand}-${idx}`}
                        className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-gray-900"
                      >
                        <span className="flex items-center gap-2 truncate pr-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(brand)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                          />
                          <span className="truncate">{brand}</span>
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {products.filter((p) => p.brand === brand).length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Stock & Rating Toggles */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>In Stock Only</span>
                </label>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex gap-1.5">
                    {[0, 4.5, 4.8].map((ratingVal) => (
                      <button
                        key={ratingVal}
                        onClick={() => setMinRating(ratingVal)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 ${
                          minRating === ratingVal
                            ? "bg-blue-50 border-blue-300 text-blue-700 font-bold"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {ratingVal === 0 ? (
                          "All"
                        ) : (
                          <>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{ratingVal}+</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Output Grid / List */}
          <main className="lg:col-span-3">
            {/* Results Count Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-gray-500 font-medium">
                Showing <strong className="text-gray-900">{sortedProducts.length}</strong> of{" "}
                {products.length} clinical formulations
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <Truck className="w-3.5 h-3.5" />
                <span>Express 2-Hour Delivery in Metro Areas</span>
              </div>
            </div>

            {/* Zero State / No Products Found */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No matching therapeutic products found
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  We couldn&apos;t find any formulations matching your specific filter criteria. Try broadening your search or resetting filters.
                </p>
                <Button onClick={resetAllFilters} variant="primary">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid View with 3D Tilt Cards */
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard3D key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Detailed List View */
              <div className="space-y-4">
                {sortedProducts.map((product) => {
                  const discountPercent = product.originalPrice
                    ? Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )
                    : 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-blue-200">
                        {/* Left Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Pill className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-blue-600">
                                {product.brand}
                              </span>
                              <span>•</span>
                              <span className="text-xs text-gray-500">
                                {product.dosageForm || "Capsule"}
                              </span>
                              {product.requiresPrescription ? (
                                <Badge variant="warning" className="text-[10px] py-0">
                                  {product.prescriptionType || "Schedule H"}
                                </Badge>
                              ) : (
                                <Badge variant="success" className="text-[10px] py-0">
                                  OTC
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-lg">
                              {product.description}
                            </p>
                            {product.activeIngredient && (
                              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                                Active: {product.activeIngredient}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Pricing & CTA */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <div className="text-left sm:text-right">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xl font-bold text-gray-900">
                                {formatINR(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatINR(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            {discountPercent > 0 && (
                              <span className="text-[11px] font-bold text-emerald-600">
                                {discountPercent}% OFF
                              </span>
                            )}
                            {product.packSize && (
                              <p className="text-[11px] text-gray-400">{product.packSize}</p>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-600">
                            <span>View Specs</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer / Slide-Over Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Filter Products</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              {/* Prescription Protocol */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Prescription Protocol
                </label>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Items" },
                    { id: "rx-only", label: "Schedule H / Rx Only" },
                    { id: "otc-only", label: "OTC (No Rx Required)" },
                  ].map((option) => (
                    <label
                      key={`mobile-rx-${option.id}`}
                      className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="mobile-prescription"
                        checked={prescriptionFilter === option.id}
                        onChange={() => setPrescriptionFilter(option.id as PrescriptionFilter)}
                        className="text-blue-600 h-3.5 w-3.5"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-blue-600">
                    {formatINR(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={3000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg accent-blue-600"
                />
              </div>

              {/* Dosage Forms */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Dosage Form
                </label>
                <div className="space-y-2">
                  {allDosageForms.map((form, idx) => (
                    <label
                      key={`mobile-dosage-${form}-${idx}`}
                      className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDosageForms.includes(form)}
                        onChange={() => toggleDosageForm(form)}
                        className="rounded text-blue-600 h-3.5 w-3.5"
                      />
                      <span>{form}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Brand
                </label>
                <div className="space-y-2">
                  {allBrands.map((brand, idx) => (
                    <label
                      key={`mobile-brand-${brand}-${idx}`}
                      className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded text-blue-600 h-3.5 w-3.5"
                      />
                      <span className="truncate">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="flex-1 text-xs"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 text-xs"
              >
                Apply ({sortedProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
