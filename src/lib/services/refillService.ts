import { db, type RefillRecord } from "@/lib/db/repository";
import { isValidIndianPhone } from "@/lib/validation/validators";

export interface CreateRefillInput {
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  intervalDays: number;
  whatsappReminder?: boolean;
}

export const refillService = {
  async getAllRefills(): Promise<RefillRecord[]> {
    return await db.getRefills();
  },

  async getRefillById(id: string): Promise<RefillRecord | null> {
    return await db.getRefillById(id);
  },

  async createRefill(input: CreateRefillInput): Promise<RefillRecord> {
    if (!input.productName || !input.productId) {
      throw new Error("Product ID and Formulation Name are required.");
    }

    if (!isValidIndianPhone(input.customerPhone)) {
      throw new Error("Invalid Indian mobile number for refill notifications.");
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (input.intervalDays || 30));

    return await db.createRefill({
      productId: input.productId,
      productName: input.productName,
      customerName: input.customerName || "Patient",
      customerPhone: input.customerPhone,
      quantity: Math.max(1, input.quantity || 1),
      intervalDays: input.intervalDays || 30,
      nextRefillDate: nextDate.toISOString().split("T")[0],
      status: "Active",
      whatsappReminder: input.whatsappReminder !== undefined ? input.whatsappReminder : true,
      rxValidityMonths: 6,
      remainingPillsEstimate: 30,
    });
  },

  async updateRefillStatus(id: string, status: RefillRecord["status"]): Promise<RefillRecord | null> {
    return await db.updateRefillStatus(id, status);
  },

  async deleteRefill(id: string): Promise<boolean> {
    return await db.deleteRefill(id);
  },
};
