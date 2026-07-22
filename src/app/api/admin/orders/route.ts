import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { syncRazorpayPaymentIfNeeded } from "@/lib/sample-order";

async function requireAdmin() {
  const user = await getServerAuthUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const type = req.nextUrl.searchParams.get("type") || "all";
  const search = req.nextUrl.searchParams.get("search") || "";

  try {
    let sampleOrders: any[] = [];
    let bulkOrders: any[] = [];

    if (type === "all" || type === "sample") {
      const where = search
        ? {
            OR: [
              { order_number: { contains: search, mode: "insensitive" as const } },
              { customer_name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : undefined;

      const raw = await prisma.sampleOrder.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: 100,
        select: {
          id: true, order_number: true, customer_name: true, business_name: true,
          email: true, phone: true, delivery_city: true, pincode: true,
          sample_size: true, amount: true, payment_method: true,
          payment_status: true, order_status: true, tracking_link: true,
          notes: true, created_at: true, razorpay_order_id: true, razorpay_payment_id: true,
          product: { select: { name: true } },
          variant: { select: { size: true } },
        },
      });

      const syncedRaw = await Promise.all(
        raw.map((o) => syncRazorpayPaymentIfNeeded(o, "sample"))
      );

      sampleOrders = syncedRaw.map(o => ({ ...o, amount: Number(o.amount), type: "sample" }));
    }

    if (type === "all" || type === "bulk") {
      const where = search
        ? {
            OR: [
              { order_number: { contains: search, mode: "insensitive" as const } },
              { user: { full_name: { contains: search, mode: "insensitive" as const } } },
              { user: { email: { contains: search, mode: "insensitive" as const } } },
            ],
          }
        : undefined;

      const raw = await prisma.bulkOrder.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: 100,
        include: {
          user: { select: { full_name: true, email: true, phone: true, company_name: true } },
          items: { select: { product_name: true, variant_size: true, quantity: true, unit_price: true, total_price: true } },
        },
      });

      const syncedRaw = await Promise.all(
        raw.map((o) => syncRazorpayPaymentIfNeeded(o, "bulk"))
      );

      bulkOrders = syncedRaw.map(o => ({
        ...o,
        total_amount: Number(o.total_amount),
        subtotal: Number(o.subtotal),
        items: o.items.map((i: any) => ({ ...i, unit_price: Number(i.unit_price), total_price: Number(i.total_price) })),
        type: "bulk",
      }));
    }

    return NextResponse.json({ sampleOrders, bulkOrders });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, type, orderStatus, trackingLink, paymentStatus, notes } = body;

    if (!id || !type) return NextResponse.json({ error: "Order ID and type required" }, { status: 400 });

    if (type === "sample") {
      await prisma.sampleOrder.update({
        where: { id },
        data: {
          ...(orderStatus && { order_status: orderStatus }),
          ...(paymentStatus && { payment_status: paymentStatus }),
          ...(trackingLink !== undefined && { tracking_link: trackingLink }),
          ...(notes !== undefined && { notes }),
          ...(orderStatus === "dispatched" && { dispatched_at: new Date() }),
        },
      });
    } else {
      await prisma.bulkOrder.update({
        where: { id },
        data: {
          ...(orderStatus && { order_status: orderStatus }),
          ...(paymentStatus && { payment_status: paymentStatus }),
          ...(trackingLink !== undefined && { tracking_link: trackingLink }),
          ...(notes !== undefined && { notes }),
          ...(orderStatus === "dispatched" && { dispatched_at: new Date() }),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
