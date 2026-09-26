import type { Product } from "@/lib/data/products";
import { getPrismaClient, isDatabaseConfigured } from "./prisma";
import type {
  OrderRecord,
  PrescriptionRecord,
  RefillRecord,
  BatchRecord,
  TelemetryPoint,
} from "./types";
import {
  mapOrderRecord,
  mapPrescriptionRecord,
  mapRefillRecord,
  mapTelemetryRecord,
} from "./mappers";

/**
 * Direct PostgreSQL Operations via Prisma ORM
 */
export const prismaService = {
  async getProducts(): Promise<Product[] | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const rows = await prisma.product.findMany();
      return rows && rows.length > 0 ? (rows as unknown as Product[]) : null;
    } catch (err) {
      console.warn("[Prisma] getProducts failed:", err);
      return null;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const row = await prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });
      return row ? (row as unknown as Product) : null;
    } catch (err) {
      console.warn("[Prisma] getProductById failed:", err);
      return null;
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const row = await prisma.product.findUnique({ where: { slug } });
      return row ? (row as unknown as Product) : null;
    } catch (err) {
      console.warn("[Prisma] getProductBySlug failed:", err);
      return null;
    }
  },

  async createProduct(product: Product): Promise<Product | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const created = await prisma.product.create({
        data: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          subCategory: product.subCategory || null,
          brand: product.brand || "MediCare Plus Labs",
          manufacturer: product.manufacturer || null,
          price: Number(product.price),
          originalPrice: product.originalPrice !== undefined ? Number(product.originalPrice) : null,
          packSize: product.packSize || "Strip of 10",
          stock: Number(product.stock ?? 0),
          inStock: product.inStock ?? (Number(product.stock ?? 0) > 0),
          requiresPrescription: Boolean(product.requiresPrescription),
          prescriptionType: product.prescriptionType || null,
          images: Array.isArray(product.images) && product.images.length > 0 ? product.images : ["/products/placeholder.jpg"],
          description: product.description || `${product.name} formulated by MediCare Plus laboratories.`,
          dosage: product.dosage || null,
          dosageForm: product.dosageForm || "Tablet",
          activeIngredient: product.activeIngredient || null,
          composition: product.composition || null,
          sideEffects: product.sideEffects || [],
          usage: product.usage || "",
          warnings: product.warnings || [],
          storage: product.storage || null,
          featured: Boolean(product.featured),
          bestseller: Boolean(product.bestseller),
          tags: product.tags || [],
          rating: Number(product.rating ?? 4.8),
          reviewCount: Number(product.reviewCount ?? 0),
          discountPercent: product.discountPercent !== undefined ? Number(product.discountPercent) : null,
          isVisible: product.isVisible ?? true,
        },
      });
      return created as unknown as Product;
    } catch (err) {
      console.warn("[Prisma] createProduct failed:", err);
      return null;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const current = await this.getProductById(id);
      if (!current) return null;
      const updatedStock = updates.stock !== undefined ? Number(updates.stock) : current.stock;
      const updatedInStock = updates.inStock !== undefined ? updates.inStock : updatedStock > 0;

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.slug !== undefined) updateData.slug = updates.slug;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.subCategory !== undefined) updateData.subCategory = updates.subCategory;
      if (updates.brand !== undefined) updateData.brand = updates.brand;
      if (updates.manufacturer !== undefined) updateData.manufacturer = updates.manufacturer;
      if (updates.price !== undefined) updateData.price = Number(updates.price);
      if (updates.originalPrice !== undefined) updateData.originalPrice = Number(updates.originalPrice);
      if (updates.packSize !== undefined) updateData.packSize = updates.packSize;
      if (updates.stock !== undefined) updateData.stock = updatedStock;
      if (updates.inStock !== undefined || updates.stock !== undefined) updateData.inStock = updatedInStock;
      if (updates.requiresPrescription !== undefined) updateData.requiresPrescription = Boolean(updates.requiresPrescription);
      if (updates.prescriptionType !== undefined) updateData.prescriptionType = updates.prescriptionType;
      if (updates.images !== undefined) updateData.images = updates.images;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.dosage !== undefined) updateData.dosage = updates.dosage;
      if (updates.dosageForm !== undefined) updateData.dosageForm = updates.dosageForm;
      if (updates.activeIngredient !== undefined) updateData.activeIngredient = updates.activeIngredient;
      if (updates.composition !== undefined) updateData.composition = updates.composition;
      if (updates.sideEffects !== undefined) updateData.sideEffects = updates.sideEffects;
      if (updates.usage !== undefined) updateData.usage = updates.usage;
      if (updates.warnings !== undefined) updateData.warnings = updates.warnings;
      if (updates.storage !== undefined) updateData.storage = updates.storage;
      if (updates.featured !== undefined) updateData.featured = updates.featured;
      if (updates.bestseller !== undefined) updateData.bestseller = updates.bestseller;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.rating !== undefined) updateData.rating = Number(updates.rating);
      if (updates.reviewCount !== undefined) updateData.reviewCount = Number(updates.reviewCount);
      if (updates.discountPercent !== undefined) updateData.discountPercent = Number(updates.discountPercent);
      if (updates.isVisible !== undefined) updateData.isVisible = Boolean(updates.isVisible);

      const updated = await prisma.product.update({
        where: { id: current.id },
        data: updateData,
      });
      return updated as unknown as Product;
    } catch (err) {
      console.warn("[Prisma] updateProduct failed:", err);
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const current = await this.getProductById(id);
      if (!current) return false;
      await prisma.product.delete({
        where: { id: current.id },
      });
      return true;
    } catch (err) {
      console.warn("[Prisma] deleteProduct failed:", err);
      return null;
    }
  },

  async updateProductStock(id: string, delta: number): Promise<Product | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const current = await this.getProductById(id);
      if (!current) return null;
      const newStock = Math.max(0, current.stock + delta);
      const updated = await prisma.product.update({
        where: { id: current.id },
        data: { stock: newStock, inStock: newStock > 0 },
      });
      return updated as unknown as Product;
    } catch (err) {
      console.warn("[Prisma] updateProductStock failed:", err);
      return null;
    }
  },

  async getOrders(): Promise<OrderRecord[] | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const rows = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return rows.map(mapOrderRecord);
    } catch (err) {
      console.warn("[Prisma] getOrders failed:", err);
      return null;
    }
  },

  async getOrderById(id: string): Promise<OrderRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const row = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });
      return row ? mapOrderRecord(row) : null;
    } catch (err) {
      console.warn("[Prisma] getOrderById failed:", err);
      return null;
    }
  },

  async createOrder(
    id: string,
    order: Omit<OrderRecord, "id" | "createdAt" | "updatedAt">
  ): Promise<OrderRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const candidateIds = order.items
        .map((it) => it.productId)
        .filter((pid): pid is string => Boolean(pid && pid.trim().length > 0));

      let existingProductIds = new Set<string>();
      if (candidateIds.length > 0) {
        const found = await prisma.product.findMany({
          where: { id: { in: candidateIds } },
          select: { id: true },
        });
        existingProductIds = new Set(found.map((p) => p.id));
      }

      const created = await prisma.order.create({
        data: {
          id,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          shippingStreet: order.shippingStreet,
          shippingCity: order.shippingCity,
          shippingState: order.shippingState,
          shippingPincode: order.shippingPincode,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          isColdChain: order.isColdChain,
          currentPayloadTemp: order.currentPayloadTemp,
          deliveryOtp: order.deliveryOtp,
          trackingNumber: order.trackingNumber,
          prescriptionId: order.prescriptionId,
          items: {
            create: order.items.map((it) => ({
              productId: it.productId && existingProductIds.has(it.productId) ? it.productId : null,
              productName: it.productName,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              totalPrice: it.totalPrice,
            })),
          },
        },
        include: { items: true },
      });

      if (order.isColdChain) {
        await prisma.telemetryRecord.create({
          data: {
            orderId: id,
            time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            temp: 3.5,
            location: "Central Cold Vault Hub, BKC Mumbai",
            status: "optimal",
          },
        });
      }

      return mapOrderRecord(created);
    } catch (err) {
      console.warn("[Prisma] createOrder failed:", err);
      return null;
    }
  },

  async updateOrderStatus(id: string, status: OrderRecord["status"]): Promise<OrderRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const updated = await prisma.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });
      return mapOrderRecord(updated);
    } catch (err) {
      console.warn("[Prisma] updateOrderStatus failed:", err);
      return null;
    }
  },

  async updateOrderAddress(
    id: string,
    newAddress: {
      shippingStreet: string;
      shippingCity: string;
      shippingState: string;
      shippingPincode: string;
    }
  ): Promise<OrderRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const updated = await prisma.order.update({
        where: { id },
        data: newAddress,
        include: { items: true },
      });
      return mapOrderRecord(updated);
    } catch (err) {
      console.warn("[Prisma] updateOrderAddress failed:", err);
      return null;
    }
  },

  async getPrescriptions(): Promise<PrescriptionRecord[] | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const rows = await prisma.prescription.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(mapPrescriptionRecord);
    } catch (err) {
      console.warn("[Prisma] getPrescriptions failed:", err);
      return null;
    }
  },

  async getPrescriptionById(id: string): Promise<PrescriptionRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const r = await prisma.prescription.findUnique({ where: { id } });
      return r ? mapPrescriptionRecord(r) : null;
    } catch (err) {
      console.warn("[Prisma] getPrescriptionById failed:", err);
      return null;
    }
  },

  async createPrescription(
    id: string,
    rx: Omit<PrescriptionRecord, "id" | "createdAt">
  ): Promise<PrescriptionRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const created = await prisma.prescription.create({
        data: { id, ...rx, medications: rx.medications || [] },
      });
      return mapPrescriptionRecord(created);
    } catch (err) {
      console.warn("[Prisma] createPrescription failed:", err);
      return null;
    }
  },

  async updatePrescriptionStatus(
    id: string,
    status: PrescriptionRecord["status"],
    remarks?: string,
    approvedBy?: string
  ): Promise<PrescriptionRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const updated = await prisma.prescription.update({
        where: { id },
        data: {
          status,
          ...(remarks ? { pharmacistRemarks: remarks } : {}),
          ...(approvedBy ? { approvedBy } : {}),
        },
      });
      return mapPrescriptionRecord(updated);
    } catch (err) {
      console.warn("[Prisma] updatePrescriptionStatus failed:", err);
      return null;
    }
  },

  async getRefills(): Promise<RefillRecord[] | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const rows = await prisma.refill.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(mapRefillRecord);
    } catch (err) {
      console.warn("[Prisma] getRefills failed:", err);
      return null;
    }
  },

  async getRefillById(id: string): Promise<RefillRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const r = await prisma.refill.findUnique({ where: { id } });
      return r ? mapRefillRecord(r) : null;
    } catch (err) {
      console.warn("[Prisma] getRefillById failed:", err);
      return null;
    }
  },

  async createRefill(
    id: string,
    refill: Omit<RefillRecord, "id" | "createdAt">
  ): Promise<RefillRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const created = await prisma.refill.create({ data: { id, ...refill } });
      return mapRefillRecord(created);
    } catch (err) {
      console.warn("[Prisma] createRefill failed:", err);
      return null;
    }
  },

  async updateRefillStatus(id: string, status: RefillRecord["status"]): Promise<RefillRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const updated = await prisma.refill.update({
        where: { id },
        data: { status },
      });
      return mapRefillRecord(updated);
    } catch (err) {
      console.warn("[Prisma] updateRefillStatus failed:", err);
      return null;
    }
  },

  async deleteRefill(id: string): Promise<boolean | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      await prisma.refill.delete({ where: { id } });
      return true;
    } catch (err) {
      console.warn("[Prisma] deleteRefill failed:", err);
      return null;
    }
  },

  async getBatches(): Promise<BatchRecord[] | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const rows = await prisma.batch.findMany({ orderBy: { mfgDate: "desc" } });
      return rows as unknown as BatchRecord[];
    } catch (err) {
      console.warn("[Prisma] getBatches failed:", err);
      return null;
    }
  },

  async getBatchById(batchId: string): Promise<BatchRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const row = await prisma.batch.findUnique({ where: { batchId } });
      return row ? (row as unknown as BatchRecord) : null;
    } catch (err) {
      console.warn("[Prisma] getBatchById failed:", err);
      return null;
    }
  },

  async createBatch(batch: BatchRecord): Promise<BatchRecord | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const created = await prisma.batch.create({ data: { ...batch } });
      return created as unknown as BatchRecord;
    } catch (err) {
      console.warn("[Prisma] createBatch failed:", err);
      return null;
    }
  },

  async getOrderTelemetry(orderId: string): Promise<TelemetryPoint[] | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      const rows = await prisma.telemetryRecord.findMany({
        where: { orderId },
        orderBy: { createdAt: "asc" },
      });
      return rows && rows.length > 0 ? rows.map(mapTelemetryRecord) : null;
    } catch (err) {
      console.warn("[Prisma] getOrderTelemetry failed:", err);
      return null;
    }
  },

  async addTelemetryPoint(orderId: string, point: TelemetryPoint): Promise<boolean | null> {
    const prisma = getPrismaClient();
    if (!prisma || !isDatabaseConfigured()) return null;
    try {
      await prisma.telemetryRecord.create({
        data: {
          orderId,
          time: point.time,
          temp: point.temp,
          location: point.location,
          status: point.status,
        },
      });
      return true;
    } catch (err) {
      console.warn("[Prisma] addTelemetryPoint failed:", err);
      return null;
    }
  },
};
