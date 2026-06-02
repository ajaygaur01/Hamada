import { PrismaClient } from "@prisma/client";
import {
  CATEGORIES,
  HAMADA_CATALOG,
  type CatalogProduct,
  type CatalogVariant,
} from "../data/hamada-catalog";
function parseSizeGrams(size: string): number {
  const s = size.trim().toLowerCase();
  const kgMatch = s.match(/^(\d+(?:\.\d+)?)\s*kg$/);
  if (kgMatch) return Math.round(parseFloat(kgMatch[1]) * 1000);
  const gMatch = s.match(/^(\d+(?:\.\d+)?)\s*g$/);
  if (gMatch) return Math.round(parseFloat(gMatch[1]));
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : 0;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function stockImageUrl(slug: string, index: number): string {
  const labels = ["Hero", "Detail", "Lifestyle"];
  const label = labels[index] ?? String(index + 1);
  return `https://placehold.co/800x1000/f5f0e8/4C632E/jpg?text=${encodeURIComponent(`${slug.slice(0, 20)}+${label}`)}`;
}

function toDbVariant(v: CatalogVariant) {
  const grams = parseSizeGrams(v.size);
  const isBulk = grams >= 100;
  return {
    size: v.size,
    unit: "grams",
    sample_price: v.price,
    bulk_price: v.price,
    stock_quantity: v.stock_quantity ?? (isBulk ? 60 : 120),
    min_bulk_quantity: v.min_bulk_quantity ?? (isBulk ? 2 : 5),
    is_active: true,
  };
}

/** Remove all product-related rows (keeps users, orders are cleared). */
export async function clearProductCatalog(prisma: PrismaClient) {
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.bulkOrderItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.bulkOrder.deleteMany();
  await prisma.sampleOrder.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
}

export type SeedCatalogOptions = {
  /** Replace placeholder image URLs (default: true) */
  withImages?: boolean;
  /** Products to seed (default: full HAMADA_CATALOG) */
  products?: CatalogProduct[];
};

export type SeedCatalogResult = {
  categories: number;
  products: { id: string; slug: string; name: string }[];
};

/** Upsert categories and insert catalog products + variants. */
export async function seedProductCatalog(
  prisma: PrismaClient,
  options: SeedCatalogOptions = {}
): Promise<SeedCatalogResult> {
  const products = options.products ?? HAMADA_CATALOG;
  const withImages = options.withImages !== false;

  const categoryByKey = new Map<string, string>();

  for (const cat of CATEGORIES) {
    const row = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        display_order: cat.display_order,
      },
    });
    categoryByKey.set(cat.key, row.id);
  }

  const created: SeedCatalogResult["products"] = [];

  for (const p of products) {
    const slug = p.slug ?? slugify(p.name);
    const categoryId = categoryByKey.get(p.category);
    if (!categoryId) {
      throw new Error(`Unknown category key: ${p.category}`);
    }

    const product = await prisma.product.create({
      data: {
        category_id: categoryId,
        name: p.name,
        slug,
        grade: p.grade ?? null,
        short_description: p.short_description,
        full_description: p.full_description,
        use_cases: p.use_cases,
        origin: "Kagoshima, Japan",
        shelf_life: "18–24 months from packing",
        storage_instructions:
          "Cool, dry place; refrigerate after opening if advised on pack.",
        is_active: true,
        is_featured: p.featured ?? false,
        variants: {
          create: p.variants.map(toDbVariant),
        },
        ...(withImages
          ? {
              images: {
                create: [0, 1, 2].map((i) => ({
                  image_url: stockImageUrl(slug, i),
                  alt_text: `${p.name} — image ${i + 1}`,
                  display_order: i,
                  is_primary: i === 0,
                })),
              },
            }
          : {}),
      },
    });

    created.push({ id: product.id, slug, name: p.name });
  }

  return { categories: CATEGORIES.length, products: created };
}
