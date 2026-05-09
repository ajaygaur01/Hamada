import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuthUser } from "@/lib/auth/server-session";

async function requireAdmin() {
  const user = await getServerAuthUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, full_name: true, phone: true, role: true,
        gstin: true, gstin_verified: true, company_name: true, company_address: true,
        created_at: true,
        bulk_orders: {
          orderBy: { created_at: "desc" },
          include: {
            items: { select: { product_name: true, variant_size: true, quantity: true, total_price: true } },
          },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Also get sample orders by email
    const sampleOrders = await prisma.sampleOrder.findMany({
      where: { email: user.email },
      orderBy: { created_at: "desc" },
      select: {
        id: true, order_number: true, customer_name: true, amount: true,
        payment_status: true, order_status: true, created_at: true,
        product: { select: { name: true } },
        variant: { select: { size: true } },
      },
    });

    return NextResponse.json({
      user: {
        ...user,
        createdAt: user.created_at.toISOString(),
        bulkOrders: user.bulk_orders.map(o => ({
          ...o, total_amount: Number(o.total_amount), subtotal: Number(o.subtotal),
          items: o.items.map(i => ({ ...i, total_price: Number(i.total_price) })),
        })),
        sampleOrders: sampleOrders.map(o => ({ ...o, amount: Number(o.amount) })),
      },
    });
  } catch (error) {
    console.error("Admin user detail error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
