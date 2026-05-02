import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/auth/server-session";
import prisma from "@/lib/prisma";
import BulkOrderCartClient from './BulkOrderCartClient';

export default async function BulkOrderCartPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/?auth=login&redirect=/bulk-order/cart");
  }

  if (!user.gstin_verified) {
    redirect("/bulk-order/verify-gstin");
  }

  // Fetch products with their variants
  const products = await prisma.product.findMany({
    where: { is_active: true },
    include: {
      variants: {
        where: { is_active: true },
      },
      images: {
        where: { is_primary: true },
        take: 1,
      },
    },
  });

  // Filter out products that don't have bulk variants
  const productsWithBulkVariants = products.filter(
    (p) => p.variants.some((v) => ["100g", "500g", "1kg"].includes(v.size))
  ).map((p) => ({
    id: p.id,
    name: p.name,
    image: p.images[0]?.image_url || "/placeholder-tea.jpg",
    variants: p.variants
      .filter((v) => ["100g", "500g", "1kg"].includes(v.size))
      .map((v) => ({
        id: v.id,
        size: v.size,
        bulk_price: Number(v.bulk_price),
      })),
  }));

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { gstin: true, company_name: true, company_address: true }
  });

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Bulk Order Cart</h1>
          <p className="text-zinc-600 mt-2">
            Verified Business: <strong>{dbUser?.company_name}</strong> (GSTIN: {dbUser?.gstin})
          </p>
        </div>

        <BulkOrderCartClient
          products={productsWithBulkVariants}
          companyAddress={dbUser?.company_address || ""}
        />
      </div>
    </div>
  );
}
