import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import {
  generateSampleOrderNumber,
  isSampleSize,
  sanitizeSampleOrderInput,
  validateSampleOrderInput,
  type SampleOrderInput,
} from "@/lib/sample-order";

type VariantWithProduct = {
  id: string;
  size: string;
  sample_price: { toNumber: () => number };
  product: {
    id: string;
    slug: string;
    name: string;
  };
};

async function getValidatedVariant(input: ReturnType<typeof sanitizeSampleOrderInput>) {
  const variant = (await prisma.productVariant.findUnique({
    where: { id: input.variantId },
    select: {
      id: true,
      size: true,
      sample_price: true,
      is_active: true,
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          is_active: true,
        },
      },
    },
  })) as (VariantWithProduct & { is_active: boolean; product: VariantWithProduct["product"] & { is_active: boolean } }) | null;

  if (!variant || !variant.is_active || !variant.product.is_active) return null;
  if (input.productSlug && variant.product.slug !== input.productSlug) return null;
  if (!isSampleSize(variant.size)) return null;

  return variant;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SampleOrderInput;
    const validationError = validateSampleOrderInput(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const input = sanitizeSampleOrderInput(payload);
    const variant = await getValidatedVariant(input);
    if (!variant) {
      return NextResponse.json({ error: "Invalid product variant selected." }, { status: 400 });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: "Online payment is not configured yet. Please contact support." },
        { status: 500 }
      );
    }

    const amount = Number(variant.sample_price.toNumber().toFixed(2));
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid sample amount for this variant." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const amountInPaise = Math.round(amount * 100);
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: generateSampleOrderNumber(),
      notes: {
        variantId: variant.id,
        productId: variant.product.id,
      },
    });

    const createdOrder = await prisma.sampleOrder.create({
      // The schema currently has city + pincode fields; save full address detail in notes.
      data: {
        order_number: generateSampleOrderNumber(),
        customer_name: input.customerName,
        business_name: input.businessName,
        email: input.email,
        phone: input.phone,
        delivery_city: input.deliveryCity,
        pincode: input.pincode,
        product_id: variant.product.id,
        variant_id: variant.id,
        sample_size: variant.size,
        amount,
        payment_method: "razorpay",
        razorpay_order_id: razorpayOrder.id,
        payment_status: "pending",
        order_status: "pending",
        notes: [
          input.businessName ? `Business: ${input.businessName}` : null,
          `Address Line 1: ${input.addressLine1}`,
          input.addressLine2 ? `Address Line 2: ${input.addressLine2}` : null,
          input.landmark ? `Landmark: ${input.landmark}` : null,
          `City: ${input.deliveryCity}`,
          `State: ${input.deliveryState}`,
          `Country: ${input.country}`,
          `Pincode: ${input.pincode}`,
          input.additionalNote ? `Customer Note: ${input.additionalNote}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      sampleOrderId: createdOrder.id,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId,
      amountInPaise,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create payment order." }, { status: 500 });
  }
}
