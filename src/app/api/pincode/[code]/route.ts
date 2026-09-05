import { NextRequest, NextResponse } from "next/server";
import { lookupPincode } from "@/lib/services/pincode";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const details = await lookupPincode(code);

    if (!details) {
      return NextResponse.json(
        { success: false, error: "Invalid PIN code. Must be a 6-digit Indian PIN." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: details });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to lookup PIN code" },
      { status: 500 }
    );
  }
}
