import { NextRequest, NextResponse } from "next/server";
import { prescriptionService } from "@/lib/services/prescriptionService";

export async function GET() {
  try {
    const rxList = await prescriptionService.getAllPrescriptions();
    return NextResponse.json({ success: true, data: rxList });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rx = await prescriptionService.createPrescription(body);
    return NextResponse.json({ success: true, data: rx }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload prescription" },
      { status: 400 }
    );
  }
}
