/**
 * Hamada product catalog — source of truth for DB seeding.
 * Prices (INR) and pack sizes match the wholesale price sheet.
 *
 * Edit this file, then run: npm run seed:catalog
 */

export type CatalogVariant = {
  /** e.g. "10g", "15g", "100g", "1kg" */
  size: string;
  /** Sample / retail price (INR) */
  price: number;
  stock_quantity?: number;
  min_bulk_quantity?: number;
};

export type CatalogProduct = {
  name: string;
  slug?: string;
  category: "premium" | "instant" | "sample-sets";
  grade?: string;
  short_description: string;
  full_description: string;
  use_cases: string[];
  featured?: boolean;
  variants: CatalogVariant[];
};

export const CATEGORIES = [
  {
    key: "sample-sets" as const,
    name: "Sample Sets",
    slug: "sample-sets",
    display_order: 0,
  },
  {
    key: "premium" as const,
    name: "Premium Japanese Teas",
    slug: "premium-japanese-teas",
    display_order: 1,
  },
  {
    key: "instant" as const,
    name: "Instant Teas and Ready Formats",
    slug: "instant-teas-and-ready-formats",
    display_order: 2,
  },
];

const DEFAULT_STOCK = {
  sample: 120,
  bulk: 60,
};

/** Build variants from a price sheet row (omit sizes with no price). */
export function rowVariants(
  row: {
    g10?: number;
    g15?: number;
    g20?: number;
    g100?: number;
    g250?: number;
    g500?: number;
    g1kg?: number;
  },
  stock = DEFAULT_STOCK
): CatalogVariant[] {
  const entries: { size: string; price: number; minBulk: number }[] = [];

  if (row.g10 != null) {
    entries.push({ size: "10g", price: row.g10, minBulk: 5 });
    entries.push({ size: "20g", price: row.g10 * 2, minBulk: 5 });
    entries.push({ size: "30g", price: row.g10 * 3, minBulk: 5 });
  }
  if (row.g15 != null) entries.push({ size: "15g", price: row.g15, minBulk: 5 });
  if (row.g100 != null) entries.push({ size: "100g", price: row.g100, minBulk: 3 });
  if (row.g250 != null) entries.push({ size: "250g", price: row.g250, minBulk: 2 });
  if (row.g500 != null) entries.push({ size: "500g", price: row.g500, minBulk: 2 });
  if (row.g1kg != null) entries.push({ size: "1kg", price: row.g1kg, minBulk: 1 });

  return entries.map(({ size, price, minBulk }) => {
    const grams = size.endsWith("kg")
      ? parseFloat(size) * 1000
      : parseInt(size, 10);
    const isBulk = grams >= 100;
    return {
      size,
      price,
      stock_quantity: isBulk ? stock.bulk : stock.sample,
      min_bulk_quantity: minBulk,
    };
  });
}

/** Homepage / discovery sample sets (priced per set). */
export const SAMPLE_SET_PRODUCTS: CatalogProduct[] = [
  {
    name: "Ceremonial Matcha Discovery Set",
    slug: "ceremonial-matcha-discovery-set",
    category: "sample-sets",
    grade: "Ceremonial",
    short_description:
      "Curated blends featuring ceremonial grade matcha — ideal for first-time tasting.",
    full_description:
      "A curated set of ceremonial grade matcha blends (10g and 20g formats) for menu R&D and side-by-side cupping before you commit to bulk.",
    use_cases: ["Cafe Menu", "Retail", "Hotel"],
    featured: true,
    variants: [
      { size: "10g", price: 500, stock_quantity: 80, min_bulk_quantity: 1 },
      { size: "20g", price: 1000, stock_quantity: 60, min_bulk_quantity: 1 },
    ],
  },
  {
    name: "Matcha & Hojicha Powder Sample Set",
    slug: "matcha-hojicha-powder-sample-set",
    category: "sample-sets",
    grade: "Mixed",
    short_description:
      "Multiple matcha grades plus dark roast hojicha powder in one set.",
    full_description:
      "Compare matcha grades alongside dark roast hojicha powder — built for teams evaluating powder lines for lattes, baking, and retail tins.",
    use_cases: ["Cafe Menu", "Bakery", "Retail"],
    featured: true,
    variants: [
      { size: "10g", price: 350, stock_quantity: 80, min_bulk_quantity: 1 },
      { size: "20g", price: 700, stock_quantity: 60, min_bulk_quantity: 1 },
    ],
  },
  {
    name: "Japanese Leaf Tea Sample Set (Genmaicha & Gyokuro)",
    slug: "japanese-leaf-tea-sample-set",
    category: "sample-sets",
    grade: "Premium",
    short_description: "Genmaicha and gyokuro leaf teas for loose-leaf service.",
    full_description:
      "A focused leaf-tea set featuring genmaicha and gyokuro — suited for hotels, restaurants, and retail loose-leaf programmes.",
    use_cases: ["Hotel", "Cafe Menu", "Retail"],
    featured: true,
    variants: [
      { size: "20g", price: 300, stock_quantity: 70, min_bulk_quantity: 1 },
      { size: "30g", price: 300, stock_quantity: 70, min_bulk_quantity: 1 },
    ],
  },
];

/** Main wholesale catalog — “After login product list”. */
export const WHOLESALE_PRODUCTS: CatalogProduct[] = [
  {
    name: "Ceremonial Matcha A",
    slug: "ceremonial-matcha-a",
    category: "premium",
    grade: "Ceremonial A",
    short_description:
      "Our finest grade matcha, from the first flush of shade-grown tencha leaves from Kagoshima.",
    full_description:
      "Our finest grade matcha, from the first flush of shade-grown tencha leaves from Kagoshima. Vivid green, intensely umami, with a natural sweetness and no bitterness.\n\nHarvest season: April–May. Non-organic.\nBlend: cultivars - Yutaka, Saemidori, asatsuyu.\nCeremonial grade: can consume with just hot water.",
    use_cases: ["Cafe Menu", "Hotel", "Retail"],
    featured: true,
    variants: rowVariants({
      g10: 170,
      g100: 1650,
      g250: 3900,
      g500: 7750,
      g1kg: 15491,
    }),
  },
  {
    name: "Ceremonial Matcha B",
    slug: "ceremonial-matcha-b",
    category: "premium",
    grade: "Ceremonial B",
    short_description:
      "A ceremonial grade matcha with a slightly bolder, deeper character.",
    full_description:
      "A ceremonial grade matcha with a slightly bolder, deeper character — still smooth, still vibrant, but with a fuller body that doesn't lose to sweeteners, flavours and milk. Ideal for cafes.\n\nHarvest season: July–August.\nNon-organic blend.\nCeremonial grade.",
    use_cases: ["Cafe Menu", "Hotel", "Retail"],
    featured: true,
    variants: rowVariants({
      g10: 120,
      g100: 1100,
      g250: 2100,
      g500: 5000,
      g1kg: 10000,
    }),
  },
  {
    name: "Culinary Matcha A",
    slug: "culinary-matcha-a",
    category: "premium",
    grade: "Culinary A",
    short_description:
      "Premium culinary grade from Kagoshima — stable colour retention under heat.",
    full_description:
      "Premium culinary grade from Kagoshima — stable colour retention under heat, clean flavour that holds in lattes, baked goods, and plated desserts. Performs noticeably better than standard culinary imports. Recommended for kitchens where matcha is a feature ingredient, not a background note.",
    use_cases: ["Bakery", "Cafe Menu", "Retail"],
    variants: rowVariants({
      g10: 100,
      g100: 700,
      g250: 1800,
      g500: 3500,
      g1kg: 6800,
    }),
  },
  {
    name: "Culinary Matcha B",
    slug: "culinary-matcha-b",
    category: "premium",
    grade: "Culinary B",
    short_description:
      "Standard culinary grade from Kagoshima, perfect for general kitchen use.",
    full_description:
      "Standard culinary grade from Kagoshima, perfect for general kitchen use, blending, and cost-effective food service applications.",
    use_cases: ["Bakery", "Cafe Menu", "Hotel"],
    variants: rowVariants({
      g10: 100,
      g100: 550,
      g250: 1400,
      g500: 2700,
      g1kg: 5270,
    }),
  },
  {
    name: "Hojicha Powder",
    slug: "hojicha-powder",
    category: "premium",
    grade: "Powder",
    short_description:
      "Roasted Japanese hojicha, finely ground. Low caffeine, warm roasted flavour profile.",
    full_description:
      "Roasted Japanese hojicha, finely ground. Low caffeine, warm roasted flavour profile — performs well in lattes, desserts, and ganaches. Increasingly in demand as an alternative to matcha for guests who want a Japanese tea experience without intensity or caffeine. A strong menu differentiator.",
    use_cases: ["Cafe Menu", "Bakery", "Retail"],
    variants: rowVariants({
      g10: 100,
      g100: 650,
      g250: 1500,
      g500: 3000,
      g1kg: 6000,
    }),
  },
  {
    name: "Sencha Leaf",
    slug: "sencha-leaf",
    category: "premium",
    grade: "Premium",
    short_description:
      "Single-origin Kagoshima sencha for loose-leaf tea service.",
    full_description:
      "Single-origin Kagoshima sencha for loose-leaf tea service. Bright, clean, grassy — delivers a consistent, high-quality cup that communicates provenance clearly to guests. Suitable for premium tea menus, hospitality settings, and wellness-focused F&B.",
    use_cases: ["Hotel", "Cafe Menu", "Retail"],
    variants: rowVariants({
      g10: 100,
      g100: 500,
      g250: 1000,
      g500: 2000,
      g1kg: 4000,
    }),
  },
  {
    name: "Hojicha Leaf",
    slug: "hojicha-leaf",
    category: "premium",
    grade: "Premium",
    short_description:
      "Roasted Kagoshima sencha — low caffeine, naturally sweet, deeply approachable.",
    full_description:
      "Roasted Kagoshima sencha — low caffeine, naturally sweet, deeply approachable. Works well across all dayparts, including evening service where guests want something warm but not stimulating. A reliable addition to any Japanese tea offering.",
    use_cases: ["Cafe Menu", "Hotel", "Retail"],
    variants: rowVariants({
      g10: 100,
      g100: 600,
      g250: 1300,
      g500: 2500,
      g1kg: 5000,
    }),
  },
  {
    name: "Genmaicha",
    slug: "genmaicha",
    category: "premium",
    grade: "Standard",
    short_description:
      "Kagoshima sencha blended with roasted brown rice. Nutty, light, and highly drinkable.",
    full_description:
      "Kagoshima sencha blended with roasted brown rice. Nutty, light, and highly drinkable — one of the most guest-friendly Japanese teas on any menu. Broad appeal across age groups and tea familiarity levels. Low barrier to entry, strong repeat order potential.",
    use_cases: ["Hotel", "Retail", "Cafe Menu"],
    variants: rowVariants({
      g10: 100,
      g100: 500,
      g250: 1000,
      g500: 2000,
      g1kg: 4000,
    }),
  },
  {
    name: "Matcha Latte",
    slug: "matcha-latte",
    category: "instant",
    grade: "Commercial",
    short_description:
      "Premix blended for consistent latte preparation. Delivers vibrant colour and clean flavour.",
    full_description:
      "Premix blended for consistent latte preparation. Delivers vibrant colour, clean flavour, and easy-to-train consistency across barista skill levels. Eliminates the variables of in-house matcha blending. Ready to integrate into your existing latte menu.",
    use_cases: ["Cafe Menu", "Hotel"],
    featured: true,
    variants: rowVariants({
      g15: 100,
      g500: 2400,
      g1kg: 4700,
    }),
  },
  {
    name: "Hojicha Latte",
    slug: "hojicha-latte",
    category: "instant",
    grade: "Commercial",
    short_description:
      "Instant premix: low caffeine, warm and rounded flavour.",
    full_description:
      "Instant premix: low caffeine, warm and rounded flavour — growing in popularity as a coffee alternative and evening beverage. Easy to prepare, visually distinct, and increasingly requested by health-conscious guests.",
    use_cases: ["Cafe Menu", "Retail"],
    variants: rowVariants({
      g15: 100,
      g500: 2400,
      g1kg: 4700,
    }),
  },
];

export const HAMADA_CATALOG: CatalogProduct[] = [
  ...SAMPLE_SET_PRODUCTS,
  ...WHOLESALE_PRODUCTS,
];
