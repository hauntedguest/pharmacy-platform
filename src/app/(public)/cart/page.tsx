"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Truck,
  Tag,
  CheckCircle2,
  FileCheck2,
  UploadCloud,
  ChevronRight,
  X,
  Sparkles,
  Info,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR, mockProducts } from "@/lib/data/products";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";
import { lookupPincode, PincodeDetails } from "@/lib/services/pincode";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalMRP,
    totalSavings,
    deliveryFee,
    grandTotal,
    amountNeededForFreeShipping,
    freeShippingThreshold,
    hasPrescriptionItems,
    discountCode,
    discountAmount,
    applyDiscountCode,
    removeDiscountCode,
    prescriptionAttached,
    attachPrescription,
    removePrescription,
    addToCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [pinCode, setPinCode] = useState("400051");
  const [isPinValid, setIsPinValid] = useState(true);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState<PincodeDetails | null>({
    pinCode: "400051",
    district: "Mumbai",
    state: "Maharashtra",
    postOffices: ["Bandra Kurla Complex", "Bandra East"],
    isDeliverable: true,
    deliverySpeed: "Express Cold-Chain (2-4 Hrs)",
  });
  const [pinMessage, setPinMessage] = useState<string>(
    "⚡ Express Cold-Chain (2-4 Hrs) to Mumbai, Maharashtra"
  );
  const [showRxModal, setShowRxModal] = useState(false);
  const [tempRxFileName, setTempRxFileName] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscountCode(promoInput);
    setPromoMsg({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput("");
  };

  const handleCheckPin = async () => {
    const clean = pinCode.replace(/\D/g, "");
    if (clean.length !== 6) {
      setIsPinValid(false);
      setPinMessage("Please enter a valid 6-digit Indian PIN Code");
      setPincodeInfo(null);
      return;
    }

    setIsPinLoading(true);
    try {
      const details = await lookupPincode(clean);
      if (details) {
        setIsPinValid(true);
        setPincodeInfo(details);
        setPinMessage(
          `✓ ${details.deliverySpeed} to ${details.district}, ${details.state}`
        );
      } else {
        setIsPinValid(false);
        setPincodeInfo(null);
        setPinMessage("PIN code not serviceable or invalid. Please check.");
      }
    } catch {
      setIsPinValid(true);
      setPinMessage("✓ Deliverable via National Express Courier");
    } finally {
      setIsPinLoading(false);
    }
  };

  const handleRxUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTempRxFileName(e.target.files[0].name);
    }
  };

  const handleConfirmRx = () => {
    if (tempRxFileName) {
      attachPrescription(tempRxFileName);
      setShowRxModal(false);
      setTempRxFileName("");
    }
  };

  // Recommended essentials that aren't already in cart
  const cartProductIds = new Set(items.map((i) => i.product.id));
  const suggestedProducts = mockProducts
    .filter((p) => !cartProductIds.has(p.id) && !p.requiresPrescription)
    .slice(0, 3);

  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-slate-50/60 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-5 shadow-inner">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            You have not added any medicines or wellness formulations yet. Browse our verified CDSCO catalogue for genuine Indian pharmaceuticals.
          </p>
          <Button
            asChild
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-blue-500/25"
          >
            <Link href="/products">Explore Catalogue</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/products" className="hover:text-blue-600 transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Shopping Cart ({items.length})</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Review Your Prescription & Order Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Dispensed from Licensed Pharmacy ({brandConfig.legal.pharmacyLicense}) with cold-chain monitoring.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-rose-600 font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Cart Items & Rx Section (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Banner */}
            <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  {amountNeededForFreeShipping === 0 ? (
                    <p className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> You qualified for FREE Nationwide Express Delivery!
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-slate-200">
                      Add <strong className="text-teal-300">{formatINR(amountNeededForFreeShipping)}</strong> more medicines for <span className="text-teal-400 font-bold">FREE Express Delivery</span>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Orders over ₹499 ship free across all 19,000+ Indian PIN codes
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-36 shrink-0">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Progress</span>
                  <span>{freeShippingPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Schedule H Rx Requirement Card */}
            {hasPrescriptionItems && (
              <div className="bg-amber-500/10 border border-amber-300/60 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-amber-900">
                        Doctor Prescription Required (Schedule H Drug)
                      </h3>
                      {prescriptionAttached ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Rx Attached
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5" /> Pending Rx Attachment
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-900/90 mt-1">
                      Indian Drug Laws require a registered doctor&apos;s prescription for Schedule H medicines in your cart before dispatch.
                    </p>

                    {prescriptionAttached ? (
                      <div className="mt-3 p-3 bg-white/80 rounded-xl border border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-semibold text-gray-900 truncate max-w-xs">
                            {prescriptionAttached.fileName}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            (Attached at {prescriptionAttached.uploadedAt})
                          </span>
                        </div>
                        <button
                          onClick={removePrescription}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setShowRxModal(true)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-4 h-4" />
                          Attach Doctor Prescription
                        </button>
                        <Link
                          href="/prescriptions/upload"
                          className="text-xs text-amber-900 hover:underline font-semibold"
                        >
                          Or verify via RMP Portal ↗
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden divide-y divide-gray-100">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors"
                >
                  {/* Product Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">
                      {product.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-600">{product.brand}</span>
                        {product.requiresPrescription ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {product.prescriptionType || "Schedule H"}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            OTC
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-bold text-gray-900 text-sm sm:text-base hover:text-blue-600 transition-colors block truncate"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Pack: {product.packSize} {product.activeIngredient && `• ${product.activeIngredient}`}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-900 min-w-[28px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Pricing */}
                    <div className="text-right min-w-[100px]">
                      <p className="font-extrabold text-base text-gray-900">
                        {formatINR(product.price * quantity)}
                      </p>
                      {product.originalPrice && (
                        <p className="text-[11px] text-gray-400 line-through">
                          MRP {formatINR(product.originalPrice * quantity)}
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cross-Sell Recommendations */}
            {suggestedProducts.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
                <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Popular OTC Essentials Often Added Together
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {suggestedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl border border-gray-100 bg-slate-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-[10px] text-blue-600 font-semibold">{p.brand}</p>
                        <h4 className="font-bold text-xs text-gray-900 truncate mt-0.5">{p.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">{p.packSize}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{formatINR(p.price)}</span>
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary & Checkout (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* PIN Code Delivery Check */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Delivery Pin Code Checker</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckPin()}
                  placeholder="Enter 6-digit PIN"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCheckPin}
                  disabled={isPinLoading}
                  className="text-xs font-semibold"
                >
                  {isPinLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
                </Button>
              </div>
              <p
                className={`text-[11px] font-medium leading-tight ${
                  isPinValid ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {pinMessage}
              </p>
              {pincodeInfo && pincodeInfo.postOffices.length > 0 && (
                <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                  <span className="font-semibold text-gray-600">Post Offices: </span>
                  {pincodeInfo.postOffices.slice(0, 3).join(", ")}
                </div>
              )}
            </div>

            {/* Coupon / Promo Code */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                <Tag className="w-4 h-4 text-teal-600" />
                <span>Apply Promo Coupon</span>
              </div>

              {discountCode ? (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-teal-800">{discountCode}</p>
                    <p className="text-[11px] text-teal-600">Saved {formatINR(discountAmount)}</p>
                  </div>
                  <button
                    onClick={removeDiscountCode}
                    className="text-xs text-teal-800 hover:text-rose-600 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="e.g. FIRSTMED10"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4"
                  >
                    Apply
                  </Button>
                </form>
              )}

              {promoMsg && (
                <p
                  className={`text-[11px] font-medium ${
                    promoMsg.isError ? "text-rose-600" : "text-teal-700"
                  }`}
                >
                  {promoMsg.text}
                </p>
              )}

              <div className="text-[10px] text-gray-400 space-y-0.5">
                <p>• <strong>FIRSTMED10</strong>: 10% off on first order</p>
                <p>• <strong>WELLNESS20</strong>: 20% off on orders above ₹1,000</p>
              </div>
            </div>

            {/* Bill Details / Financial Summary */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100">
                Payment Summary
              </h3>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total Item MRP</span>
                  <span className="font-mono text-gray-500 line-through">{formatINR(totalMRP)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Direct Product Savings</span>
                    <span>-{formatINR(totalSavings)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-teal-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated GST (Included)</span>
                  <span className="text-gray-500 font-medium">Included in MRP</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        FREE
                      </span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-sm font-extrabold text-gray-900">
                  <span>Total Payable Amount</span>
                  <span className="text-xl text-blue-600 font-bold">{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* Total Savings Highlight Pill */}
              {totalSavings + discountAmount > 0 && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800">
                  🎉 Total Savings on this order: {formatINR(totalSavings + discountAmount)}
                </div>
              )}

              {/* Checkout Button */}
              <Button
                asChild
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-2xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              {/* Regulatory / Security Guarantee */}
              <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Genuine Medicines • CDSCO & FDA Approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Licensed Indian Pharmacy DL: {brandConfig.legal.pharmacyLicense}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Rx Modal */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-gray-900">Attach Doctor Prescription</h3>
              </div>
              <button
                onClick={() => setShowRxModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Upload a clear photo or PDF of your registered medical practitioner&apos;s prescription with doctor registration number visible.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
              <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">Choose file or drag here</p>
              <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, or PDF up to 10MB</p>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleRxUploadMock}
                className="mt-3 text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {tempRxFileName && (
              <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-800 font-semibold flex items-center justify-between">
                <span>Selected: {tempRxFileName}</span>
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRxModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!tempRxFileName}
                onClick={handleConfirmRx}
                className="text-xs font-bold bg-blue-600 hover:bg-blue-500"
              >
                Attach to Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
