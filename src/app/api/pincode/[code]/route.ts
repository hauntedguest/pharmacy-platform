import { NextRequest, NextResponse } from "next/server";
import { lookupPincode } from "@/lib/services/pincode";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const cleanPin = (code || "").replace(/\D/g, "");

    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Indian PIN code format. Please enter a 6-digit postal code.",
        },
        { status: 400 }
      );
    }

    const details = await lookupPincode(cleanPin);

    if (!details) {
      return NextResponse.json(
        { success: false, error: "Unable to verify PIN code serviceability" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        pincode: cleanPin,
        city: details.district,
        state: details.state,
        postOffices: details.postOffices,
        deliveryHours: details.deliverySpeed,
        coldChainAvailable: true,
        expressEligible: details.deliverySpeed.includes("2-4 Hrs"),
        minOrderForFreeDelivery: 499,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to lookup PIN code" },
      { status: 500 }
    );
  }
}
