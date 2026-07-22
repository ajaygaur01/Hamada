import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { syncRazorpayPaymentIfNeeded } from "@/lib/sample-order";

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
      if (order) {
        const syncedOrder = await syncRazorpayPaymentIfNeeded(order, "sample");
        return NextResponse.json({ ...syncedOrder, type: "sample", amount: Number(syncedOrder.amount) });
      }
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
      if (order) {
        const syncedOrder = await syncRazorpayPaymentIfNeeded(order, "bulk");
        return NextResponse.json({ 
          ...syncedOrder, 
          type: "bulk", 
          total_amount: Number(syncedOrder.total_amount),
          subtotal: Number(syncedOrder.subtotal),
          cgst_amount: Number(syncedOrder.cgst_amount),
          sgst_amount: Number(syncedOrder.sgst_amount),
          igst_amount: Number(syncedOrder.igst_amount),
          items: syncedOrder.items.map((i: any) => ({ ...i, unit_price: Number(i.unit_price), total_price: Number(i.total_price) }))
        });
      }
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

    if (sample) {
      const syncedSample = await syncRazorpayPaymentIfNeeded(sample, "sample");
      return NextResponse.json({ ...syncedSample, type: "sample", amount: Number(syncedSample.amount) });
    }
    if (bulk) {
      const syncedBulk = await syncRazorpayPaymentIfNeeded(bulk, "bulk");
      return NextResponse.json({ 
        ...syncedBulk, 
        type: "bulk", 
        total_amount: Number(syncedBulk.total_amount),
        subtotal: Number(syncedBulk.subtotal),
        cgst_amount: Number(syncedBulk.cgst_amount),
        sgst_amount: Number(syncedBulk.sgst_amount),
        igst_amount: Number(syncedBulk.igst_amount),
        items: syncedBulk.items.map((i: any) => ({ ...i, unit_price: Number(i.unit_price), total_price: Number(i.total_price) }))
      });
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Order detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
