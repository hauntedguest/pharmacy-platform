import { NextRequest, NextResponse } from "next/server";
import { refillService } from "@/lib/services/refillService";

export async function GET() {
  try {
    const refills = await refillService.getAllRefills();
    return NextResponse.json({ success: true, data: refills });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch refills" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const refill = await refillService.createRefill(body);
    return NextResponse.json({ success: true, data: refill }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to schedule refill" },
      { status: 400 }
    );
  }
}
