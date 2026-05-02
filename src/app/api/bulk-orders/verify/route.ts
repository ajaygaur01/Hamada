import { NextResponse } from "next/server";
import { getServerAuthUser } from "@/lib/auth/server-session";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const user = await getServerAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "mocksecret";
    
    // In test environment, if using a mock secret, we'll bypass signature check
    // or just mock the signature check if it's the mock environment.
    let isValidSignature = false;

    if (keySecret === "mocksecret") {
      isValidSignature = true; // bypass for local testing if no keys
    } else {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");
      isValidSignature = generatedSignature === razorpaySignature;
    }

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const invoiceNumber = `INV-${Date.now()}`;

    // Update order status
    await prisma.bulkOrder.update({
      where: { id: orderId },
      data: {
        payment_status: "paid",
        order_status: "confirmed",
        razorpay_payment_id: razorpayPaymentId,
        invoice_number: invoiceNumber,
      }
    });

    // We can generate and save invoice logic here in the future
    // Also send email logic here

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Payment Verify Error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
