"use client";

import React from "react";
import {
  ShieldCheck,
  Truck,
  Thermometer,
  ChevronRight,
  Plus,
  Zap,
  TrendingDown,
  Gift,
} from "lucide-react";
import { formatINR, Product } from "@/lib/data/products";
import Button from "@/components/ui/Button";
import { ChatMessage } from "@/lib/services/aiChatbotService";
import { AddressChangeWidget } from "./AddressChangeWidget";

interface ChatMessageItemProps {
  msg: ChatMessage;
  onSendMessage: (prompt: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onApplyCoupon: (code: string, discountPercent: number) => void;
  onActionNotification: (text: string) => void;
}

export function ChatMessageItem({
  msg,
  onSendMessage,
  onAddToCart,
  onApplyCoupon,
  onActionNotification,
}: ChatMessageItemProps) {
  const isAssistant = msg.sender === "assistant";

  return (
    <div className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}>
      <div
        className={`max-w-[92%] rounded-2xl p-3.5 text-xs leading-relaxed ${
          isAssistant
            ? "bg-white text-gray-800 border border-gray-200/80 shadow-sm"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md shadow-blue-500/20"
        }`}
      >
        {/* Multi-Agent Sentiment & Action Header */}
        {isAssistant && msg.sentimentInfo && (
          <div className="mb-2.5 pb-2 border-b border-gray-100 flex items-center justify-between gap-2 text-[10px]">
            <span
              className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                msg.sentimentInfo.badgeColor === "rose"
                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                  : msg.sentimentInfo.badgeColor === "amber"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : msg.sentimentInfo.badgeColor === "emerald"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {msg.sentimentInfo.sentimentLabel}
            </span>
            <span className="text-gray-400 font-medium truncate max-w-[170px]">
              ⚡ {msg.sentimentInfo.actionTaken}
            </span>
          </div>
        )}

        {/* Markdown rendering */}
        <div className="space-y-2 whitespace-pre-line">
          {msg.text.split("\n\n").map((para, pIdx) => (
            <p key={pIdx}>
              {para.split("**").map((chunk, cIdx) =>
                cIdx % 2 === 1 ? (
                  <strong key={cIdx} className="font-bold text-gray-900">
                    {chunk}
                  </strong>
                ) : (
                  chunk
                )
              )}
            </p>
          ))}
        </div>

        {/* Rich Interactive Widget: Address Change Form */}
        {msg.action?.type === "SHOW_ADDRESS_FORM" && (
          <AddressChangeWidget
            payload={msg.action.payload}
            onSuccess={(toastText) => onActionNotification(toastText)}
          />
        )}

        {/* Rich Interactive Widget: Autonomous Discretionary Patient Relief Grant Card */}
        {msg.discretionaryGrant && (
          <div className="mt-3 p-3.5 rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50/90 via-orange-50/60 to-amber-50/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-rose-600 animate-bounce" />
                <span className="font-extrabold text-xs text-rose-900">
                  {msg.discretionaryGrant.grantTitle}
                </span>
              </div>
              <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                {msg.discretionaryGrant.discountPercent}% GRANTED
              </span>
            </div>
            <p className="text-[11px] text-rose-900 font-medium mb-2.5 leading-relaxed">
              {msg.discretionaryGrant.reason}
            </p>
            <div className="flex items-center justify-between p-2.5 bg-white/90 rounded-xl border border-rose-200 gap-2">
              <div>
                <span className="text-[9px] text-gray-500 font-semibold uppercase block">
                  Active Voucher Code
                </span>
                <span className="font-mono font-black text-xs text-rose-700">
                  {msg.discretionaryGrant.code}
                </span>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  onApplyCoupon(
                    msg.discretionaryGrant!.code,
                    msg.discretionaryGrant!.discountPercent
                  )
                }
                className="text-[11px] font-bold py-1 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-sm"
              >
                Apply to Cart Now
              </Button>
            </div>
          </div>
        )}

        {/* Rich Interactive Widget: Direct-from-Lab Generic Substitution Card */}
        {msg.genericSubstitutes && msg.genericSubstitutes.length > 0 && (
          <div className="mt-3 p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-950 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                Direct Lab Bioequivalence Savings
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Up to 75% Less
              </span>
            </div>
            {msg.genericSubstitutes.map((sub, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 line-through">
                      {sub.brandName} (~{formatINR(sub.marketPrice)})
                    </span>
                  </div>
                  <h5 className="font-bold text-gray-900 text-xs">
                    {sub.genericProduct.name}
                  </h5>
                  <p className="text-[10px] text-emerald-700 font-extrabold">
                    Direct Lab Price: {formatINR(sub.directLabPrice)} ({sub.savingsPct}% Savings)
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onAddToCart(sub.genericProduct, 1)}
                  className="text-[11px] font-bold py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add ({formatINR(sub.directLabPrice)})
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Rich Interactive Widget: Drug-Drug Interaction Card */}
        {msg.ddiResult && (
          <div className="mt-3 p-3 rounded-xl border bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                  msg.ddiResult.severity === "High"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : msg.ddiResult.severity === "Moderate"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                {msg.ddiResult.severity} Risk Level
              </span>
              <span className="text-[10px] font-semibold text-gray-500">
                CDSCO Clinical Protocol
              </span>
            </div>
            <h4 className="font-bold text-gray-900 text-xs mb-1">
              {msg.ddiResult.title}
            </h4>
            <div className="flex flex-wrap gap-1 mb-2">
              {msg.ddiResult.drugsInvolved.map((d, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-blue-100/70 text-blue-800 rounded-md font-mono text-[10px]"
                >
                  {d}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-gray-600 mb-2">
              {msg.ddiResult.mechanism}
            </p>
            <div className="p-2 bg-white rounded-lg border border-gray-200 text-[11px] text-gray-700">
              <span className="font-bold text-blue-700">Rx Advice: </span>
              {msg.ddiResult.clinicalAdvice}
            </div>
          </div>
        )}

        {/* Rich Interactive Widget: Live IoT Tracking Card */}
        {msg.trackingData && (
          <div className="mt-3 p-3.5 rounded-xl border bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">{msg.trackingData.id}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-teal-400/20 text-teal-300 border border-teal-400/30">
                {msg.trackingData.status || "In Transit"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Destination</span>
                <span className="font-semibold text-white">
                  {msg.trackingData.shippingCity || "Mumbai, MH"} (
                  {msg.trackingData.shippingPincode || "400050"})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">IoT Cold-Chain Temp</span>
                <span className="font-bold text-teal-300 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-teal-400" />
                  {msg.trackingData.currentPayloadTemp || "3.6°C"}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full w-3/4 rounded-full" />
            </div>
            <p className="text-[10px] text-slate-300">
              ⚡ Sensor verified: 2°C–8°C refrigerated clean courier.
            </p>
          </div>
        )}

        {/* Rich Interactive Widget: Batch COA Certificate Card */}
        {msg.batchData && (
          <div className="mt-3 p-3 rounded-xl border bg-emerald-50/70 border-emerald-200 text-emerald-950">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Certificate of Analysis (COA)
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald-800">
                {msg.batchData.batchId}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] mb-2 bg-white/80 p-2 rounded-lg border border-emerald-100">
              <div>
                <span className="text-gray-500 text-[10px]">Purity Assay</span>
                <p className="font-extrabold text-emerald-700">
                  {msg.batchData.purityAssayPct}% IP/BP
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-[10px]">Heavy Metals</span>
                <p className="font-bold text-gray-800">
                  {msg.batchData.heavyMetalsScreen}
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-[10px]">Vault Zone</span>
                <p className="font-semibold text-gray-800">
                  {msg.batchData.storageVaultZone}
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-[10px]">QA Signoff</span>
                <p className="font-semibold text-gray-800">
                  {msg.batchData.releasePharmacist}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rich Interactive Widget: PIN Code Details */}
        {msg.pincodeData && (
          <div className="mt-3 p-3 rounded-xl border bg-blue-50/70 border-blue-200 text-blue-950">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs flex items-center gap-1 text-blue-900">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                PIN {msg.pincodeData.pinCode} Serviceability
              </span>
              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                Express
              </span>
            </div>
            <p className="text-[11px] font-semibold text-blue-800">
              {msg.pincodeData.district}, {msg.pincodeData.state}
            </p>
            <p className="text-[11px] text-gray-600 mt-1">
              ⚡ <strong>Delivery Speed:</strong> {msg.pincodeData.deliverySpeed}
            </p>
          </div>
        )}

        {/* Rich Interactive Widget: Product Recommendation Cards */}
        {msg.productCards && msg.productCards.length > 0 && (
          <div className="mt-3 space-y-2">
            {msg.productCards.map((product) => {
              const isSoldOut =
                (product.stock ?? 0) <= 0 || product.inStock === false;

              return (
                <div
                  key={product.id}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition-colors flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-bold text-gray-900 text-xs truncate">
                        {product.name}
                      </h5>
                      {isSoldOut ? (
                        <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-extrabold rounded uppercase">
                          Sold Out
                        </span>
                      ) : product.requiresPrescription ? (
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-bold rounded">
                          Rx
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                          OTC
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      {product.packSize} • {formatINR(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isSoldOut}
                      onClick={() => onAddToCart(product, 1)}
                      className="text-[11px] font-bold py-1 px-2.5 h-auto bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {isSoldOut ? "Sold Out" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Timestamp */}
      <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>

      {/* Contextual Suggested Prompt Chips */}
      {isAssistant && msg.suggestedPrompts && (
        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
          {msg.suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt)}
              className="text-[10px] font-medium bg-white text-gray-700 hover:text-blue-700 hover:bg-blue-50/80 border border-gray-200 hover:border-blue-300 px-2.5 py-1 rounded-full transition-all text-left shadow-xs flex items-center gap-1"
            >
              <span>{prompt}</span>
              <ChevronRight className="w-2.5 h-2.5 opacity-50" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
