import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthUser } from "@/lib/auth/require-user";

export async function GET() {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: { user_id: user.id },
      include: {
        bulk_order: {
          select: { order_number: true }
        }
      },
      orderBy: { invoice_date: 'desc' }
    });

    return NextResponse.json({
      invoices: invoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        orderNumber: inv.bulk_order.order_number,
        date: inv.invoice_date.toISOString(),
        amount: Number(inv.total_amount),
        pdfUrl: inv.pdf_url
      }))
    });
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
