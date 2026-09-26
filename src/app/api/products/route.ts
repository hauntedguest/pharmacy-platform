import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const showAll = searchParams.get("all") === "true";

    let products = await db.getProducts();

    // Unless explicitly requested (e.g. admin dashboard), only show visible products
    if (!showAll) {
      products = products.filter((p) => p.isVisible !== false);
    }

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    if (query) {
      const q = query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.activeIngredient && p.activeIngredient.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: "Product name and price are required." },
        { status: 400 }
      );
    }

    const id = `prod_${Date.now()}`;
    const slug = (body.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newProduct = {
      id,
      slug: slug || `prod-${Date.now()}`,
      name: body.name.trim(),
      brand: body.brand || "MediCare Plus Labs",
      description: body.description || `${body.name} formulated by MediCare Plus laboratories.`,
      category: body.category || "prescription",
      subCategory: body.subCategory || undefined,
      price: Number(body.price) || 199,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      requiresPrescription: Boolean(body.requiresPrescription),
      prescriptionType: body.prescriptionType || (body.requiresPrescription ? "Schedule H" : "OTC"),
      inStock: Number(body.stock ?? 100) > 0,
      stock: Number(body.stock ?? 100),
      packSize: body.packSize || "Strip of 10",
      dosage: body.dosage || "As directed by physician",
      dosageForm: body.dosageForm || "Tablet",
      activeIngredient: body.activeIngredient || "",
      composition: body.composition || body.activeIngredient || "",
      sideEffects: body.sideEffects || [],
      usage: body.usage || "Take as directed by your healthcare professional.",
      warnings: body.warnings || [],
      storage: body.storage || "Store in a cool and dry place.",
      featured: Boolean(body.featured),
      bestseller: Boolean(body.bestseller),
      tags: body.tags || ["genuine", "lab-tested"],
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : [body.imageUrl || "/products/placeholder.jpg"],
      rating: Number(body.rating ?? 4.8),
      reviewCount: Number(body.reviewCount ?? 12),
      discountPercent: body.discountPercent ? Number(body.discountPercent) : undefined,
      isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
    };

    const created = await db.createProduct(newProduct as any);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add product formulation" },
      { status: 500 }
    );
  }
}

