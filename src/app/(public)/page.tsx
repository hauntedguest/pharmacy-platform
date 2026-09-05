import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Clock,
  Award,
  Pill,
  Heart,
  Activity,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import CapsuleHero from "@/components/3d/CapsuleHero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { getFeaturedProducts } from "@/lib/data/products";
import { brandConfig } from "@/lib/config/brand";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  const categories = [
    {
      name: "Prescription",
      icon: Pill,
      href: "/products?category=prescription",
      color: "bg-blue-50 text-blue-600",
      description: "Doctor-prescribed medications",
    },
    {
      name: "Supplements",
      icon: Heart,
      href: "/products?category=supplement",
      color: "bg-green-50 text-green-600",
      description: "Vitamins & wellness support",
    },
    {
      name: "Medical Devices",
      icon: Activity,
      href: "/products?category=medical-device",
      color: "bg-purple-50 text-purple-600",
      description: "Health monitoring tools",
    },
    {
      name: "OTC Medications",
      icon: Stethoscope,
      href: "/products?category=otc",
      color: "bg-teal-50 text-teal-600",
      description: "Over-the-counter relief",
    },
  ];

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: "Licensed Pharmacy",
      description: `Lic. ${brandConfig.legal.pharmacyLicense}`,
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Same-day shipping available",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Expert pharmacist available",
    },
    {
      icon: Award,
      title: "Trusted Quality",
      description: "100% authentic products",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section with 3D Graphics */}
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-transparent overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <Badge variant="info" className="mb-4">
                Licensed & Certified Pharmacy
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health,
                <br />
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#14b8a6]"
                >
                  Our Priority
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                {brandConfig.company.description} Fast delivery, expert
                consultation, and authentic medications at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg">
                  <Link href="/products">
                    Shop Products
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Pharmacist</Link>
                </Button>
              </div>
            </div>

            {/* 3D Hero Animation */}
            <div className="relative">
              <CapsuleHero />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive selection of healthcare products
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <Card.Content className="p-6 text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                      <div className="mt-4 flex items-center justify-center text-[#3b82f6] font-medium text-sm">
                        Browse
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Card.Content>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Our most popular and trusted items
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/products">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: { id: string; slug: string; name: string; brand: string; price: number; originalPrice?: number; rating: number; reviewCount: number; stock: number; requiresPrescription: boolean }) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg">
                  {/* Product Image Placeholder */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Pill className="w-16 h-16" />
                    </div>
                    {product.originalPrice && (
                      <Badge
                        variant="danger"
                        className="absolute top-3 right-3"
                      >
                        Sale
                      </Badge>
                    )}
                    {product.requiresPrescription && (
                      <Badge className="absolute top-3 left-3">
                        Rx Required
                      </Badge>
                    )}
                  </div>

                  <Card.Content className="p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#3b82f6] transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <p className="text-xs text-gray-600 mt-2">
                      {product.stock > 50
                        ? "In Stock"
                        : product.stock > 0
                        ? `Only ${product.stock} left`
                        : "Out of Stock"}
                    </p>
                  </Card.Content>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link href="/products">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#3b82f6] to-[#14b8a6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Need Expert Advice?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Our licensed pharmacists are available 24/7 to answer your
              questions and provide personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#3b82f6] hover:bg-gray-100"
              >
                <a href={`tel:${brandConfig.contact.phone}`}>
                  Call Now: {brandConfig.contact.phone}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
