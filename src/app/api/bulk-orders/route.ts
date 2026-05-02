import { NextResponse } from "next/server";
import { getServerAuthUser } from "@/lib/auth/server-session";
import prisma from "@/lib/prisma";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const user = await getServerAuthUser();
    if (!user || !user.gstin_verified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart, address } = await request.json();
    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Recalculate totals on server
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of cart) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });

      if (!variant) continue;

      const price = Number(variant.bulk_price);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        product_id: variant.product_id,
        variant_id: variant.id,
        product_name: variant.product.name,
        variant_size: variant.size,
        quantity: item.quantity,
        unit_price: price,
        total_price: itemTotal,
        hsn_code: "0902", // standard for tea
        gst_rate: 5.0,
      });
    }

    const gstAmount = subtotal * 0.05;
    const totalAmount = subtotal + gstAmount;

    // Create Razorpay Order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockkey",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "mocksecret",
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save initial order in DB
    // Need to find or create Address first
    let dbAddress = await prisma.address.findFirst({
      where: { user_id: user.id, address_line1: address }
    });

    if (!dbAddress) {
      dbAddress = await prisma.address.create({
        data: {
          user_id: user.id,
          full_name: user.username || "User",
          phone: user.phone || "0000000000",
          address_line1: address,
          city: "Unknown", // Assuming full address parsing later
          state: "Unknown",
          pincode: "000000",
        }
      });
    }

    const orderNumber = `BLK-${Date.now()}`;

    const order = await prisma.bulkOrder.create({
      data: {
        order_number: orderNumber,
        user_id: user.id,
        address_id: dbAddress.id,
        subtotal: subtotal,
        cgst_amount: gstAmount / 2, // simple split for mock
        sgst_amount: gstAmount / 2,
        igst_amount: 0,
        total_amount: totalAmount,
        payment_method: "razorpay",
        razorpay_order_id: rzpOrder.id,
        payment_status: "pending",
        order_status: "pending",
        items: {
          create: orderItemsData,
        }
      }
    });

    return NextResponse.json({
      success: true,
      amount: rzpOrder.amount,
      razorpayOrderId: rzpOrder.id,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Bulk Order Create Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
