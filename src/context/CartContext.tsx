"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
  totalMRP: number;
  totalSavings: number;
  gstAmount: number;
  deliveryFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  grandTotal: number;
  discountCode: string;
  discountAmount: number;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  hasPrescriptionItems: boolean;
  prescriptionAttached: { fileName: string; uploadedAt: string } | null;
  attachPrescription: (fileName: string) => void;
  removePrescription: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "medicare_cart_items_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [prescriptionAttached, setPrescriptionAttached] = useState<{
    fileName: string;
    uploadedAt: string;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Fallback
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode("");
    setDiscountAmount(0);
    setPrescriptionAttached(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalMRP = items.reduce((sum, item) => {
    const mrp = item.product.originalPrice || item.product.price;
    return sum + mrp * item.quantity;
  }, 0);

  const totalSavings = Math.max(0, totalMRP - subtotal);

  // 5% standard GST estimate included in Indian medicines
  const gstAmount = Math.round(subtotal * 0.05);

  const freeShippingThreshold = 499;
  const deliveryFee = subtotal > 0 && subtotal < freeShippingThreshold ? 49 : 0;
  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const hasPrescriptionItems = items.some(
    (item) => item.product.requiresPrescription
  );

  const applyDiscountCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "FIRSTMED10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setDiscountCode("FIRSTMED10 (10% OFF)");
      return { success: true, message: "10% First Order Discount applied!" };
    } else if (cleanCode === "WELLNESS20" && subtotal >= 1000) {
      const discount = Math.round(subtotal * 0.2);
      setDiscountAmount(discount);
      setDiscountCode("WELLNESS20 (20% OFF)");
      return { success: true, message: "20% Wellness Discount applied!" };
    } else if (cleanCode === "WELLNESS20" && subtotal < 1000) {
      return {
        success: false,
        message: "WELLNESS20 requires minimum order of ₹1,000",
      };
    } else {
      return { success: false, message: "Invalid promo code" };
    }
  };

  const removeDiscountCode = () => {
    setDiscountCode("");
    setDiscountAmount(0);
  };

  const attachPrescription = (fileName: string) => {
    setPrescriptionAttached({
      fileName,
      uploadedAt: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  const removePrescription = () => {
    setPrescriptionAttached(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        totalItems,
        subtotal,
        totalMRP,
        totalSavings,
        gstAmount,
        deliveryFee,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        grandTotal,
        discountCode,
        discountAmount,
        applyDiscountCode,
        removeDiscountCode,
        hasPrescriptionItems,
        prescriptionAttached,
        attachPrescription,
        removePrescription,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
