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
        select: { size: true, unit: true, sample_price: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const bulkOrders = await prisma.bulkOrder.findMany({
    where: { user_id: user.id },
    include: {
      address: true,
      user: {
        select: {
          full_name: true,
          email: true,
          phone: true,
          company_name: true,
          company_address: true,
          gstin: true,
        },
      },
      items: {
        select: {
          product_name: true,
          variant_size: true,
          quantity: true,
          unit_price: true,
          total_price: true,
          hsn_code: true,
          gst_rate: true,
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
      variantSize: `${order.variant.size} ${order.variant.unit}`,
      amount: Number(order.amount),
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      createdAt: order.created_at,
      customerName: order.customer_name,
      businessName: order.business_name,
      email: order.email,
      phone: order.phone,
      addressLine1: order.address_line1,
      addressLine2: order.address_line2,
      landmark: order.landmark,
      deliveryCity: order.delivery_city,
      deliveryState: order.delivery_state,
      pincode: order.pincode,
      country: order.country,
      variantPrice: Number(order.variant.sample_price),
    })),
    bulkOrders: syncedBulkOrders.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount),
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      createdAt: order.created_at,
      subtotal: Number(order.subtotal),
      cgstAmount: Number(order.cgst_amount),
      sgstAmount: Number(order.sgst_amount),
      igstAmount: Number(order.igst_amount),
      invoiceNumber: order.invoice_number,
      notes: order.notes,
      address: order.address,
      user: {
        fullName: order.user.full_name,
        email: order.user.email,
        phone: order.user.phone,
        companyName: order.user.company_name,
        companyAddress: order.user.company_address,
        gstin: order.user.gstin,
      },
      items: order.items.map((item: any) => ({
        productName: item.product_name,
        variantSize: item.variant_size,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        totalPrice: Number(item.total_price),
        hsnCode: item.hsn_code,
        gstRate: Number(item.gst_rate),
      })),
    })),
  });
}
