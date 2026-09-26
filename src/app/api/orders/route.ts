import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/orderService";

export async function GET() {
  try {
    const orders = await orderService.getAllOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await orderService.createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, action, newAddress, status } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    if (action === "UPDATE_ADDRESS" || newAddress) {
      const updated = await orderService.updateOrderAddress(orderId, newAddress);
      return NextResponse.json({
        success: true,
        message: `Delivery address successfully updated for order ${orderId}`,
        data: updated,
      });
    }

    if (action === "UPDATE_STATUS" || status) {
      const updated = await orderService.updateOrderStatus(orderId, status);
      return NextResponse.json({
        success: true,
        message: `Order status updated to ${status}`,
        data: updated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid PATCH action. Supported: UPDATE_ADDRESS, UPDATE_STATUS" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 400 }
    );
  }
}
