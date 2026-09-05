import { NextRequest, NextResponse } from "next/server";
import { refillService } from "@/lib/services/refillService";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body.status || !["Active", "Paused", "Cancelled"].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: "Status must be 'Active', 'Paused', or 'Cancelled'" },
        { status: 400 }
      );
    }

    const updated = await refillService.updateRefillStatus(id, body.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Refill subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update refill" },
      { status: 500 }
    );
  }
}
