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
    // Generate a simple category name prefix for the visual tag (e.g. "Premium Japanese Teas" -> "MATCHA" / "SENCHA")
    // Note: The wireframe just has "MATCHA", "SENCHA", "GYOKURO", "HOJICHA"
    // Since we don't have sub-categories, we'll try to extract the first word from the product name to act as the category tag.
    const derivedTag = p.name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      categoryName: derivedTag || "TEA",
      useCases: p.use_cases || [],
      categoryId: p.category_id,
      reviewCount: p.reviews.length,
      averageRating: p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0,
    };
  });

  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen">
      <PageHeader />
      <ProductGrid products={products} categories={categories} />
      <CTASection />
    </div>
  );
}
