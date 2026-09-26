import type { Product } from "@/lib/data/products";
import type {
  OrderRecord,
  PrescriptionRecord,
  RefillRecord,
  BatchRecord,
  TelemetryPoint,
} from "./types";
import { MemoryDatabase } from "./memory-store";
import { prismaService } from "./prisma-service";

export * from "./types";

/**
 * Hybrid Database Repository Layer
 * Dispatches to PostgreSQL Prisma Client when connected, or falls back to MemoryDatabase.
 */
class HybridDatabaseRepository {
  private memoryDb: MemoryDatabase;

  constructor() {
    this.memoryDb = new MemoryDatabase();
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    const res = await prismaService.getProducts();
    return res ?? this.memoryDb.getProducts();
  }

  async getProductById(id: string): Promise<Product | null> {
    const res = await prismaService.getProductById(id);
    return res ?? this.memoryDb.getProductById(id);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const res = await prismaService.getProductBySlug(slug);
    return res ?? this.memoryDb.getProductBySlug(slug);
  }

  async createProduct(product: Product): Promise<Product> {
    const res = await prismaService.createProduct(product);
    return res ?? this.memoryDb.createProduct(product);
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const res = await prismaService.updateProduct(id, updates);
    return res ?? this.memoryDb.updateProduct(id, updates);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const res = await prismaService.deleteProduct(id);
    return res ?? this.memoryDb.deleteProduct(id);
  }

  async updateProductStock(id: string, delta: number): Promise<Product | null> {
    const res = await prismaService.updateProductStock(id, delta);
    return res ?? this.memoryDb.updateProductStock(id, delta);
  }

  // --- ORDERS ---
  async getOrders(): Promise<OrderRecord[]> {
    const res = await prismaService.getOrders();
    return res ?? this.memoryDb.getOrders();
  }

  async getOrderById(id: string): Promise<OrderRecord | null> {
    const res = await prismaService.getOrderById(id);
    return res ?? this.memoryDb.getOrderById(id);
  }

  async createOrder(order: Omit<OrderRecord, "id" | "createdAt" | "updatedAt">): Promise<OrderRecord> {
    const id = `ORD-IND-${Math.floor(10000 + Math.random() * 90000)}`;
    const res = await prismaService.createOrder(id, order);
    return res ?? this.memoryDb.createOrder(order);
  }

  async updateOrderStatus(id: string, status: OrderRecord["status"]): Promise<OrderRecord | null> {
    const res = await prismaService.updateOrderStatus(id, status);
    return res ?? this.memoryDb.updateOrderStatus(id, status);
  }

  async updateOrderAddress(
    id: string,
    newAddress: {
      shippingStreet: string;
      shippingCity: string;
      shippingState: string;
      shippingPincode: string;
    }
  ): Promise<OrderRecord | null> {
    const res = await prismaService.updateOrderAddress(id, newAddress);
    return res ?? this.memoryDb.updateOrderAddress(id, newAddress);
  }

  // --- PRESCRIPTIONS ---
  async getPrescriptions(): Promise<PrescriptionRecord[]> {
    const res = await prismaService.getPrescriptions();
    return res ?? this.memoryDb.getPrescriptions();
  }

  async getPrescriptionById(id: string): Promise<PrescriptionRecord | null> {
    const res = await prismaService.getPrescriptionById(id);
    return res ?? this.memoryDb.getPrescriptionById(id);
  }

  async createPrescription(
    rx: Omit<PrescriptionRecord, "id" | "createdAt">
  ): Promise<PrescriptionRecord> {
    const id = `RX-IND-${Math.floor(1000 + Math.random() * 9000)}`;
    const res = await prismaService.createPrescription(id, rx);
    return res ?? this.memoryDb.createPrescription(rx);
  }

  async updatePrescriptionStatus(
    id: string,
    status: PrescriptionRecord["status"],
    remarks?: string,
    approvedBy?: string
  ): Promise<PrescriptionRecord | null> {
    const res = await prismaService.updatePrescriptionStatus(id, status, remarks, approvedBy);
    return res ?? this.memoryDb.updatePrescriptionStatus(id, status, remarks, approvedBy);
  }

  // --- REFILLS ---
  async getRefills(): Promise<RefillRecord[]> {
    const res = await prismaService.getRefills();
    return res ?? this.memoryDb.getRefills();
  }

  async getRefillById(id: string): Promise<RefillRecord | null> {
    const res = await prismaService.getRefillById(id);
    return res ?? this.memoryDb.getRefillById(id);
  }

  async createRefill(refill: Omit<RefillRecord, "id" | "createdAt">): Promise<RefillRecord> {
    const id = `SUB-IND-${Math.floor(100 + Math.random() * 900)}`;
    const res = await prismaService.createRefill(id, refill);
    return res ?? this.memoryDb.createRefill(refill);
  }

  async updateRefillStatus(id: string, status: RefillRecord["status"]): Promise<RefillRecord | null> {
    const res = await prismaService.updateRefillStatus(id, status);
    return res ?? this.memoryDb.updateRefillStatus(id, status);
  }

  async deleteRefill(id: string): Promise<boolean> {
    const res = await prismaService.deleteRefill(id);
    return res ?? this.memoryDb.deleteRefill(id);
  }

  // --- BATCHES ---
  async getBatches(): Promise<BatchRecord[]> {
    const res = await prismaService.getBatches();
    return res ?? this.memoryDb.getBatches();
  }

  async getBatchById(batchId: string): Promise<BatchRecord | null> {
    const res = await prismaService.getBatchById(batchId);
    return res ?? this.memoryDb.getBatchById(batchId);
  }

  async createBatch(batch: BatchRecord): Promise<BatchRecord> {
    const res = await prismaService.createBatch(batch);
    return res ?? this.memoryDb.createBatch(batch);
  }

  // --- TELEMETRY ---
  async getOrderTelemetry(orderId: string): Promise<TelemetryPoint[]> {
    const res = await prismaService.getOrderTelemetry(orderId);
    return res ?? this.memoryDb.getOrderTelemetry(orderId);
  }

  async addTelemetryPoint(orderId: string, point: TelemetryPoint): Promise<void> {
    const res = await prismaService.addTelemetryPoint(orderId, point);
    if (!res) {
      await this.memoryDb.addTelemetryPoint(orderId, point);
    }
  }
}

// Global Singleton for database operations across all Next.js API routes & Server Actions
const globalForDb = globalThis as unknown as { __medicareDb?: HybridDatabaseRepository };
export const db = globalForDb.__medicareDb ?? new HybridDatabaseRepository();
globalForDb.__medicareDb = db;
