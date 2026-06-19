import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ duplicateId?: string }>;

export default async function NewProductPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams;
  const user = await getServerAuthUser();
  if (!user || user.role !== "admin") redirect("/");

  const [categories, duplicateData] = await Promise.all([
    prisma.category.findMany({
      orderBy: { display_order: "asc" },
      select: { id: true, name: true },
    }),
    resolvedParams.duplicateId ? prisma.product.findUnique({
      where: { id: resolvedParams.duplicateId },
      include: {
        images: { orderBy: { display_order: "asc" } },
        variants: { orderBy: { size: "asc" } },
      },
    }) : Promise.resolve(null),
  ]);

  const initialData = duplicateData ? {
    ...duplicateData,
    id: undefined, // Clear ID for new product
    name: `${duplicateData.name} (Copy)`,
    slug: `${duplicateData.slug}-copy`,
    variants: duplicateData.variants.map(v => ({ ...v, id: undefined })),
    images: duplicateData.images.map(img => ({ ...img, id: undefined })),
  } : undefined;

  return <ProductForm categories={categories} initialData={initialData} isEdit={false} />;
}
