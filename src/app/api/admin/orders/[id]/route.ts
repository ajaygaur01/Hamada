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
  const type = req.nextUrl.searchParams.get("type");

  try {
    if (type === "sample") {
      const order = await prisma.sampleOrder.findUnique({
        where: { id },
        include: {
          product: { select: { name: true, images: { where: { is_primary: true }, take: 1 } } },
          variant: { select: { size: true, unit: true } },
        },
      });
      if (order) return NextResponse.json({ ...order, type: "sample", amount: Number(order.amount) });
    }

    if (type === "bulk") {
      const order = await prisma.bulkOrder.findUnique({
        where: { id },
        include: {
          user: { select: { full_name: true, email: true, phone: true, company_name: true, gstin: true } },
          address: true,
          items: true,
        },
      });
      if (order) return NextResponse.json({ 
        ...order, 
        type: "bulk", 
        total_amount: Number(order.total_amount),
        subtotal: Number(order.subtotal),
        cgst_amount: Number(order.cgst_amount),
        sgst_amount: Number(order.sgst_amount),
        igst_amount: Number(order.igst_amount),
        items: order.items.map(i => ({ ...i, unit_price: Number(i.unit_price), total_price: Number(i.total_price) }))
      });
    }

    // If type not specified or not found with type, try both
    const [sample, bulk] = await Promise.all([
      prisma.sampleOrder.findUnique({
        where: { id },
        include: {
          product: { select: { name: true, images: { where: { is_primary: true }, take: 1 } } },
          variant: { select: { size: true, unit: true } },
        }
      }),
      prisma.bulkOrder.findUnique({
        where: { id },
        include: {
          user: { select: { full_name: true, email: true, phone: true, company_name: true, gstin: true } },
          address: true,
          items: true,
        }
      })
    ]);

    if (sample) return NextResponse.json({ ...sample, type: "sample", amount: Number(sample.amount) });
    if (bulk) return NextResponse.json({ 
      ...bulk, 
      type: "bulk", 
      total_amount: Number(bulk.total_amount),
      subtotal: Number(bulk.subtotal),
      cgst_amount: Number(bulk.cgst_amount),
      sgst_amount: Number(bulk.sgst_amount),
      igst_amount: Number(bulk.igst_amount),
      items: bulk.items.map(i => ({ ...i, unit_price: Number(i.unit_price), total_price: Number(i.total_price) }))
    });

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Order detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
