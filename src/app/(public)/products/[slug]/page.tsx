"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  AlertTriangle,
  Star,
  CheckCircle2,
  Share2,
  Heart,
  ChevronRight,
  Pill,
  Thermometer,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductCard3D from "@/components/products/ProductCard3D";
import { getProductBySlug, mockProducts, formatINR, type Product } from "@/lib/data/products";
import { brandConfig } from "@/lib/config/brand";
import { useCart } from "@/context/CartContext";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const initialProduct =
    getProductBySlug(resolvedParams.slug) ||
    mockProducts.find((p) => p.id === resolvedParams.slug || p.slug === resolvedParams.slug) ||
    null;

  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProduct);
  const [hasChecked, setHasChecked] = useState<boolean>(Boolean(initialProduct));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "composition" | "safety" | "faq">("overview");
  const [pinCode, setPinCode] = useState("400051");
  const [isPinChecked, setIsPinChecked] = useState(true);

  // Fetch live product from API
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setProduct(json.data);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch live product details:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasChecked(true);
        }
      }
    }
    fetchLiveProduct();
    return () => {
      isMounted = false;
    };
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-slate-50/60 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-sm w-full mx-4">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-900">Loading Formulation</h3>
          <p className="text-xs text-gray-500 mt-1">Retrieving verified laboratory data...</p>
        </div>
      </div>
    );
  }

  if (!product && hasChecked) {
    notFound();
  }

  if (!product) {
    return null;
  }

  const isSoldOut = (product.stock ?? 0) <= 0 || product.inStock === false;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Related Products from same category or brand
  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Catalogue
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link
              href={`/products?category=${product.category}`}
              className="capitalize hover:text-blue-600 transition-colors"
            >
              {product.category.replace("-", " ")}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Visual / Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
              {/* Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                {isSoldOut ? (
                  <Badge variant="danger" className="text-xs uppercase font-extrabold tracking-wider bg-rose-600 text-white animate-pulse">
                    SOLD OUT
                  </Badge>
                ) : product.requiresPrescription ? (
                  <Badge variant="warning" className="text-xs uppercase font-bold tracking-wider">
                    {product.prescriptionType || "Schedule H"} Drug
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-xs uppercase font-bold tracking-wider">
                    OTC Formulation
                  </Badge>
                )}
                {discountPercent > 0 && !isSoldOut && (
                  <Badge variant="danger" className="text-xs font-bold">
                    {discountPercent}% SAVINGS
                  </Badge>
                )}
              </div>

              {/* Ambient Orb */}
              <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-blue-400/10 via-teal-400/10 to-indigo-400/10 blur-3xl pointer-events-none" />

              {/* 3D Visual Centerpiece */}
              <div className={`relative z-10 w-44 h-44 rounded-3xl bg-gradient-to-br from-blue-50/80 to-teal-50/80 border border-blue-100 flex flex-col items-center justify-center shadow-lg ${isSoldOut ? "grayscale opacity-75" : ""}`}>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-md mb-3">
                  <Pill className="w-10 h-10" />
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {product.dosageForm}
                </span>
                {product.dosage && (
                  <span className="text-[10px] text-gray-500 font-mono mt-0.5">{product.dosage}</span>
                )}
              </div>

              {/* Verified Purity Seal */}
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>100% Genuine • Batch HPLC Tested</span>
              </div>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-3 text-center">
                <Thermometer className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-[11px] font-bold text-gray-800">Cold Chain</p>
                <p className="text-[10px] text-gray-400">2°C – 8°C Monitored</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-3 text-center">
                <Truck className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                <p className="text-[11px] font-bold text-gray-800">Express Delivery</p>
                <p className="text-[10px] text-gray-400">{brandConfig.locale.serviceablePinCodes} PIN Codes</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-3 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-[11px] font-bold text-gray-800">FDA Licensed</p>
                <p className="text-[10px] text-gray-400">{brandConfig.legal.pharmacyLicense.split(" / ")[0]}</p>
              </div>
            </div>
          </div>

          {/* Right Core Details & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header / Brand & Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                  {product.brand} {product.manufacturer && `• ${product.manufacturer}`}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Pack Size */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span className="text-gray-900 font-bold">{product.rating}</span>
                  <span className="text-gray-400 ml-1">({product.reviewCount} verified reviews)</span>
                </div>
                <span>•</span>
                <span className="font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                  {product.packSize}
                </span>
                {isSoldOut ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Sold Out • Out of Stock
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.stock} units left)
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                      {formatINR(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base sm:text-lg text-gray-400 line-through">
                        MRP {formatINR(product.originalPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && !isSoldOut && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Inclusive of all applicable Indian taxes (GST)
                  </p>
                </div>
              </div>

              {/* Schedule H / Prescription Warning Box */}
              {product.requiresPrescription && (
                <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-300/40 text-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Schedule H Prescription Drug Mandate
                    </h4>
                    <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                      As per the Drugs and Cosmetics Act of India, this medication requires a valid prescription from a Registered Medical Practitioner (RMP). You will be prompted to upload your Rx during checkout or via our pharmacist verification portal.
                    </p>
                  </div>
                </div>
              )}

              {/* Sold Out Notice */}
              {isSoldOut && (
                <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                      Currently Out of Stock
                    </h4>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      This formulation is temporarily sold out due to high clinical demand. Our next batch is undergoing analytical testing and will be released to inventory soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity & CTA */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <div className={`flex items-center border border-gray-300 rounded-xl bg-gray-50 p-1 w-full sm:w-auto justify-between ${isSoldOut ? "opacity-40 pointer-events-none" : ""}`}>
                  <button
                    disabled={isSoldOut || quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded-lg transition-colors disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-4 font-bold text-sm text-gray-900">{isSoldOut ? 0 : quantity}</span>
                  <button
                    disabled={isSoldOut || quantity >= product.stock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded-lg transition-colors disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={isSoldOut}
                  onClick={() => !isSoldOut && addToCart(product, quantity)}
                  className={`w-full sm:flex-1 font-semibold text-sm shadow-md ${
                    isSoldOut
                      ? "bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 shadow-none"
                      : "shadow-blue-500/20"
                  }`}
                >
                  {isSoldOut
                    ? "Sold Out • Temporarily Unavailable"
                    : product.requiresPrescription
                    ? "Add to Cart (Rx Verification)"
                    : "Add to Cart"}
                </Button>

                {!isSoldOut && (
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    onClick={() => addToCart(product, quantity)}
                    className="w-full sm:w-auto font-semibold text-sm"
                  >
                    <Link href="/checkout">Buy Now</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Delivery PIN Code Checker */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Delivery Estimation across India</span>
              </div>
              <div className="flex gap-2 max-w-sm mt-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Enter 6-digit PIN Code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPinChecked(true)}
                  className="text-xs"
                >
                  Check
                </Button>
              </div>
              {isPinChecked && (
                <div className="mt-3 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Express Delivery Available in Mumbai / Metro Areas within <strong>2 to 4 Hours</strong>. Standard Cold-Chain Delivery in <strong>24–48 Hours</strong>.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabbed Technical Specifications & Clinical Info */}
        <div className="mt-14 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
          {/* Tab Navigation */}
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Clinical Overview" },
              { id: "composition", label: "Composition & Active Salts" },
              { id: "safety", label: "Usage, Warnings & Storage" },
              { id: "faq", label: "Pharmacist FAQs" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-2 text-sm font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6 text-sm text-gray-700 leading-relaxed">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Therapeutic Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase">Primary Indication</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {product.subCategory || "General Therapeutic Care"}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase">Dosage Form</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{product.dosageForm}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "composition" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                    Active Pharmaceutical Ingredients (API)
                  </h4>
                  <p className="text-sm font-mono text-blue-800">
                    {product.composition || product.activeIngredient || "Pharmaceutical Grade Formulation"}
                  </p>
                </div>
                <div className="text-xs text-gray-500 space-y-2">
                  <p>• Formulated strictly in accordance with Indian Pharmacopoeia (IP) standards.</p>
                  <p>• Zero heavy-metal contaminants; certified analytical batch report available upon request.</p>
                </div>
              </div>
            )}

            {activeTab === "safety" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Recommended Usage</h3>
                  <p className="text-gray-600">{product.usage}</p>
                </div>

                {product.warnings && product.warnings.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Contraindications & Warnings
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                      {product.warnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.storage && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Storage Instructions</h3>
                    <p className="text-xs text-gray-600">{product.storage}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "faq" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">
                    Do I need a prescription to order this medication?
                  </h4>
                  <p className="text-xs text-gray-600">
                    {product.requiresPrescription
                      ? "Yes. This is classified as a Schedule H formulation under CDSCO guidelines and requires a valid doctor's prescription."
                      : "No. This formulation is classified as OTC (Over-The-Counter) and does not require a prescription."}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">
                    How is temperature control maintained during transit in India?
                  </h4>
                  <p className="text-xs text-gray-600">
                    All temperature-sensitive formulations are dispatched in insulated thermal packaging with phase-change cold packs, monitored under 2°C to 8°C guidelines nationwide.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Formulations Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge variant="info" className="mb-2">
                  Similar Formulations
                </Badge>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Related Clinical Products
                </h2>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/products">
                  View All
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard3D key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
