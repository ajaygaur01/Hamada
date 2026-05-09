import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuthUser } from "@/lib/auth/server-session";

async function requireAdmin() {
  const user = await getServerAuthUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const [
      totalProducts,
      totalUsers,
      totalSampleOrders,
      totalBulkOrders,
      sampleRevenue,
      bulkRevenue,
      recentSampleOrders,
      recentBulkOrders,
    ] = await Promise.all([
      prisma.product.count({ where: { is_active: true } }),
      prisma.user.count(),
      prisma.sampleOrder.count(),
      prisma.bulkOrder.count(),
      prisma.sampleOrder.aggregate({ _sum: { amount: true }, where: { payment_status: "paid" } }),
      prisma.bulkOrder.aggregate({ _sum: { total_amount: true }, where: { payment_status: "paid" } }),
      prisma.sampleOrder.findMany({
        orderBy: { created_at: "desc" },
        take: 5,
        select: {
          id: true, order_number: true, customer_name: true, email: true,
          amount: true, payment_status: true, order_status: true, created_at: true,
          product: { select: { name: true } },
        },
      }),
      prisma.bulkOrder.findMany({
        orderBy: { created_at: "desc" },
        take: 5,
        include: {
          user: { select: { full_name: true, email: true } },
          items: { select: { product_name: true, quantity: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalSampleOrders,
      totalBulkOrders,
      totalRevenue: Number(sampleRevenue._sum.amount || 0) + Number(bulkRevenue._sum.total_amount || 0),
      recentSampleOrders: recentSampleOrders.map(o => ({
        ...o, amount: Number(o.amount), type: "sample" as const,
      })),
      recentBulkOrders: recentBulkOrders.map(o => ({
        ...o,
        total_amount: Number(o.total_amount),
        subtotal: Number(o.subtotal),
        type: "bulk" as const,
      })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
