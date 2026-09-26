"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Pill, Star, ShieldCheck, ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatINR, type Product } from "@/lib/data/products";

interface ProductCard3DProps {
  product: Product;
}

export default function ProductCard3D({ product }: ProductCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isSoldOut = (product.stock ?? 0) <= 0 || product.inStock === false;

  return (
    <Link href={`/products/${product.slug}`} className="block perspective-1000 group">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out, box-shadow 0.2s ease-out",
        }}
        className={`relative h-full bg-white rounded-2xl border ${
          isSoldOut ? "border-rose-200/80 bg-slate-50/50" : "border-gray-100"
        } shadow-sm hover:shadow-2xl overflow-hidden transition-all duration-300`}
      >
        {/* Dynamic Glare Effect */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
            opacity: glarePosition.opacity,
          }}
        />

        {/* Product Visual Container */}
        <div className="relative aspect-square w-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-teal-50/30 flex items-center justify-center overflow-hidden p-3 sm:p-6">
          {/* Subtle Ambient Light Orb */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-blue-400/10 to-teal-400/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between z-10">
            {isSoldOut ? (
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-md shadow-rose-500/30 animate-pulse">
                SOLD OUT
              </span>
            ) : product.requiresPrescription ? (
              <Badge variant="warning" className="text-[9px] sm:text-[11px] font-semibold tracking-wide uppercase shadow-sm px-1.5 sm:px-2 py-0.5">
                {product.prescriptionType || "Schedule H"}
              </Badge>
            ) : (
              <Badge variant="success" className="text-[9px] sm:text-[11px] font-semibold tracking-wide uppercase shadow-sm px-1.5 sm:px-2 py-0.5">
                OTC
              </Badge>
            )}

            {isSoldOut ? (
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-gray-200 text-gray-700">
                Out of Stock
              </span>
            ) : (
              discountPercent > 0 && (
                <Badge variant="danger" className="text-[9px] sm:text-[11px] font-bold shadow-sm px-1.5 sm:px-2 py-0.5">
                  {discountPercent}% OFF
                </Badge>
              )
            )}
          </div>

          {/* Sold Out Watermark Overlay if out of stock */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
              <span className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-rose-600/95 text-white font-extrabold text-[10px] sm:text-xs tracking-widest uppercase shadow-lg border border-rose-400">
                Out of Stock
              </span>
            </div>
          )}

          {/* 3D-Like Pharmaceutical Asset Placeholder */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className={`relative z-10 w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-white flex flex-col items-center justify-center p-2 sm:p-4 transition-transform duration-300 group-hover:scale-105 ${
              isSoldOut ? "grayscale opacity-75" : ""
            }`}
          >
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white shadow-md mb-1 sm:mb-2">
              <Pill className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-wider uppercase">
              {product.dosageForm || "Capsules"}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3 sm:p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
              <span className="font-medium text-blue-600">{product.brand}</span>
              <span className="capitalize">{product.category.replace("-", " ")}</span>
            </div>

            <h3 className="font-semibold text-gray-900 text-xs sm:text-base mb-0.5 sm:mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
              {product.name}
            </h3>

            {product.packSize && (
              <p className="text-[10px] sm:text-[11px] text-gray-500 mb-1.5 sm:mb-2 truncate">{product.packSize}</p>
            )}

            {/* Rating & Clinical Badges */}
            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 text-[10px] sm:text-xs text-gray-500">
              <div className="flex items-center text-amber-500">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                <span className="ml-0.5 sm:ml-1 font-semibold text-gray-900">{product.rating}</span>
              </div>
              <span>•</span>
              <span className="truncate">{product.reviewCount} reviews</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-sm sm:text-xl font-bold text-gray-900">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              {isSoldOut ? (
                <p className="text-[9px] sm:text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                  Sold Out
                </p>
              ) : (
                <p className="text-[9px] sm:text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  In Stock ({product.stock})
                </p>
              )}
            </div>

            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-sm ${
              isSoldOut
                ? "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
                : "bg-gray-50 text-gray-700 group-hover:bg-blue-600 group-hover:text-white"
            }`}>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
