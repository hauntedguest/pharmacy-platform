import { db, type BatchRecord } from "@/lib/db/repository";

export const batchService = {
  async getAllBatches(): Promise<BatchRecord[]> {
    return await db.getBatches();
  },

  async getBatchById(batchId: string): Promise<BatchRecord | null> {
    return await db.getBatchById(batchId);
  },
};
