import { NextRequest, NextResponse } from "next/server";
import { batchService } from "@/lib/services/batchService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await context.params;
    const batch = await batchService.getBatchById(batchId);

    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Batch COA record not found in MediCare Plus QC ledger" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: batch });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch batch details" },
      { status: 500 }
    );
  }
}
