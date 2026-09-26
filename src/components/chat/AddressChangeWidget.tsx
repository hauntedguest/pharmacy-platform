"use client";

import React, { useState } from "react";
import { Truck } from "lucide-react";
import Button from "@/components/ui/Button";

interface AddressChangeWidgetProps {
  payload?: {
    orderId?: string;
    currentStreet?: string;
    currentCity?: string;
    currentState?: string;
    currentPincode?: string;
  };
  onSuccess?: (msg: string) => void;
}

export function AddressChangeWidget({
  payload,
  onSuccess,
}: AddressChangeWidgetProps) {
  const [orderId, setOrderId] = useState(payload?.orderId || "ORD-IND-98402");
  const [street, setStreet] = useState(payload?.currentStreet || "");
  const [city, setCity] = useState(payload?.currentCity || "");
  const [state, setState] = useState(payload?.currentState || "Maharashtra");
  const [pincode, setPincode] = useState(payload?.currentPincode || "400050");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
      setResultMsg({ success: false, text: "Please fill in all address fields including 6-digit PIN code." });
      return;
    }
    if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      setResultMsg({ success: false, text: "Invalid Indian PIN code. Must be exactly 6 digits." });
      return;
    }

    setIsSubmitting(true);
    setResultMsg(null);

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId.trim(),
          action: "UPDATE_ADDRESS",
          newAddress: {
            shippingStreet: street.trim(),
            shippingCity: city.trim(),
            shippingState: state.trim() || "Maharashtra",
            shippingPincode: pincode.trim(),
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResultMsg({
          success: true,
          text: `✓ Address updated for ${orderId}! New shipping destination: ${street}, ${city} - ${pincode}.`,
        });
        if (onSuccess) {
          onSuccess(`Updated address for order ${orderId}!`);
        }
      } else {
        setResultMsg({
          success: false,
          text: data.error || "Failed to update delivery address.",
        });
      }
    } catch {
      setResultMsg({
        success: false,
        text: "Network error while updating delivery address. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 p-3.5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/90 to-indigo-50/70 shadow-sm text-xs">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-blue-100">
        <span className="font-bold text-blue-950 flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-blue-600" />
          Interactive Address Modifier
        </span>
        <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-bold">
          Live Dispatch Sync
        </span>
      </div>

      {resultMsg ? (
        <div
          className={`p-3 rounded-xl mb-2 font-medium leading-relaxed ${
            resultMsg.success
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "bg-rose-100 text-rose-900 border border-rose-300"
          }`}
        >
          {resultMsg.text}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-IND-98402"
              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Flat / Building, Street / Road"
              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-700 block mb-0.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai, Bengaluru..."
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 block mb-0.5">6-Digit PIN Code</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="400050"
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={isSubmitting}
            className="w-full mt-2 font-bold py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? "Updating Address..." : "Confirm Address Change"}
          </Button>
        </form>
      )}
    </div>
  );
}
