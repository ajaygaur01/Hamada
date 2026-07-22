import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthUser } from "@/lib/auth/require-user";
import { syncRazorpayPaymentIfNeeded } from "@/lib/sample-order";

export async function GET() {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sampleOrders = await prisma.sampleOrder.findMany({
    where: {
      OR: [{ email: user.email }, ...(user.phone ? [{ phone: user.phone }] : [])],
    },
    include: {
      product: {
        select: { name: true, slug: true },
      },
      variant: {
        select: { size: true, unit: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const bulkOrders = await prisma.bulkOrder.findMany({
    where: { user_id: user.id },
    include: {
      items: {
        select: {
          product_name: true,
          variant_size: true,
          quantity: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  // Sync any pending Razorpay payments dynamically
  const syncedSampleOrders = await Promise.all(
    sampleOrders.map((order) => syncRazorpayPaymentIfNeeded(order, "sample"))
  );

  const syncedBulkOrders = await Promise.all(
    bulkOrders.map((order) => syncRazorpayPaymentIfNeeded(order, "bulk"))
  );

  return NextResponse.json({
    sampleOrders: syncedSampleOrders.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      productName: order.product.name,
      productSlug: order.product.slug,
      variantSize: order.variant.size,
      amount: Number(order.amount),
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      createdAt: order.created_at,
    })),
    bulkOrders: syncedBulkOrders.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount),
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      createdAt: order.created_at,
      items: order.items.map((item: any) => ({
        productName: item.product_name,
        variantSize: item.variant_size,
        quantity: item.quantity,
      })),
    })),
  });
}
