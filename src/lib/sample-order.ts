import crypto from "node:crypto";
import { isSampleSize as isSampleSizeByGrams } from "@/lib/tea-size";
import prisma from "@/lib/prisma";

export type SampleOrderInput = {
  customerName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  deliveryCity?: string;
  deliveryState?: string;
  country?: string;
  pincode?: string;
  additionalNote?: string;
  variantId?: string;
  productSlug?: string;
};

export function isSampleSize(size: string) {
  return isSampleSizeByGrams(size);
}

export function validateSampleOrderInput(input: SampleOrderInput) {
  if (!input.customerName || input.customerName.trim().length < 2) {
    return "Please enter a valid name.";
  }
  if (!input.email || !/^\S+@\S+\.\S+$/.test(input.email.trim())) {
    return "Please enter a valid email.";
  }
  if (!input.phone || !/^\d{10}$/.test(input.phone.trim())) {
    return "Please enter a valid 10-digit phone number.";
  }
  if (!input.addressLine1 || input.addressLine1.trim().length < 5) {
    return "Please enter a valid address line 1.";
  }
  if (!input.deliveryState || input.deliveryState.trim().length < 2) {
    return "Please enter your state.";
  }
  if (!input.deliveryCity || input.deliveryCity.trim().length < 2) {
    return "Please enter delivery city.";
  }
  if (!input.pincode || !/^\d{6}$/.test(input.pincode.trim())) {
    return "Please enter a valid 6-digit pincode.";
  }
  if (!input.variantId) {
    return "Please choose a product variant.";
  }
  return null;
}

export function sanitizeSampleOrderInput(input: SampleOrderInput) {
  return {
    customerName: input.customerName?.trim() ?? "",
    businessName: input.businessName?.trim() || null,
    email: input.email?.trim().toLowerCase() ?? "",
    phone: input.phone?.trim() ?? "",
    addressLine1: input.addressLine1?.trim() ?? "",
    addressLine2: input.addressLine2?.trim() || null,
    landmark: input.landmark?.trim() || null,
    deliveryCity: input.deliveryCity?.trim() ?? "",
    deliveryState: input.deliveryState?.trim() ?? "",
    country: input.country?.trim() ?? "India",
    pincode: input.pincode?.trim() ?? "",
    additionalNote: input.additionalNote?.trim() || null,
    variantId: input.variantId ?? "",
    productSlug: input.productSlug?.trim() ?? "",
  };
}

export async function generateNextSampleOrderNumber() {
  const latestOrder = await prisma.sampleOrder.findFirst({
    orderBy: { created_at: "desc" },
    select: { order_number: true },
  });

  if (!latestOrder) {
    return "SMP-1";
  }

  const match = latestOrder.order_number.match(/^SMP-(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    // If it's a small sequential number, increment it.
    // If it's a large timestamp/random number, restart the sequence at 1.
    if (num < 10000000) {
      return `SMP-${num + 1}`;
    }
  }

  // Fallback for older formats like SMP-33609603-8483
  return "SMP-1";
}

export function verifyRazorpaySignature(payload: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  razorpayKeySecret: string;
}) {
  const generatedSignature = crypto
    .createHmac("sha256", payload.razorpayKeySecret)
    .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === payload.razorpaySignature;
}

export async function syncRazorpayPaymentIfNeeded(order: any, type: "sample" | "bulk") {
  // If not razorpay, or not pending, or no razorpay_order_id, nothing to do
  if (order.payment_method !== "razorpay" || order.payment_status !== "pending" || !order.razorpay_order_id) {
    return order;
  }

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeyId || !razorpayKeySecret) {
    return order;
  }

  try {
    const { default: Razorpay } = await import("razorpay");
    const { default: prisma } = await import("@/lib/prisma");

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const rzpOrder = await razorpay.orders.fetch(order.razorpay_order_id);

    // Check if the order is paid
    if (rzpOrder.status === "paid" || (rzpOrder.amount_paid && Number(rzpOrder.amount_paid) >= Number(rzpOrder.amount))) {
      // Fetch payments for the order to get the first successful payment ID
      const payments = await razorpay.orders.fetchPayments(order.razorpay_order_id);
      const paymentId = payments.items?.find((p: any) => p.status === "captured")?.id || payments.items?.[0]?.id || null;

      if (type === "sample") {
        const updated = await prisma.sampleOrder.update({
          where: { id: order.id },
          data: {
            payment_status: "paid",
            order_status: "confirmed",
            razorpay_payment_id: paymentId,
          },
          include: {
            product: { select: { name: true, images: { where: { is_primary: true }, take: 1 } } },
            variant: { select: { size: true, unit: true } },
          }
        });
        try {
          const { sendOrderNotificationEmail } = await import("./email-service");
          await sendOrderNotificationEmail(order.id, "sample");
        } catch (err) {
          console.error("[syncRazorpay] Error sending sample order notification email:", err);
        }
        return updated;
      } else {
        const invoiceNumber = order.invoice_number || `INV-${Date.now()}`;
        const updated = await prisma.bulkOrder.update({
          where: { id: order.id },
          data: {
            payment_status: "paid",
            order_status: "confirmed",
            razorpay_payment_id: paymentId,
            invoice_number: invoiceNumber,
          },
          include: {
            user: { select: { full_name: true, email: true, phone: true, company_name: true, gstin: true, company_address: true } },
            address: true,
            items: true,
          }
        });

        // Ensure Invoice record doesn't exist already to avoid unique constraint violations
        const existingInvoice = await prisma.invoice.findUnique({
          where: { bulk_order_id: order.id }
        });

        if (!existingInvoice) {
          const buyerAddress = updated.user.company_address || 
            `${updated.address.address_line1}${updated.address.address_line2 ? `, ${updated.address.address_line2}` : ""}, ${updated.address.city}, ${updated.address.state} - ${updated.address.pincode}`;

          await prisma.invoice.create({
            data: {
              invoice_number: invoiceNumber,
              bulk_order_id: order.id,
              user_id: updated.user_id,
              buyer_name: updated.user.full_name || "Walk-in Customer",
              buyer_company: updated.user.company_name || "",
              buyer_gstin: updated.user.gstin || "",
              buyer_address: buyerAddress,
              seller_name: "Hamada Global Trading",
              seller_gstin: "06AAGCH4681R1ZV",
              seller_address: "B1, HOUSE NO 2 P, SECTOR 31, Gurugram 122001, Haryana, India",
              subtotal: updated.subtotal,
              cgst_amount: updated.cgst_amount,
              sgst_amount: updated.sgst_amount,
              igst_amount: updated.igst_amount,
              total_amount: updated.total_amount,
              invoice_date: new Date(),
            }
          });
        }

        try {
          const { sendOrderNotificationEmail } = await import("./email-service");
          await sendOrderNotificationEmail(order.id, "bulk");
        } catch (err) {
          console.error("[syncRazorpay] Error sending bulk order notification email:", err);
        }
        return updated;
      }
    }
  } catch (error) {
    console.error(`Failed to auto-sync Razorpay status for ${type} order ${order.id}:`, error);
  }

  return order;
}

