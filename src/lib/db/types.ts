import type { Product } from "@/lib/data/products";

export interface OrderItemRecord {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: OrderItemRecord[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  status: "Verified" | "Dispensing" | "Dispatched" | "Out for Delivery" | "Delivered" | "Cancelled";
  isColdChain: boolean;
  currentPayloadTemp: string;
  deliveryOtp: string;
  trackingNumber: string;
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionRecord {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientPhone: string;
  shippingCity: string;
  shippingPincode: string;
  doctorName: string;
  doctorRegNo: string;
  clinicHospital: string;
  dateIssued: string;
  validUntil: string;
  status: "pending" | "approved" | "rejected";
  urgency: "Normal" | "High";
  medications: string[];
  fileUrl?: string;
  pharmacistRemarks?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface RefillRecord {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  intervalDays: number;
  nextRefillDate: string;
  status: "Active" | "Paused" | "Cancelled";
  whatsappReminder: boolean;
  rxValidityMonths: number;
  remainingPillsEstimate: number;
  createdAt: string;
}

export interface BatchRecord {
  batchId: string;
  productId: string;
  productName: string;
  manufacturer: string;
  manufacturingFacility: string;
  mfgDate: string;
  expiryDate: string;
  purityAssayPct: number;
  heavyMetalsScreen: string;
  microbialTest: string;
  dissolutionRate: string;
  storageVaultZone: string;
  currentVaultTemp: string;
  totalStockUnits: number;
  reorderLevel: number;
  releasePharmacist: string;
  releaseStatus: string;
}

export interface TelemetryPoint {
  time: string;
  temp: number;
  location: string;
  status: "optimal" | "warning";
}

export type { Product };
