import { NextRequest, NextResponse } from "next/server";
import { aiChatbotService } from "@/lib/services/aiChatbotService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message || "";
    const context = body.context || {};

    if (!message.trim()) {
      return NextResponse.json(
        { success: false, error: "Query message cannot be empty" },
        { status: 400 }
      );
    }

    const response = await aiChatbotService.processQuery(message, context);
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process AI chat query" },
      { status: 500 }
    );
  }
}
