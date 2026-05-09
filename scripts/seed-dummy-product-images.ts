import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function buildDummyImageUrl(productSlug: string, index: number): string {
  const seed = `${productSlug}-${index + 1}`;
  // Deterministic placeholder image per product + index
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/800`;
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true },
    orderBy: { created_at: "asc" },
  });

  if (products.length === 0) {
    console.log("No products found. Nothing to update.");
    return;
  }

  for (const product of products) {
    await prisma.productImage.deleteMany({
      where: { product_id: product.id },
    });

    await prisma.productImage.createMany({
      data: Array.from({ length: 3 }, (_, index) => ({
        product_id: product.id,
        image_url: buildDummyImageUrl(product.slug, index),
        alt_text: `${product.name} dummy image ${index + 1}`,
        display_order: index + 1,
        is_primary: index === 0,
      })),
    });
  }

  console.log(
    `Added 3 dummy images each for ${products.length} products (${products.length * 3} images total).`
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed dummy product images:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
