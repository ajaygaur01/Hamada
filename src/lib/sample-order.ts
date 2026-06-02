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
