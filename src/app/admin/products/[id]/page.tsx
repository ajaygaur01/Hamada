import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { redirect, notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerAuthUser();
  if (!user || user.role !== "admin") redirect("/");

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { display_order: "asc" } },
        variants: { orderBy: { size: "asc" } },
      },
    }),
    prisma.category.findMany({
      orderBy: { display_order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) return notFound();

  // Convert Decimals to numbers for client component
  const productData = {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      sample_price: Number(v.sample_price),
      bulk_price: Number(v.bulk_price),
    })),
  };

  return <ProductForm initialData={productData} categories={categories} isEdit={true} />;
}
