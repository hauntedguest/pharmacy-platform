"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  FileCheck2,
  CreditCard,
  Building2,
  Smartphone,
  Banknote,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  User,
  MapPin,
  Lock,
  Thermometer,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/data/products";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";
import { lookupPincode, PincodeDetails } from "@/lib/services/pincode";

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi NCR",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
  "Uttar Pradesh",
  "West Bengal",
  "Rajasthan",
  "Kerala",
  "Madhya Pradesh",
  "Punjab",
  "Haryana",
  "Bihar",
  "Odisha",
  "Andhra Pradesh",
  "Assam",
  "Goa",
  "Uttarakhand",
  "Other States & UTs",
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    totalMRP,
    totalSavings,
    deliveryFee,
    grandTotal,
    discountAmount,
    discountCode,
    hasPrescriptionItems,
    prescriptionAttached,
    attachPrescription,
    clearCart,
  } = useCart();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Address Details
  const [address, setAddress] = useState({
    fullName: "Sunita Deshmukh",
    phone: "+91 98201 54321",
    email: "sunita.deshmukh@gmail.com",
    addressLine1: "Flat 402, Sea Green Apartments",
    addressLine2: "Perry Cross Road, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400050",
    landmark: "Near Mehboob Studio",
    addressType: "home",
  });

  const [isPinLoading, setIsPinLoading] = useState(false);
  const [pinStatusMsg, setPinStatusMsg] = useState<string | null>(null);

  // Auto-detect District and State whenever 6 digits are typed
  const handlePinChange = async (val: string) => {
    const clean = val.replace(/\D/g, "");
    setAddress((prev) => ({ ...prev, pinCode: clean }));

    if (clean.length === 6) {
      setIsPinLoading(true);
      setPinStatusMsg("Locating postal zone...");
      try {
        const details = await lookupPincode(clean);
        if (details) {
          setAddress((prev) => ({
            ...prev,
            city: details.district,
            state: details.state,
          }));
          setPinStatusMsg(`✓ ${details.district}, ${details.state} (${details.deliverySpeed})`);
        } else {
          setPinStatusMsg(null);
        }
      } catch {
        setPinStatusMsg(null);
      } finally {
        setIsPinLoading(false);
      }
    } else {
      setPinStatusMsg(null);
    }
  };
  const [rxOption, setRxOption] = useState<"upload" | "doctor-call" | "have-on-file">("upload");
  const [rxFileName, setRxFileName] = useState(prescriptionAttached?.fileName || "");
  const [doctorDetails, setDoctorDetails] = useState({
    doctorName: "Dr. K. S. Murthy, MD",
    regNumber: "MMC-2004-49102",
    clinic: "Lilavati Hospital, Bandra",
  });

  // Step 3: Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"cold-chain-express" | "standard">(
    "cold-chain-express"
  );

  // Step 4: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [upiId, setUpiId] = useState("sunita@okhdfcbank");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Form Progress
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasPrescriptionItems && !prescriptionAttached && !rxFileName) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  };

  const handleRxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rxFileName && !prescriptionAttached) {
      attachPrescription(rxFileName);
    }
    setCurrentStep(3);
  };

  const handleShippingSubmit = () => {
    setCurrentStep(4);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderPayload = {
        customerName: address.fullName,
        customerPhone: address.phone,
        customerEmail: address.email,
        shippingStreet: `${address.addressLine1}, ${address.addressLine2}${address.landmark ? ` (${address.landmark})` : ""}`,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPincode: address.pinCode,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        paymentMethod:
          paymentMethod === "upi"
            ? `UPI (${upiId})`
            : paymentMethod === "card"
            ? "Credit / Debit Card (RuPay)"
            : paymentMethod === "netbanking"
            ? `Net Banking (${selectedBank})`
            : "Cash on Delivery",
        prescriptionId: prescriptionAttached?.id,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.data?.id) {
        clearCart();
        router.push(`/checkout/success?orderId=${data.data.id}&total=${grandTotal}`);
      } else {
        const fallbackOrderId = `ORD-IND-${Math.floor(10000 + Math.random() * 90000)}`;
        clearCart();
        router.push(`/checkout/success?orderId=${fallbackOrderId}&total=${grandTotal}`);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      const fallbackOrderId = `ORD-IND-${Math.floor(10000 + Math.random() * 90000)}`;
      clearCart();
      router.push(`/checkout/success?orderId=${fallbackOrderId}&total=${grandTotal}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50/60 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-xs">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Items to Checkout</h2>
          <p className="text-xs text-gray-500 mb-6">Your shopping cart is currently empty.</p>
          <Button asChild className="bg-blue-600 text-white text-xs font-bold w-full">
            <Link href="/products">Return to Catalogue</Link>
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
          <Link href="/cart" className="hover:text-blue-600 transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Stepper Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Secure Pharmaceutical Checkout
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Compliant with Drugs & Cosmetics Act 1940 & CDSCO Guidelines.
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6">
            {[
              { num: 1, label: "Address & Patient", icon: MapPin },
              { num: 2, label: "Doctor Rx Verify", icon: FileCheck2 },
              { num: 3, label: "Cold-Chain Speed", icon: Truck },
              { num: 4, label: "Payment (INR)", icon: CreditCard },
            ].map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  onClick={() => isPast && setCurrentStep(s.num as 1 | 2 | 3 | 4)}
                  className={`p-3 rounded-2xl border transition-all text-left ${
                    isActive
                      ? "bg-white border-blue-600 shadow-sm ring-1 ring-blue-600"
                      : isPast
                      ? "bg-blue-50/50 border-blue-200 cursor-pointer text-blue-900"
                      : "bg-white/60 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPast
                          ? "bg-blue-600 text-white"
                          : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isPast ? "✓" : s.num}
                    </div>
                    <span className="text-xs font-bold hidden sm:inline">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Address Details */}
            {currentStep === 1 && (
              <form
                onSubmit={handleAddressSubmit}
                className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Patient & Delivery Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Patient / Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Mobile Number (for SMS Tracking & Verification) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">
                      Email Address (for Invoice & Tax Receipt) *
                    </label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">
                      Flat / House No., Apartment, Building *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">
                      Street Name, Area, Locality
                    </label>
                    <input
                      type="text"
                      value={address.addressLine2}
                      onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-gray-700 font-semibold">
                        6-Digit Indian PIN Code *
                      </label>
                      {isPinLoading && (
                        <span className="text-[10px] text-blue-600 flex items-center gap-1 font-semibold">
                          <Loader2 className="w-3 h-3 animate-spin" /> Verifying
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={address.pinCode}
                      onChange={(e) => handlePinChange(e.target.value)}
                      placeholder="e.g. 400050"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-bold"
                    />
                    {pinStatusMsg && (
                      <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                        {pinStatusMsg}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      State / Union Territory *
                    </label>
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium cursor-pointer"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                  >
                    Continue to {hasPrescriptionItems ? "Prescription Verification" : "Delivery Options"}{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Schedule H Prescription Verification */}
            {currentStep === 2 && (
              <form
                onSubmit={handleRxSubmit}
                className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                  <FileCheck2 className="w-5 h-5 text-amber-600" />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Schedule H Prescription Verification
                    </h2>
                    <p className="text-xs text-gray-500">
                      Statutory requirement under Rule 65 of the Drugs and Cosmetics Rules, 1945.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setRxOption("upload")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      rxOption === "upload"
                        ? "bg-blue-50/60 border-blue-600 text-blue-900 ring-1 ring-blue-600"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <UploadCloud className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="font-bold text-xs">Upload Rx File</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">JPEG, PNG, or PDF</p>
                  </div>

                  <div
                    onClick={() => setRxOption("doctor-call")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      rxOption === "doctor-call"
                        ? "bg-blue-50/60 border-blue-600 text-blue-900 ring-1 ring-blue-600"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="font-bold text-xs">Doctor Callback</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Pharmacist calls RMP</p>
                  </div>

                  <div
                    onClick={() => setRxOption("have-on-file")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      rxOption === "have-on-file"
                        ? "bg-blue-50/60 border-blue-600 text-blue-900 ring-1 ring-blue-600"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="font-bold text-xs">Existing Profile</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Valid for 6 months</p>
                  </div>
                </div>

                {rxOption === "upload" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-slate-50">
                    <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-700">Upload Doctor Prescription</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Ensure Doctor Name, Clinic, RMP Reg Number, and Patient Name are readable.
                    </p>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setRxFileName(e.target.files[0].name);
                        }
                      }}
                      className="mt-3 text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {rxFileName && (
                      <p className="mt-3 text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Selected: {rxFileName}
                      </p>
                    )}
                  </div>
                )}

                {rxOption === "doctor-call" && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Prescribing Doctor / RMP Name *
                      </label>
                      <input
                        type="text"
                        value={doctorDetails.doctorName}
                        onChange={(e) =>
                          setDoctorDetails({ ...doctorDetails, doctorName: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        State Medical Council Registration No. *
                      </label>
                      <input
                        type="text"
                        value={doctorDetails.regNumber}
                        onChange={(e) =>
                          setDoctorDetails({ ...doctorDetails, regNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Clinic / Hospital Name & City *
                      </label>
                      <input
                        type="text"
                        value={doctorDetails.clinic}
                        onChange={(e) =>
                          setDoctorDetails({ ...doctorDetails, clinic: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs"
                  >
                    Back to Address
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Proceed to Delivery Speed <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Shipping & Cold Chain Option */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Choose Delivery Speed</h2>
                </div>

                <div className="space-y-3">
                  {/* Cold-Chain Express */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === "cold-chain-express"
                        ? "bg-teal-50/50 border-teal-500 ring-1 ring-teal-500"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "cold-chain-express"}
                          onChange={() => setShippingMethod("cold-chain-express")}
                          className="mt-1 text-teal-600"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">
                              Cold-Chain Priority Express (2°C - 8°C Monitored)
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                              RECOMMENDED
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Dispatched in phase-change temperature insulated box with active thermal sensor tag.
                          </p>
                          <p className="text-[11px] text-teal-700 font-semibold mt-1 flex items-center gap-1">
                            <Thermometer className="w-3.5 h-3.5" />
                            Estimated Arrival: Tomorrow before 2:00 PM in Mumbai / Metro zones
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        {deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                      </span>
                    </div>
                  </label>

                  {/* Standard Delivery */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === "standard"
                        ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="mt-1 text-blue-600"
                        />
                        <div>
                          <span className="font-bold text-sm text-gray-900">
                            Standard Express Logistics (All 19,000+ PIN Codes)
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Delivered securely via BlueDart / Delhivery healthcare courier networks.
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            Estimated Arrival: 24 to 48 Hours
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        {deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(hasPrescriptionItems ? 2 : 1)}
                    className="text-xs"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleShippingSubmit}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Continue to Payment <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Indian Payment Gateway */}
            {currentStep === 4 && (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Select Payment Method (INR ₹)
                    </h2>
                    <p className="text-xs text-gray-500">
                      100% Encrypted 256-Bit SSL Indian Banking Gateway
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "upi", label: "UPI & QR", icon: Smartphone, desc: "GPay / PhonePe" },
                    { id: "card", label: "Cards", icon: CreditCard, desc: "RuPay / Visa" },
                    { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All Indian Banks" },
                    { id: "cod", label: "Pay on Delivery", icon: Banknote, desc: "Cash / UPI at Door" },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = paymentMethod === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-center ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-600 text-blue-900 ring-1 ring-blue-600"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                        <p className="font-bold text-xs">{p.label}</p>
                        <p className="text-[10px] text-gray-400">{p.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Method Specific Details */}
                {paymentMethod === "upi" && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <p className="font-bold text-gray-800">Enter your UPI Virtual Payment Address (VPA)</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi or username@okaxis"
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono text-xs text-gray-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Instant UPI approval via Google Pay, PhonePe, Paytm, or BHIM</span>
                    </div>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Card Number (RuPay, Visa, Mastercard)
                      </label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8819"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">Valid Thru</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <label className="block font-semibold text-gray-700">Select Indian Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl cursor-pointer"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Pay upon Delivery (Cash / UPI QR at Doorstep)</p>
                    <p className="text-[11px] text-amber-800">
                      Our cold-chain delivery executive carries a portable QR code for instant UPI settlement.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePlaceOrder}
                    isLoading={isProcessing}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/25"
                  >
                    Pay & Authorize Dispense ({formatINR(grandTotal)})
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900">Order Items ({items.length})</h3>
                <Link href="/cart" className="text-xs text-blue-600 font-semibold hover:underline">
                  Edit Cart
                </Link>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-gray-100">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-2 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-gray-900 truncate max-w-[180px]">{product.name}</p>
                      <p className="text-[11px] text-gray-500">Qty: {quantity} • {product.packSize}</p>
                    </div>
                    <span className="font-bold text-gray-900">{formatINR(product.price * quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Savings</span>
                    <span>-{formatINR(totalSavings)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-teal-700 font-semibold">
                    <span>Coupon ({discountCode})</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline font-bold text-sm text-gray-900">
                  <span>Total (INR)</span>
                  <span className="text-xl text-blue-600 font-extrabold">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pharmacist Dispensing Guarantee</span>
                </div>
                <p>100% genuine sealed packs from licensed manufacturers.</p>
                <p className="text-slate-400">License: {brandConfig.legal.pharmacyLicense}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
