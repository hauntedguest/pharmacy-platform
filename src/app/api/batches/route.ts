import { NextRequest, NextResponse } from "next/server";
import { batchService } from "@/lib/services/batchService";
import { type BatchRecord } from "@/lib/db/repository";

export async function GET() {
  try {
    const batches = await batchService.getAllBatches();
    return NextResponse.json({ success: true, data: batches });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch batches" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.batchId || !body.productName) {
      return NextResponse.json(
        { success: false, error: "Batch ID and Formulation Name are required." },
        { status: 400 }
      );
    }

    const isCold = (body.storageVaultZone || "").toLowerCase().includes("cold");
    const newBatch: BatchRecord = {
      batchId: body.batchId.trim(),
      productId: body.productId || `prod_${Date.now()}`,
      productName: body.productName.trim(),
      manufacturer: body.manufacturer || "MediCare Plus Cleanroom Labs",
      manufacturingFacility: body.manufacturingFacility || "Facility Alpha, Kurla Pharma Estate, Mumbai (CDSCO Licensed)",
      mfgDate: body.mfgDate || new Date().toISOString().split("T")[0],
      expiryDate: body.expiryDate || new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      purityAssayPct: Number(body.purityAssayPct) || 99.8,
      heavyMetalsScreen: body.heavyMetalsScreen || "Nil (Compliant with IP/USP)",
      microbialTest: body.microbialTest || "Zero Colony (Sterile)",
      dissolutionRate: body.dissolutionRate || "98.5% in 15 mins",
      storageVaultZone: body.storageVaultZone || (isCold ? "Cold Storage (2°C-8°C)" : "Controlled Ambient (15°C-25°C)"),
      currentVaultTemp: body.currentVaultTemp || (isCold ? "3.8°C" : "21.2°C"),
      totalStockUnits: Math.max(1, Number(body.totalStockUnits) || Number(body.quantity) || 100),
      reorderLevel: Number(body.reorderLevel) || 50,
      releasePharmacist: body.releasePharmacist || "R. Deshmukh (MH-PH-88910)",
      releaseStatus: body.releaseStatus || "Passed 100% Quality Assurance",
    };

    const saved = await batchService.createBatch(newBatch);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log batch consignment" },
      { status: 500 }
    );
  }
}
