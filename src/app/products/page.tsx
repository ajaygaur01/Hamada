import prisma from "@/lib/prisma";
import PageHeader from "@/components/products/PageHeader";
import CTASection from "@/components/products/CTASection";
import ProductGrid from "@/components/products/ProductGrid";
import ProductInfoTabs from "@/components/products/ProductInfoTabs";
import { pickHeroImageUrl, productCardImageInclude } from "@/lib/product-images";

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
      },
      images: {
        ...productCardImageInclude,
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
      description: p.short_description,
      categoryName: derivedTag || "TEA",
      categorySlug: p.category.slug,
      useCases: p.use_cases || [],
      categoryId: p.category_id,
      imageUrl: pickHeroImageUrl(p.images),
      reviewCount: p.reviews.length,
      startingPrice: p.variants.length > 0 ? Number(p.variants[0].sample_price) : undefined,
      averageRating: p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0,
      variants: p.variants.map((v) => ({
        id: v.id,
        size: v.size,
        samplePrice: Number(v.sample_price),
        bulkPrice: Number(v.bulk_price),
      })),
    };
  });

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader />
      <ProductInfoTabs />
      <ProductGrid products={products} categories={categories} />
      <CTASection />
    </div>
  );
}
