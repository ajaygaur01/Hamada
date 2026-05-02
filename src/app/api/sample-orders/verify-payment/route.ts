import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/sample-order";

type VerifyPayload = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VerifyPayload;

    if (!payload.razorpay_order_id || !payload.razorpay_payment_id || !payload.razorpay_signature) {
      return NextResponse.json({ error: "Missing Razorpay payment details." }, { status: 400 });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      return NextResponse.json({ error: "Payment verification is not configured." }, { status: 500 });
    }

    const isValidSignature = verifyRazorpaySignature({
      razorpayOrderId: payload.razorpay_order_id,
      razorpayPaymentId: payload.razorpay_payment_id,
      razorpaySignature: payload.razorpay_signature,
      razorpayKeySecret,
    });

    if (!isValidSignature) {
      await prisma.sampleOrder.updateMany({
        where: { razorpay_order_id: payload.razorpay_order_id },
        data: { payment_status: "failed", order_status: "cancelled" },
      });
      return NextResponse.json({ error: "Payment signature validation failed." }, { status: 400 });
    }

    await prisma.sampleOrder.updateMany({
      where: { razorpay_order_id: payload.razorpay_order_id },
      data: {
        razorpay_payment_id: payload.razorpay_payment_id,
        payment_status: "paid",
        order_status: "confirmed",
      },
    });

    const updatedOrder = await prisma.sampleOrder.findFirst({
      where: { razorpay_order_id: payload.razorpay_order_id },
      select: { order_number: true },
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found for this payment." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      orderNumber: updatedOrder.order_number,
    });
  } catch {
    return NextResponse.json({ error: "Failed to verify payment." }, { status: 500 });
  }
}
