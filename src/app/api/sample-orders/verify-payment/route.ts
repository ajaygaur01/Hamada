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
    console.log("verify-payment API called. Payload:", payload);

    if (!payload.razorpay_order_id || !payload.razorpay_payment_id || !payload.razorpay_signature) {
      console.warn("verify-payment warning: Missing details in payload:", payload);
      return NextResponse.json({ error: "Missing Razorpay payment details." }, { status: 400 });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      console.error("verify-payment error: RAZORPAY_KEY_SECRET is not configured.");
      return NextResponse.json({ error: "Payment verification is not configured." }, { status: 500 });
    }

    const isValidSignature = verifyRazorpaySignature({
      razorpayOrderId: payload.razorpay_order_id,
      razorpayPaymentId: payload.razorpay_payment_id,
      razorpaySignature: payload.razorpay_signature,
      razorpayKeySecret,
    });
    console.log("Signature valid status:", isValidSignature);

    if (!isValidSignature) {
      console.warn("Signature validation failed for order id:", payload.razorpay_order_id);
      await prisma.sampleOrder.updateMany({
        where: { razorpay_order_id: payload.razorpay_order_id },
        data: { payment_status: "failed", order_status: "cancelled" },
      });
      return NextResponse.json({ error: "Payment signature validation failed." }, { status: 400 });
    }

    const updateResult = await prisma.sampleOrder.updateMany({
      where: { razorpay_order_id: payload.razorpay_order_id },
      data: {
        razorpay_payment_id: payload.razorpay_payment_id,
        payment_status: "paid",
        order_status: "confirmed",
      },
    });
    console.log("Prisma sampleOrder updateMany result:", updateResult);

    const updatedOrder = await prisma.sampleOrder.findFirst({
      where: { razorpay_order_id: payload.razorpay_order_id },
      select: { order_number: true },
    });
    console.log("Fetched updated sampleOrder:", updatedOrder);

    if (!updatedOrder) {
      console.error("verify-payment error: Order not found for order id:", payload.razorpay_order_id);
      return NextResponse.json({ error: "Order not found for this payment." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      orderNumber: updatedOrder.order_number,
    });
  } catch (error) {
    console.error("verify-payment Exception occurred:", error);
    return NextResponse.json({ error: "Failed to verify payment." }, { status: 500 });
  }
}
