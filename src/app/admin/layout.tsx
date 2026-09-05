"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileCheck2,
  ShoppingCart,
  Boxes,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { brandConfig } from "@/lib/config/brand";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Clinical Formulations", href: "/admin/products", icon: Package },
    { name: "Rx Verification Queue", href: "/admin/prescriptions", icon: FileCheck2, badge: "4 Pending" },
    { name: "Orders & Dispatch", href: "/admin/orders", icon: ShoppingCart },
    { name: "Cold-Chain Inventory", href: "/admin/inventory", icon: Boxes },
    { name: "Compliance & Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              M+
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">
                {brandConfig.company.name}
              </p>
              <p className="text-[11px] text-blue-400 font-mono">Pharmacist Command Hub</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Operations & Dispensing
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drug License & Regulatory Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-[11px] space-y-1 text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>India Pharmacy License</span>
            </div>
            <p className="font-mono text-[10px] text-slate-400">{brandConfig.legal.pharmacyLicense}</p>
            <p className="text-[10px] text-slate-500">FSSAI: {brandConfig.legal.fssaiLicense}</p>
          </div>

          <div className="mt-3 flex items-center justify-between px-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>View Customer Portal</span>
              <span>↗</span>
            </Link>
            <Link href="/" className="text-slate-500 hover:text-slate-400">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Search orders, medicines, Rx IDs..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                DR
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-white">Dr. Ananya Iyer, PharmD</p>
                <p className="text-[10px] text-slate-400">Chief Dispensing Officer</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
