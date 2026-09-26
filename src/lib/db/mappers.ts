import type {
  OrderRecord,
  PrescriptionRecord,
  RefillRecord,
  TelemetryPoint,
} from "./types";

export function mapOrderRecord(r: any): OrderRecord {
  return {
    id: r.id,
    customerName: r.customerName,
    customerPhone: r.customerPhone,
    customerEmail: r.customerEmail,
    shippingStreet: r.shippingStreet,
    shippingCity: r.shippingCity,
    shippingState: r.shippingState,
    shippingPincode: r.shippingPincode,
    totalAmount: r.totalAmount,
    paymentMethod: r.paymentMethod,
    paymentStatus: r.paymentStatus as OrderRecord["paymentStatus"],
    status: r.status as OrderRecord["status"],
    isColdChain: r.isColdChain,
    currentPayloadTemp: r.currentPayloadTemp,
    deliveryOtp: r.deliveryOtp,
    trackingNumber: r.trackingNumber,
    prescriptionId: r.prescriptionId ?? undefined,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : r.createdAt.toISOString(),
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : r.updatedAt.toISOString(),
    items: (r.items || []).map((it: any) => ({
      productId: it.productId || "PROD-GEN",
      productName: it.productName,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      totalPrice: it.totalPrice,
    })),
  };
}

export function mapPrescriptionRecord(r: any): PrescriptionRecord {
  return {
    id: r.id,
    patientName: r.patientName,
    patientAge: r.patientAge,
    patientGender: r.patientGender as PrescriptionRecord["patientGender"],
    patientPhone: r.patientPhone,
    shippingCity: r.shippingCity,
    shippingPincode: r.shippingPincode,
    doctorName: r.doctorName,
    doctorRegNo: r.doctorRegNo,
    clinicHospital: r.clinicHospital,
    dateIssued: r.dateIssued,
    validUntil: r.validUntil,
    status: r.status as PrescriptionRecord["status"],
    urgency: r.urgency as PrescriptionRecord["urgency"],
    medications: r.medications || [],
    fileUrl: r.fileUrl ?? undefined,
    pharmacistRemarks: r.pharmacistRemarks ?? undefined,
    approvedBy: r.approvedBy ?? undefined,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : r.createdAt.toISOString(),
  };
}

export function mapRefillRecord(r: any): RefillRecord {
  return {
    id: r.id,
    productId: r.productId,
    productName: r.productName,
    customerName: r.customerName,
    customerPhone: r.customerPhone,
    quantity: r.quantity,
    intervalDays: r.intervalDays,
    nextRefillDate: r.nextRefillDate,
    status: r.status as RefillRecord["status"],
    whatsappReminder: r.whatsappReminder,
    rxValidityMonths: r.rxValidityMonths,
    remainingPillsEstimate: r.remainingPillsEstimate,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : r.createdAt.toISOString(),
  };
}

export function mapTelemetryRecord(r: any): TelemetryPoint {
  return {
    time: r.time,
    temp: r.temp,
    location: r.location,
    status: r.status as TelemetryPoint["status"],
  };
}
