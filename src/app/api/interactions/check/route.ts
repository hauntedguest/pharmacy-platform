import { NextRequest, NextResponse } from "next/server";
import { ddiService } from "@/lib/services/ddiService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medications } = body;

    if (!medications || !Array.isArray(medications)) {
      return NextResponse.json(
        { success: false, error: "Medications must be an array of drug names" },
        { status: 400 }
      );
    }

    const results = ddiService.analyzeInteractions(medications);
    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze interactions" },
      { status: 500 }
    );
  }
}
