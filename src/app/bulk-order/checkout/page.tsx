import { redirect, notFound } from "next/navigation";
import { getServerAuthUser } from "@/lib/auth/server-session";
import prisma from "@/lib/prisma";
import BulkOrderCheckoutClient from "./BulkOrderCheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Order Checkout | Kaori by Chiran",
};

type Props = {
  searchParams: Promise<{ variant?: string; qty?: string }>;
};

export default async function BulkOrderCheckoutPage({ searchParams }: Props) {
  const { variant: variantId, qty } = await searchParams;
  const quantity = Math.max(1, parseInt(qty || "1", 10));

  // Auth check
  const user = await getServerAuthUser();
  if (!user) {
    const returnUrl = variantId
      ? `/bulk-order/checkout?variant=${variantId}&qty=${quantity}`
      : "/bulk-order/checkout";
    redirect(`/?auth=login&redirect=${encodeURIComponent(returnUrl)}`);
  }

  // GST check — pass returnTo so user comes back to checkout after verifying
  if (!user.gstin_verified) {
    const returnTo = variantId
      ? `/bulk-order/checkout?variant=${variantId}&qty=${quantity}`
      : "/products";
    redirect(`/bulk-order/verify-gstin?returnTo=${encodeURIComponent(returnTo)}`);
  }

  // Validate variant
  if (!variantId) {
    redirect("/products");
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant || !variant.is_active) {
    notFound();
  }

  // Fetch full user details for company info
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      company_name: true,
      company_address: true,
      gstin: true,
    },
  });

  const minQty = variant.min_bulk_quantity || 1;
  const safeQuantity = Math.max(minQty, quantity);

  // Read Razorpay key server-side (works even without NEXT_PUBLIC_ prefix)
  const razorpayKeyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    "rzp_test_mockkey";

  return (
    <div className="bg-zinc-50 min-h-screen">
      <BulkOrderCheckoutClient
        variantId={variant.id}
        quantity={safeQuantity}
        productName={variant.product.name}
        variantSize={variant.size}
        bulkPrice={Number(variant.bulk_price)}
        companyName={dbUser?.company_name || ""}
        companyAddress={dbUser?.company_address || ""}
        gstin={dbUser?.gstin || ""}
        razorpayKeyId={razorpayKeyId}
        minQty={minQty}
      />
    </div>
  );
}
