import crypto from "node:crypto";
import { isSampleSize as isSampleSizeByGrams } from "@/lib/tea-size";

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

export function generateSampleOrderNumber() {
  const timestampPart = Date.now().toString().slice(-8);
  const randomPart = crypto.randomInt(1000, 9999);
  return `SMP-${timestampPart}-${randomPart}`;
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
            user: { select: { full_name: true, email: true, phone: true, company_name: true, gstin: true } },
            address: true,
            items: true,
          }
        });
        return updated;
      }
    }
  } catch (error) {
    console.error(`Failed to auto-sync Razorpay status for ${type} order ${order.id}:`, error);
  }

  return order;
}

