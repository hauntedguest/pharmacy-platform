import { db, type OrderRecord, type OrderItemRecord } from "@/lib/db/repository";
import { isValidIndianPincode, isValidIndianPhone, isValidEmail } from "@/lib/validation/validators";

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
  totalAmount?: number;
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
    const pin = (input.shippingPincode || "").trim();
    if (!isValidIndianPincode(pin)) {
      throw new Error("Invalid Indian PIN code. Must be 6 digits and cannot start with 0.");
    }

    // Validate phone number (Indian 10-digit standard)
    if (!isValidIndianPhone(input.customerPhone)) {
      throw new Error("Invalid Indian mobile number. Must be a 10-digit number starting with 6, 7, 8, or 9.");
    }

    // Validate email if provided
    if (input.customerEmail && !isValidEmail(input.customerEmail)) {
      throw new Error("Invalid email address format.");
    }

    // Validate warehouse stock availability for all items before creating order
    for (const item of input.items || []) {
      if (item.productId && item.productId !== "PROD-GEN") {
        const product = await db.getProductById(item.productId);
        if (product) {
          if (product.stock <= 0) {
            throw new Error(`Item "${product.name}" is currently sold out and unavailable for ordering.`);
          }
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for "${product.name}". Available warehouse stock: ${product.stock} units, requested: ${item.quantity} units.`);
          }
        }
      }
    }

    // Calculate totals and check for cold-chain items
    let calculatedTotal = 0;
    let isColdChain = false;

    const orderItems: OrderItemRecord[] = await Promise.all(
      (input.items || []).map(async (item) => {
        let price = Number(item.unitPrice) || 0;
        const qty = Math.max(1, Number(item.quantity) || 1);

        // Fallback: If price is missing or 0, look up directly from catalog
        if (price <= 0 && item.productId) {
          const product = await db.getProductById(item.productId);
          if (product && product.price > 0) {
            price = product.price;
          }
        }

        const lineTotal = price * qty;
        calculatedTotal += lineTotal;

        // Check if item is cold-chain formulation
        const pName = (item.productName || "").toLowerCase();
        if (
          pName.includes("omega") ||
          pName.includes("probiotic") ||
          pName.includes("insulin") ||
          pName.includes("d3") ||
          pName.includes("vaccine") ||
          pName.includes("lipid")
        ) {
          isColdChain = true;
        }

        return {
          productId: item.productId || "PROD-GEN",
          productName: item.productName || "MediCare Formulation",
          quantity: qty,
          unitPrice: price,
          totalPrice: lineTotal,
        };
      })
    );

    // If client supplied a valid totalAmount, respect it (e.g. including shipping/discounts), otherwise use calculatedTotal
    const finalTotal =
      typeof input.totalAmount === "number" && input.totalAmount > 0
        ? input.totalAmount
        : calculatedTotal;

    // Determine payment status based on method
    const isCOD = (input.paymentMethod || "").toLowerCase().includes("delivery") || (input.paymentMethod || "").toLowerCase().includes("cod");
    const paymentStatus: "Pending" | "Paid" = isCOD ? "Pending" : "Paid";

    // 4-digit statutory delivery verification OTP for safe medication handover
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const cityCode = (input.shippingCity || "IND").trim().substring(0, 3).toUpperCase() || "IND";
    const trackingNumber = `MCP-EXP-${cityCode}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await db.createOrder({
      customerName: input.customerName || "Customer",
      customerPhone: input.customerPhone || "9820154321",
      customerEmail: input.customerEmail || "",
      shippingStreet: input.shippingStreet || "",
      shippingCity: input.shippingCity || "",
      shippingState: input.shippingState || "",
      shippingPincode: pin,
      items: orderItems,
      totalAmount: finalTotal,
      paymentMethod: input.paymentMethod || "UPI (Google Pay)",
      paymentStatus,
      status: "Verified",
      isColdChain,
      currentPayloadTemp: isColdChain ? "3.6°C" : "Ambient",
      deliveryOtp,
      trackingNumber,
      prescriptionId: input.prescriptionId,
    });

    // Deduct stock
    for (const item of orderItems) {
      if (item.productId && item.productId !== "PROD-GEN") {
        await db.updateProductStock(item.productId, -item.quantity);
      }
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderRecord["status"]): Promise<OrderRecord | null> {
    return await db.updateOrderStatus(id, status);
  },

  async updateOrderAddress(
    id: string,
    newAddress: {
      shippingStreet: string;
      shippingCity: string;
      shippingState: string;
      shippingPincode: string;
    }
  ): Promise<OrderRecord> {
    const pin = (newAddress.shippingPincode || "").trim();
    if (!isValidIndianPincode(pin)) {
      throw new Error("Invalid Indian PIN code. Must be 6 digits and cannot start with 0.");
    }
    const order = await db.getOrderById(id);
    if (!order) {
      throw new Error(`Order "${id}" was not found.`);
    }
    if (order.status === "Delivered" || order.status === "Cancelled") {
      throw new Error(`Cannot modify delivery address because order status is already "${order.status}".`);
    }
    const updated = await db.updateOrderAddress(id, {
      ...newAddress,
      shippingPincode: pin,
    });
    if (!updated) {
      throw new Error("Failed to update order address.");
    }
    return updated;
  },

  async getOrderTelemetry(orderId: string) {
    return await db.getOrderTelemetry(orderId);
  },
};
