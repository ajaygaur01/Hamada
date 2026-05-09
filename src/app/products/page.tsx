import { PrismaClient } from "@prisma/client";
import PageHeader from "@/components/products/PageHeader";
import CTASection from "@/components/products/CTASection";
import ProductGrid from "@/components/products/ProductGrid";

const prisma = new PrismaClient();

export default async function ProductsPage() {
  // Fetch data from database
  const categoriesDb = await prisma.category.findMany({
    orderBy: { display_order: 'asc' },
  });

  const productsDb = await prisma.product.findMany({
    where: { is_active: true },
    include: {
      category: true,
      variants: {
        where: { is_active: true },
        orderBy: { sample_price: 'asc' },
        take: 1
      },
      images: {
        where: { is_primary: true },
        take: 1,
      },
      reviews: {
        select: { rating: true },
      },
    },
    orderBy: { created_at: 'asc' },
  });

  // Map to the shape expected by the client component
  const categories = categoriesDb.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const products = productsDb.map((p) => {
    const derivedTag = p.name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      categoryName: derivedTag || "TEA",
      useCases: p.use_cases || [],
      categoryId: p.category_id,
      imageUrl: p.images[0]?.image_url || null,
      reviewCount: p.reviews.length,
      startingPrice: p.variants.length > 0 ? Number(p.variants[0].sample_price) : undefined,
      averageRating: p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0,
    };
  });

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader />
      <ProductGrid products={products} categories={categories} />
      <CTASection />
    </div>
  );
}
