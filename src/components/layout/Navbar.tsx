"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X, User, Phone, ShieldCheck } from "lucide-react";
import { brandConfig } from "@/lib/config/brand";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  const navLinks = [
    { href: "/products", label: "Medicines & Catalogue" },
    { href: "/interaction-checker", label: "Interaction Analyzer" },
    { href: "/account/refills", label: "Pill Subscriptions" },
    { href: "/prescriptions/upload", label: "Upload Rx", highlight: true },
    { href: "/contact", label: "Pharmacist Help" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <nav
        className="mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        style={{ height: brandConfig.layout.navHeight }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#14b8a6] flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="text-white font-extrabold text-lg">M+</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <p className="font-extrabold text-base text-gray-900 leading-tight">
                {brandConfig.company.name}
              </p>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                INDIA
              </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              {brandConfig.company.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                link.highlight
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search generic salts, brands, or symptoms..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Phone (Desktop) */}
          <a
            href={`tel:${brandConfig.contact.phone}`}
            className="hidden xl:flex items-center gap-1.5 text-xs text-gray-700 hover:text-blue-600 transition-colors bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl"
          >
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-semibold">{brandConfig.contact.phone}</span>
          </a>

          {/* Patient Account Portal */}
          <Link
            href="/account"
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg font-medium border border-gray-200"
          >
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden md:inline">Account</span>
          </Link>

          {/* Pharmacist Admin Quick Access */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg font-medium border border-slate-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Pharmacist Desk</span>
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 active:scale-95"
            aria-label="Open Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="w-5 h-5 bg-white text-blue-700 text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-200">
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search generic salts, brands..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className="p-4 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-4 h-4 text-teal-600" />
              Patient Care & Health Hub
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShieldCheck className="w-4 h-4" />
              Pharmacist Admin Desk
            </Link>
          </div>

          {/* Mobile Contact */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <a
              href={`tel:${brandConfig.contact.phone}`}
              className="flex items-center justify-center gap-2 w-full py-2 text-blue-600 font-semibold text-xs"
            >
              <Phone className="w-4 h-4" />
              {brandConfig.contact.phone} (24x7 India Toll-Free)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
