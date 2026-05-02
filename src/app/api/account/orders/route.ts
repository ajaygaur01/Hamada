import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthUser } from "@/lib/auth/require-user";

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
        select: { size: true },
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

  return NextResponse.json({
    sampleOrders: sampleOrders.map((order) => ({
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
    bulkOrders: bulkOrders.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount),
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      createdAt: order.created_at,
      items: order.items.map((item) => ({
        productName: item.product_name,
        variantSize: item.variant_size,
        quantity: item.quantity,
      })),
    })),
  });
}
