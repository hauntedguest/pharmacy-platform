import { db, type RefillRecord } from "@/lib/db/repository";

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
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (input.intervalDays || 30));

    return await db.createRefill({
      productId: input.productId,
      productName: input.productName,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      quantity: input.quantity || 1,
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
};
