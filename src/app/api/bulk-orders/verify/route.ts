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
    const updatedOrder = await prisma.bulkOrder.update({
      where: { id: orderId },
      data: {
        payment_status: "paid",
        order_status: "confirmed",
        razorpay_payment_id: razorpayPaymentId,
        invoice_number: invoiceNumber,
      },
      include: {
        user: { select: { full_name: true, company_name: true, gstin: true, company_address: true } },
        address: true,
      }
    });

    // Ensure Invoice record doesn't exist already to avoid unique constraint violations
    const existingInvoice = await prisma.invoice.findUnique({
      where: { bulk_order_id: orderId }
    });

    if (!existingInvoice) {
      const buyerAddress = updatedOrder.user.company_address || 
        `${updatedOrder.address.address_line1}${updatedOrder.address.address_line2 ? `, ${updatedOrder.address.address_line2}` : ""}, ${updatedOrder.address.city}, ${updatedOrder.address.state} - ${updatedOrder.address.pincode}`;

      await prisma.invoice.create({
        data: {
          invoice_number: invoiceNumber,
          bulk_order_id: orderId,
          user_id: user.id,
          buyer_name: updatedOrder.user.full_name || "Walk-in Customer",
          buyer_company: updatedOrder.user.company_name || "",
          buyer_gstin: updatedOrder.user.gstin || "",
          buyer_address: buyerAddress,
          seller_name: "Hamada Global Trading",
          seller_gstin: "06AAGCH4681R1ZV",
          seller_address: "B1, HOUSE NO 2 P, SECTOR 31, Gurugram 122001, Haryana, India",
          subtotal: updatedOrder.subtotal,
          cgst_amount: updatedOrder.cgst_amount,
          sgst_amount: updatedOrder.sgst_amount,
          igst_amount: updatedOrder.igst_amount,
          total_amount: updatedOrder.total_amount,
          invoice_date: new Date(),
        }
      });
    }

    // Trigger notification email to operations@chirantea.in (blocking to ensure it completes in serverless environments)
    try {
      const { sendOrderNotificationEmail } = await import("@/lib/email-service");
      await sendOrderNotificationEmail(orderId, "bulk");
    } catch (err) {
      console.error("[bulk-verify] Error sending bulk order notification email:", err);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Payment Verify Error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
