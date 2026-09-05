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
        className="relative h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl overflow-hidden transition-all duration-300"
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
        <div className="relative aspect-square w-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-teal-50/30 flex items-center justify-center overflow-hidden p-6">
          {/* Subtle Ambient Light Orb */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-blue-400/10 to-teal-400/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            {product.requiresPrescription ? (
              <Badge variant="warning" className="text-[11px] font-semibold tracking-wide uppercase shadow-sm">
                {product.prescriptionType || "Schedule H"}
              </Badge>
            ) : (
              <Badge variant="success" className="text-[11px] font-semibold tracking-wide uppercase shadow-sm">
                OTC
              </Badge>
            )}

            {discountPercent > 0 && (
              <Badge variant="danger" className="text-[11px] font-bold shadow-sm">
                {discountPercent}% OFF
              </Badge>
            )}
          </div>

          {/* 3D-Like Pharmaceutical Asset Placeholder */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-white flex flex-col items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white shadow-md mb-2">
              <Pill className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
              {product.dosageForm || "Capsules"}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="font-medium text-blue-600">{product.brand}</span>
              <span className="capitalize">{product.category.replace("-", " ")}</span>
            </div>

            <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
              {product.name}
            </h3>

            {product.packSize && (
              <p className="text-[11px] text-gray-500 mb-2 truncate">{product.packSize}</p>
            )}

            {/* Rating & Clinical Badges */}
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="ml-1 font-semibold text-gray-900">{product.rating}</span>
              </div>
              <span>•</span>
              <span>{product.reviewCount} reviews</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-gray-900">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                {product.stock > 0 ? "In Stock • Express Delivery" : "Out of Stock"}
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
