import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isSampleSize } from "@/lib/sample-order";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const variantId = url.searchParams.get("variantId");
    const productSlug = url.searchParams.get("productSlug");

    if (!variantId || !productSlug) {
      return NextResponse.json({ error: "Missing product or variant." }, { status: 400 });
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        id: true,
        size: true,
        sample_price: true,
        is_active: true,
        product: {
          select: {
            slug: true,
            name: true,
            is_active: true,
          },
        },
      },
    });

    if (!variant || !variant.is_active || !variant.product.is_active) {
      return NextResponse.json({ error: "Invalid product variant selected." }, { status: 400 });
    }

    if (variant.product.slug !== productSlug || !isSampleSize(variant.size)) {
      return NextResponse.json({ error: "Invalid sample variant for selected product." }, { status: 400 });
    }

    const amount = Number(variant.sample_price.toNumber().toFixed(2));
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid sample amount." }, { status: 400 });
    }

    return NextResponse.json({
      productName: variant.product.name,
      variantSize: variant.size,
      payableAmount: amount,
      payableAmountInPaise: Math.round(amount * 100),
    });
  } catch {
    return NextResponse.json({ error: "Failed to calculate quote." }, { status: 500 });
  }
}
