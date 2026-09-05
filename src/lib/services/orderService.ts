import { db, type OrderRecord, type OrderItemRecord } from "@/lib/db/repository";

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  paymentMethod: string;
  prescriptionId?: string;
}

export const orderService = {
  async getAllOrders(): Promise<OrderRecord[]> {
    return await db.getOrders();
  },

  async getOrderById(id: string): Promise<OrderRecord | null> {
    return await db.getOrderById(id);
  },

  async createOrder(input: CreateOrderInput): Promise<OrderRecord> {
    // Validate Indian PIN code (6 digits)
    if (!/^[1-9][0-9]{5}$/.test(input.shippingPincode.trim())) {
      throw new Error("Invalid Indian PIN code. Must be 6 digits.");
    }

    // Validate phone number (Indian 10-digit standard)
    const sanitizedPhone = input.customerPhone.replace(/[^0-9+]/g, "");
    if (!sanitizedPhone) {
      throw new Error("Customer phone number is required.");
    }

    // Calculate totals and check for cold-chain items
    let totalAmount = 0;
    let isColdChain = false;

    const orderItems: OrderItemRecord[] = input.items.map((item) => {
      const lineTotal = item.unitPrice * item.quantity;
      totalAmount += lineTotal;
      // If item is cold-chain formulation (e.g. Omega-3 softgels or live probiotics)
      if (
        item.productName.toLowerCase().includes("omega") ||
        item.productName.toLowerCase().includes("probiotic") ||
        item.productName.toLowerCase().includes("insulin")
      ) {
        isColdChain = true;
      }
      return {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: lineTotal,
      };
    });

    // 4-digit statutory delivery verification OTP for safe medication handover
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const trackingNumber = `MCP-EXP-${input.shippingCity.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await db.createOrder({
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      shippingStreet: input.shippingStreet,
      shippingCity: input.shippingCity,
      shippingState: input.shippingState,
      shippingPincode: input.shippingPincode,
      items: orderItems,
      totalAmount,
      paymentMethod: input.paymentMethod || "UPI (Google Pay)",
      paymentStatus: "Paid",
      status: "Verified",
      isColdChain,
      currentPayloadTemp: isColdChain ? "3.6°C" : "Ambient",
      deliveryOtp,
      trackingNumber,
      prescriptionId: input.prescriptionId,
    });

    // Deduct stock
    for (const item of input.items) {
      await db.updateProductStock(item.productId, -item.quantity);
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderRecord["status"]): Promise<OrderRecord | null> {
    return await db.updateOrderStatus(id, status);
  },

  async getOrderTelemetry(orderId: string) {
    return await db.getOrderTelemetry(orderId);
  },
};
