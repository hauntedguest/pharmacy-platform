import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/repository";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const product = await db.getProductBySlug(slug);

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
