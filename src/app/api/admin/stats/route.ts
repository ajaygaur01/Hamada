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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalProducts,
      totalUsers,
      totalSampleOrders,
      totalBulkOrders,
      sampleRevenue,
      bulkRevenue,
      sampleRevenueToday,
      bulkRevenueToday,
      sampleRevenueWeek,
      bulkRevenueWeek,
      sampleRevenueMonth,
      bulkRevenueMonth,
      newUsersToday,
      newUsersMonth,
      pendingOrders,
      recentSampleOrders,
      recentBulkOrders,
      lowStockVariants,
      topProducts,
      // Revenue last 30 days - grouped
      sampleOrdersLast30,
      bulkOrdersLast30,
    ] = await Promise.all([
      prisma.product.count({ where: { is_active: true } }),
      prisma.user.count(),
      prisma.sampleOrder.count(),
      prisma.bulkOrder.count(),
      prisma.sampleOrder.aggregate({ _sum: { amount: true }, where: { payment_status: "paid" } }),
      prisma.bulkOrder.aggregate({ _sum: { total_amount: true }, where: { payment_status: "paid" } }),
      // Today
      prisma.sampleOrder.aggregate({ _sum: { amount: true }, where: { payment_status: "paid", created_at: { gte: todayStart } } }),
      prisma.bulkOrder.aggregate({ _sum: { total_amount: true }, where: { payment_status: "paid", created_at: { gte: todayStart } } }),
      // Week
      prisma.sampleOrder.aggregate({ _sum: { amount: true }, where: { payment_status: "paid", created_at: { gte: weekStart } } }),
      prisma.bulkOrder.aggregate({ _sum: { total_amount: true }, where: { payment_status: "paid", created_at: { gte: weekStart } } }),
      // Month
      prisma.sampleOrder.aggregate({ _sum: { amount: true }, where: { payment_status: "paid", created_at: { gte: monthStart } } }),
      prisma.bulkOrder.aggregate({ _sum: { total_amount: true }, where: { payment_status: "paid", created_at: { gte: monthStart } } }),
      // Users
      prisma.user.count({ where: { created_at: { gte: todayStart } } }),
      prisma.user.count({ where: { created_at: { gte: monthStart } } }),
      // Pending
      prisma.sampleOrder.count({ where: { order_status: "pending" } }),
      // Recent orders
      prisma.sampleOrder.findMany({
        orderBy: { created_at: "desc" }, take: 5,
        select: {
          id: true, order_number: true, customer_name: true, email: true,
          amount: true, payment_status: true, order_status: true, created_at: true,
          product: { select: { name: true, images: { where: { is_primary: true }, take: 1, select: { image_url: true } } } },
        },
      }),
      prisma.bulkOrder.findMany({
        orderBy: { created_at: "desc" }, take: 5,
        include: {
          user: { select: { full_name: true, email: true } },
          items: { select: { product_name: true, quantity: true } },
        },
      }),
      // Low stock
      prisma.productVariant.findMany({
        where: { is_active: true, stock_quantity: { lt: 10 } },
        include: { product: { select: { name: true } } },
        orderBy: { stock_quantity: "asc" },
        take: 10,
      }),
      // Top products by order count
      prisma.product.findMany({
        where: { is_active: true },
        select: {
          id: true, name: true,
          images: { where: { is_primary: true }, take: 1, select: { image_url: true } },
          _count: { select: { sample_orders: true, bulk_order_items: true } },
        },
        orderBy: { sample_orders: { _count: "desc" } },
        take: 5,
      }),
      // Last 30 days orders for chart
      prisma.sampleOrder.findMany({
        where: { created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, payment_status: "paid" },
        select: { created_at: true, amount: true },
      }),
      prisma.bulkOrder.findMany({
        where: { created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, payment_status: "paid" },
        select: { created_at: true, total_amount: true },
      }),
    ]);

    // Build daily revenue chart data (last 30 days)
    const revenueMap: Record<string, number> = {};
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    for (const o of sampleOrdersLast30) {
      const key = fmt(o.created_at); revenueMap[key] = (revenueMap[key] || 0) + Number(o.amount);
    }
    for (const o of bulkOrdersLast30) {
      const key = fmt(o.created_at); revenueMap[key] = (revenueMap[key] || 0) + Number(o.total_amount);
    }
    const revenueChart = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      const key = fmt(d);
      return { date: key, label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), revenue: revenueMap[key] || 0 };
    });

    return NextResponse.json({
      totalProducts, totalUsers, totalSampleOrders, totalBulkOrders,
      totalRevenue: Number(sampleRevenue._sum.amount || 0) + Number(bulkRevenue._sum.total_amount || 0),
      revenueToday: Number(sampleRevenueToday._sum.amount || 0) + Number(bulkRevenueToday._sum.total_amount || 0),
      revenueWeek: Number(sampleRevenueWeek._sum.amount || 0) + Number(bulkRevenueWeek._sum.total_amount || 0),
      revenueMonth: Number(sampleRevenueMonth._sum.amount || 0) + Number(bulkRevenueMonth._sum.total_amount || 0),
      newUsersToday, newUsersMonth, pendingOrders,
      recentSampleOrders: recentSampleOrders.map(o => ({ ...o, amount: Number(o.amount), type: "sample" as const })),
      recentBulkOrders: recentBulkOrders.map(o => ({ ...o, total_amount: Number(o.total_amount), subtotal: Number(o.subtotal), type: "bulk" as const })),
      lowStockVariants: lowStockVariants.map(v => ({ id: v.id, productName: v.product.name, size: v.size, stock: v.stock_quantity })),
      topProducts: topProducts.map(p => ({
        id: p.id, name: p.name,
        imageUrl: p.images[0]?.image_url || null,
        orders: p._count.sample_orders + p._count.bulk_order_items,
      })),
      revenueChart,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
