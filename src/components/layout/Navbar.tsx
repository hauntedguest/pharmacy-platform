"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X, User, Phone } from "lucide-react";
import { brandConfig } from "@/lib/config/brand";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <nav
        className="mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        style={{ height: brandConfig.layout.navHeight }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#14b8a6] flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-lg text-gray-900 leading-tight">
              {brandConfig.company.name}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              {brandConfig.company.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-[#3b82f6] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search medications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Phone (Desktop) */}
          <a
            href={`tel:${brandConfig.contact.phone}`}
            className="hidden xl:flex items-center gap-2 text-sm text-gray-700 hover:text-[#3b82f6] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">{brandConfig.contact.phone}</span>
          </a>

          {/* Account */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <User className="w-5 h-5" />
            <span className="hidden lg:inline">Account</span>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="sm" className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#3b82f6] text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
            <span className="hidden lg:inline">Cart</span>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search medications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
              />
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              Account
            </Link>
          </div>

          {/* Mobile Contact */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <a
              href={`tel:${brandConfig.contact.phone}`}
              className="flex items-center justify-center gap-2 w-full py-2 text-[#3b82f6] font-medium"
            >
              <Phone className="w-5 h-5" />
              {brandConfig.contact.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
