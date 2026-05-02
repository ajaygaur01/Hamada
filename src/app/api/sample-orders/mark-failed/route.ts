import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type FailedPayload = {
  razorpay_order_id?: string;
  reason?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FailedPayload;

    if (!payload.razorpay_order_id) {
      return NextResponse.json({ error: "Missing Razorpay order id." }, { status: 400 });
    }

    await prisma.sampleOrder.updateMany({
      where: { razorpay_order_id: payload.razorpay_order_id },
      data: {
        payment_status: "failed",
        order_status: "cancelled",
        notes: payload.reason ? `Payment failed: ${payload.reason}` : "Payment failed",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to mark payment as failed." }, { status: 500 });
  }
}
