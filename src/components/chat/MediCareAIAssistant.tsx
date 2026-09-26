"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Send,
  HeartHandshake,
  TrendingDown,
  Truck,
  Zap,
  Thermometer,
  Bot,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/data/products";
import Button from "@/components/ui/Button";
import { ChatMessage, aiChatbotService } from "@/lib/services/aiChatbotService";
import { ChatHeader } from "./ChatHeader";
import { ChatTriggerButton } from "./ChatTriggerButton";
import { ChatMessageItem } from "./ChatMessageItem";

const INITIAL_GREETING: ChatMessage = {
  id: "msg_init",
  sender: "assistant",
  text: `👋 **Hello! I am your MediCare AI Clinical & Commerce Assistant.**\n\nI am equipped with a multi-agent decision engine with self-decision capabilities to help you navigate healthcare affordability, drug safety, live order tracking, and clinical consultations:`,
  timestamp: "Just now",
  suggestedPrompts: [
    "I need help with affordable medicines & discounts",
    "Show cheaper generic alternatives to Dolo 650 & Pan 40",
    "Check if Telmisartan & Diclofenac are safe together",
    "Change delivery address",
    "Track order with live cold-chain temperature",
    "Inspect Batch QC purity certificate for Paracetamol",
  ],
};

interface Position {
  x: number;
  y: number;
}

export default function MediCareAIAssistant() {
  const {
    items,
    subtotal,
    addToCart,
    applyDiscountCode,
    discountCode,
  } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("Analyzing clinical intent & sentiment...");
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  // Position state for draggable floating widget
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  }>({ startX: 0, startY: 0, initialX: 0, initialY: 0, hasMoved: false });

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize position on client-side mount (bottom-right default)
  useEffect(() => {
    const updateDefaultPosition = () => {
      if (typeof window === "undefined") return;
      const margin = 20;
      const width = 280;
      const height = 64;
      const defaultX = Math.max(margin, window.innerWidth - width - margin);
      const defaultY = Math.max(margin, window.innerHeight - height - margin);
      setPosition((prev) => prev ?? { x: defaultX, y: defaultY });
    };

    updateDefaultPosition();
    window.addEventListener("resize", updateDefaultPosition);
    return () => window.removeEventListener("resize", updateDefaultPosition);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Clamp position within screen boundaries
  const clampPosition = useCallback(
    (x: number, y: number, elemWidth: number, elemHeight: number): Position => {
      if (typeof window === "undefined") return { x, y };
      const padding = 12;
      const maxX = Math.max(padding, window.innerWidth - elemWidth - padding);
      const maxY = Math.max(padding, window.innerHeight - elemHeight - padding);
      return {
        x: Math.max(padding, Math.min(maxX, x)),
        y: Math.max(padding, Math.min(maxY, y)),
      };
    },
    []
  );

  // Pointer Down handler
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to primary mouse button or touch
    if (e.button !== 0) return;

    const targetEl = containerRef.current;
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const currentX = position?.x ?? rect.left;
    const currentY = position?.y ?? rect.top;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY,
      hasMoved: false,
    };

    setIsDragging(true);

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture isn't supported
    }
  };

  // Pointer Move handler
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 4) {
      dragRef.current.hasMoved = true;
    }

    if (dragRef.current.hasMoved) {
      const targetEl = containerRef.current;
      const width = targetEl?.offsetWidth || 280;
      const height = targetEl?.offsetHeight || 64;

      const rawX = dragRef.current.initialX + dx;
      const rawY = dragRef.current.initialY + dy;

      const clamped = clampPosition(rawX, rawY, width, height);
      setPosition(clamped);
    }
  };

  // Pointer Up handler
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;

    setIsDragging(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handleTriggerClick = () => {
    if (!dragRef.current.hasMoved) {
      setIsOpen(true);
    }
  };

  // Autonomous action execution
  const executeAutonomousAction = (msg: ChatMessage) => {
    if (!msg.action) return;

    if (msg.action.type === "ADD_TO_CART" && msg.action.payload?.product) {
      const { product, quantity } = msg.action.payload;
      addToCart(product, quantity || 1);
      setActionNotification(`Added ${quantity || 1}x "${product.name}" to cart!`);
      setTimeout(() => setActionNotification(null), 4000);
    } else if (
      (msg.action.type === "APPLY_COUPON" || msg.action.type === "APPLY_DISCRETIONARY_GRANT") &&
      msg.action.payload?.code
    ) {
      const { code } = msg.action.payload;
      const res = applyDiscountCode(code);
      if (res.success) {
        setActionNotification(`⚡ Autonomous Action: "${code}" applied to cart!`);
      }
      setTimeout(() => setActionNotification(null), 4000);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const text = customText || inputQuery;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputQuery("");
    setIsTyping(true);

    const lower = text.toLowerCase();
    if (
      lower.includes("money") ||
      lower.includes("afford") ||
      lower.includes("broke") ||
      lower.includes("cheap") ||
      lower.includes("poor") ||
      lower.includes("discount")
    ) {
      setTypingStatus("Sentiment Agent: Evaluating financial hardship & healthcare grant eligibility...");
    } else if (lower.includes("address") || lower.includes("location") || lower.includes("shipping")) {
      setTypingStatus("Logistics Agent: Checking order status & address update eligibility...");
    } else if (lower.includes("generic") || lower.includes("substitute") || lower.includes("dolo")) {
      setTypingStatus("Generic Advisor Agent: Comparing direct-from-lab bioequivalent salts...");
    } else if (lower.includes("track") || lower.includes("mcp-") || lower.includes("ord-")) {
      setTypingStatus("Logistics Agent: Accessing live IoT Cold-Chain telemetry...");
    } else if (lower.includes("interaction") || lower.includes("safe")) {
      setTypingStatus("Clinical Agent: Evaluating DDI pharmacokinetic matrix...");
    } else if (lower.includes("add") || lower.includes("buy")) {
      setTypingStatus("Commerce Agent: Checking live cleanroom warehouse stock...");
    } else if (lower.includes("batch") || lower.includes("purity")) {
      setTypingStatus("QA Agent: Retrieving Certificate of Analysis (COA)...");
    } else {
      setTypingStatus("Multi-Agent Engine: Processing clinical query...");
    }

    try {
      let response: ChatMessage | null = null;
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            context: {
              cartItems: items,
              subtotal,
              appliedCoupon: discountCode,
            },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            response = json.data;
          }
        }
      } catch {
        // Fallback to local service
      }

      if (!response) {
        response = await aiChatbotService.processQuery(text, {
          cartItems: items,
          subtotal,
          appliedCoupon: discountCode,
        });
      }

      await new Promise((r) => setTimeout(r, 400));
      setMessages((prev) => [...prev, response!]);
      executeAutonomousAction(response!);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "assistant",
        text: "I encountered a momentary connection issue with the central knowledge server. Please try asking again.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={
        position && !isOpen
          ? {
              position: "fixed",
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 9999,
            }
          : undefined
      }
      className={!position && !isOpen ? "fixed bottom-5 right-5 z-50 flex flex-col items-end" : "z-50"}
    >
      {/* Action Notification Toast Banner */}
      {actionNotification && (
        <div className="fixed bottom-24 right-5 z-[10000] mb-3 px-4 py-2.5 bg-slate-900 text-white rounded-2xl shadow-xl border border-teal-500/40 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-300">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0 animate-spin" />
          <span>{actionNotification}</span>
        </div>
      )}

      {/* Floating Draggable Chat Trigger Button (When Closed) */}
      {!isOpen && (
        <ChatTriggerButton
          onPointerDown={handlePointerDown}
          onClick={handleTriggerClick}
          isDragging={isDragging}
        />
      )}

      {/* Expandable Chatbot Window (When Open) */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]"
        >
          <div
            className={`bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 animate-in zoom-in-95 ${
              isExpanded
                ? "w-[94vw] sm:w-[700px] h-[86vh] max-h-[840px]"
                : "w-[92vw] sm:w-[440px] h-[620px] max-h-[86vh]"
            }`}
          >
            {/* Header */}
            <ChatHeader
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
              onResetChat={() => setMessages([INITIAL_GREETING])}
              onClose={() => setIsOpen(false)}
            />

            {/* Quick Capability Filter Chips */}
            <div className="px-4 py-2 bg-slate-50 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
              <button
                onClick={() =>
                  handleSendMessage("I need help with affordable medicines & discounts")
                }
                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-semibold hover:bg-rose-100 transition-colors shrink-0 flex items-center gap-1"
              >
                <HeartHandshake className="w-3 h-3 text-rose-600" /> Discounts & Grants
              </button>
              <button
                onClick={() =>
                  handleSendMessage("Show cheaper generic alternatives to Dolo 650 & Pan 40")
                }
                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors shrink-0 flex items-center gap-1"
              >
                <TrendingDown className="w-3 h-3 text-emerald-600" /> Lab Generics (Save 75%)
              </button>
              <button
                onClick={() => handleSendMessage("Change delivery address")}
                className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-semibold hover:bg-blue-100 transition-colors shrink-0 flex items-center gap-1"
              >
                <Truck className="w-3 h-3 text-blue-600" /> Change Address
              </button>
              <button
                onClick={() =>
                  handleSendMessage("Check if Telmisartan & Diclofenac are safe together")
                }
                className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-colors shrink-0 flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-500" /> DDI Safety
              </button>
              <button
                onClick={() => handleSendMessage("Track my latest order with live temp")}
                className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-colors shrink-0 flex items-center gap-1"
              >
                <Thermometer className="w-3 h-3 text-teal-600" /> IoT Cold-Chain
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  msg={msg}
                  onSendMessage={handleSendMessage}
                  onAddToCart={(prod, qty) => {
                    addToCart(prod, qty || 1);
                    setActionNotification(`Added ${prod.name} to cart!`);
                    setTimeout(() => setActionNotification(null), 3000);
                  }}
                  onApplyCoupon={(code, pct) => {
                    const res = applyDiscountCode(code);
                    if (res.success) {
                      setActionNotification(`Applied ${code} (${pct}% OFF) to cart!`);
                      setTimeout(() => setActionNotification(null), 3500);
                    }
                  }}
                  onActionNotification={(txt) => {
                    setActionNotification(txt);
                    setTimeout(() => setActionNotification(null), 4000);
                  }}
                />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2 animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-500 animate-pulse">
                      {typingStatus}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-white border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask about symptoms, change address, discounts, DDI..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={!inputQuery.trim() || isTyping}
                  className="rounded-2xl p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400 px-1">
                <span>⚡ CDSCO Licensed & GMP Certified</span>
                <span>🔒 256-Bit Encrypted Health Triage</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
