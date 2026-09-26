import { mockProducts, type Product } from "@/lib/data/products";
import type {
  OrderRecord,
  PrescriptionRecord,
  RefillRecord,
  BatchRecord,
  TelemetryPoint,
} from "./types";
import {
  initialOrders,
  initialPrescriptions,
  initialRefills,
  initialBatches,
  initialTelemetryMap,
} from "./seeds";

/**
 * In-Memory Fallback Database Store
 * Used when DATABASE_URL is not configured or during offline/mock scenarios.
 */
export class MemoryDatabase {
  private products: Map<string, Product> = new Map();
  private orders: Map<string, OrderRecord> = new Map();
  private prescriptions: Map<string, PrescriptionRecord> = new Map();
  private refills: Map<string, RefillRecord> = new Map();
  private batches: Map<string, BatchRecord> = new Map();
  private telemetry: Map<string, TelemetryPoint[]> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    mockProducts.forEach((p) => this.products.set(p.id, p));
    initialOrders.forEach((ord) => this.orders.set(ord.id, ord));
    initialPrescriptions.forEach((rx) => this.prescriptions.set(rx.id, rx));
    initialRefills.forEach((rf) => this.refills.set(rf.id, rf));
    initialBatches.forEach((b) => this.batches.set(b.batchId, b));
    Object.entries(initialTelemetryMap).forEach(([orderId, points]) => {
      this.telemetry.set(orderId, [...points]);
    });
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | null> {
    const direct = this.products.get(id);
    if (direct) return direct;
    for (const p of this.products.values()) {
      if (p.slug === id || p.id === id) return p;
    }
    return null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    for (const p of this.products.values()) {
      if (p.slug === slug || p.id === slug) return p;
    }
    return null;
  }

  async createProduct(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    let p: Product | null | undefined = this.products.get(id);
    if (!p) {
      p = await this.getProductBySlug(id);
    }
    if (!p) return null;
    const updated: Product = { ...p, ...updates };
    if (updated.stock !== undefined) {
      updated.inStock = updated.stock > 0;
    }
    this.products.set(p.id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const direct = this.products.delete(id);
    if (direct) return true;
    for (const [key, p] of this.products.entries()) {
      if (p.slug === id || p.id === id) {
        this.products.delete(key);
        return true;
      }
    }
    return false;
  }

  async updateProductStock(id: string, delta: number): Promise<Product | null> {
    let p: Product | null | undefined = this.products.get(id);
    if (!p) {
      p = await this.getProductBySlug(id);
    }
    if (!p) return null;
    p.stock = Math.max(0, p.stock + delta);
    p.inStock = p.stock > 0;
    this.products.set(p.id, p);
    return p;
  }

  // --- ORDERS ---
  async getOrders(): Promise<OrderRecord[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<OrderRecord | null> {
    return this.orders.get(id) || null;
  }

  async createOrder(order: Omit<OrderRecord, "id" | "createdAt" | "updatedAt">): Promise<OrderRecord> {
    const id = `ORD-IND-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const newOrder: OrderRecord = {
      ...order,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, newOrder);

    if (newOrder.isColdChain) {
      this.telemetry.set(id, [
        {
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          temp: 3.5,
          location: "Central Cold Vault Hub, BKC Mumbai",
          status: "optimal",
        },
      ]);
    }

    return newOrder;
  }

  async updateOrderStatus(id: string, status: OrderRecord["status"]): Promise<OrderRecord | null> {
    const order = this.orders.get(id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.orders.set(id, order);
    return order;
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
    const order = this.orders.get(id);
    if (!order) return null;
    order.shippingStreet = newAddress.shippingStreet || order.shippingStreet;
    order.shippingCity = newAddress.shippingCity || order.shippingCity;
    order.shippingState = newAddress.shippingState || order.shippingState;
    order.shippingPincode = newAddress.shippingPincode || order.shippingPincode;
    order.updatedAt = new Date().toISOString();
    this.orders.set(id, order);
    return order;
  }

  // --- PRESCRIPTIONS ---
  async getPrescriptions(): Promise<PrescriptionRecord[]> {
    return Array.from(this.prescriptions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPrescriptionById(id: string): Promise<PrescriptionRecord | null> {
    return this.prescriptions.get(id) || null;
  }

  async createPrescription(
    rx: Omit<PrescriptionRecord, "id" | "createdAt">
  ): Promise<PrescriptionRecord> {
    const id = `RX-IND-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRx: PrescriptionRecord = {
      ...rx,
      id,
      createdAt: new Date().toISOString(),
    };
    this.prescriptions.set(id, newRx);
    return newRx;
  }

  async updatePrescriptionStatus(
    id: string,
    status: PrescriptionRecord["status"],
    remarks?: string,
    approvedBy?: string
  ): Promise<PrescriptionRecord | null> {
    const rx = this.prescriptions.get(id);
    if (!rx) return null;
    rx.status = status;
    if (remarks) rx.pharmacistRemarks = remarks;
    if (approvedBy) rx.approvedBy = approvedBy;
    this.prescriptions.set(id, rx);
    return rx;
  }

  // --- REFILLS ---
  async getRefills(): Promise<RefillRecord[]> {
    return Array.from(this.refills.values());
  }

  async getRefillById(id: string): Promise<RefillRecord | null> {
    return this.refills.get(id) || null;
  }

  async createRefill(refill: Omit<RefillRecord, "id" | "createdAt">): Promise<RefillRecord> {
    const id = `SUB-IND-${Math.floor(100 + Math.random() * 900)}`;
    const newRefill: RefillRecord = {
      ...refill,
      id,
      createdAt: new Date().toISOString(),
    };
    this.refills.set(id, newRefill);
    return newRefill;
  }

  async updateRefillStatus(id: string, status: RefillRecord["status"]): Promise<RefillRecord | null> {
    const refill = this.refills.get(id);
    if (!refill) return null;
    refill.status = status;
    this.refills.set(id, refill);
    return refill;
  }

  async deleteRefill(id: string): Promise<boolean> {
    return this.refills.delete(id);
  }

  // --- BATCHES ---
  async getBatches(): Promise<BatchRecord[]> {
    return Array.from(this.batches.values());
  }

  async getBatchById(batchId: string): Promise<BatchRecord | null> {
    return this.batches.get(batchId) || null;
  }

  async createBatch(batch: BatchRecord): Promise<BatchRecord> {
    this.batches.set(batch.batchId, batch);
    return batch;
  }

  // --- TELEMETRY ---
  async getOrderTelemetry(orderId: string): Promise<TelemetryPoint[]> {
    return this.telemetry.get(orderId) || [];
  }

  async addTelemetryPoint(orderId: string, point: TelemetryPoint): Promise<void> {
    const list = this.telemetry.get(orderId) || [];
    list.push(point);
    this.telemetry.set(orderId, list);
  }
}
