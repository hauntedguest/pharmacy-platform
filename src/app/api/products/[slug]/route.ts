import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/repository";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    let product = await db.getProductBySlug(slug);
    if (!product) {
      product = await db.getProductById(slug);
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product formulation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await req.json();

    const updates = { ...body };
    if (updates.imageUrl && !updates.images) {
      updates.images = [updates.imageUrl];
    }
    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
      updates.inStock = updates.stock > 0;
    }
    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }
    if (updates.originalPrice !== undefined) {
      updates.originalPrice = Number(updates.originalPrice);
    }
    if (updates.isVisible !== undefined) {
      updates.isVisible = Boolean(updates.isVisible);
    }

    let updated = await db.updateProduct(slug, updates);
    if (!updated) {
      const product = await db.getProductBySlug(slug);
      if (product) {
        updated = await db.updateProduct(product.id, updates);
      }
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const deleted = await db.deleteProduct(slug);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product formulation not found or could not be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
