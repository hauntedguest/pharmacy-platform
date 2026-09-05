import { NextRequest, NextResponse } from "next/server";
import { prescriptionService } from "@/lib/services/prescriptionService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const rx = await prescriptionService.getPrescriptionById(id);

    if (!rx) {
      return NextResponse.json(
        { success: false, error: "Prescription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rx });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve prescription" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body.action || !["approve", "reject"].includes(body.action)) {
      return NextResponse.json(
        { success: false, error: "Action must be either 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const pharmacistName = body.pharmacistName || "Duty Pharmacist (CDSCO Certified)";
    let updated;

    if (body.action === "approve") {
      updated = await prescriptionService.approvePrescription(id, pharmacistName, body.remarks);
    } else {
      updated = await prescriptionService.rejectPrescription(
        id,
        pharmacistName,
        body.reason || "Prescription details could not be validated against CDSCO norms."
      );
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Prescription record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process prescription" },
      { status: 500 }
    );
  }
}
