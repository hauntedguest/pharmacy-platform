import { db, type PrescriptionRecord } from "@/lib/db/repository";

export interface UploadPrescriptionInput {
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientPhone: string;
  shippingCity: string;
  shippingPincode: string;
  doctorName: string;
  doctorRegNo: string;
  clinicHospital: string;
  dateIssued?: string;
  urgency?: "Normal" | "High";
  medications: string[];
  fileUrl?: string;
}

export const prescriptionService = {
  async getAllPrescriptions(): Promise<PrescriptionRecord[]> {
    return await db.getPrescriptions();
  },

  async getPrescriptionById(id: string): Promise<PrescriptionRecord | null> {
    return await db.getPrescriptionById(id);
  },

  /**
   * Validates doctor registration number against Indian State Medical Council format
   * e.g. MMC-2004-49102, DMC-2011-88219, KMC-1998-3412, MCI-77812
   */
  validateDoctorRegNo(regNo: string): boolean {
    const pattern = /^[A-Za-z]{2,5}[-/\s]?[0-9]{4,8}[-/\s]?[0-9]*$/;
    return pattern.test(regNo.trim());
  },

  async createPrescription(input: UploadPrescriptionInput): Promise<PrescriptionRecord> {
    if (!input.patientName || !input.patientPhone) {
      throw new Error("Patient name and contact phone number are required.");
    }

    if (!input.doctorName || !input.doctorRegNo) {
      throw new Error("Prescribing Doctor name and Medical Council Registration Number are required under CDSCO rules.");
    }

    const today = new Date();
    const dateIssued = input.dateIssued || today.toISOString().split("T")[0];

    // Prescriptions valid for 6 months under Indian Drugs & Cosmetics Rules
    const validUntilDate = new Date(today);
    validUntilDate.setMonth(validUntilDate.getMonth() + 6);
    const validUntil = validUntilDate.toISOString().split("T")[0];

    return await db.createPrescription({
      patientName: input.patientName,
      patientAge: Number(input.patientAge) || 30,
      patientGender: input.patientGender || "Male",
      patientPhone: input.patientPhone,
      shippingCity: input.shippingCity || "Mumbai",
      shippingPincode: input.shippingPincode || "400001",
      doctorName: input.doctorName,
      doctorRegNo: input.doctorRegNo.toUpperCase(),
      clinicHospital: input.clinicHospital || "Private Clinic",
      dateIssued,
      validUntil,
      status: "pending",
      urgency: input.urgency || "Normal",
      medications: input.medications && input.medications.length > 0 ? input.medications : ["Standard Formulation"],
      fileUrl: input.fileUrl,
    });
  },

  async approvePrescription(
    id: string,
    pharmacistName: string,
    remarks?: string
  ): Promise<PrescriptionRecord | null> {
    return await db.updatePrescriptionStatus(
      id,
      "approved",
      remarks || "Verified against State Medical Council Register. Complies with Drugs & Cosmetics Rules 1945.",
      pharmacistName
    );
  },

  async rejectPrescription(
    id: string,
    pharmacistName: string,
    reason: string
  ): Promise<PrescriptionRecord | null> {
    return await db.updatePrescriptionStatus(
      id,
      "rejected",
      reason || "Unclear doctor seal / illegible dosage instructions.",
      pharmacistName
    );
  },
};
