import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Short, reliable placeholder URLs (Picsum can be blocked; placehold.co is compact for VarChar) */
function stockImageUrl(slug: string, index: number): string {
  const labels = ["Hero", "Detail", "Lifestyle"];
  const label = labels[index] ?? String(index + 1);
  return `https://placehold.co/800x1000/f5f0e8/4C632E/jpg?text=${encodeURIComponent(`${slug.slice(0, 20)}+${label}`)}`;
}

async function main() {
  console.log("Starting seed…");

  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.bulkOrderItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.bulkOrder.deleteMany();
  await prisma.sampleOrder.deleteMany();
  await prisma.gstinVerification.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "hema@chirantea.in",
      role: "admin",
      full_name: "Hema",
      is_verified: true,
      gstin_verified: true,
      company_name: "Kaori by Chiran",
    },
  });
  console.log(`Admin: ${admin.email}`);

  const buyers = await Promise.all(
    [
      { email: "buyer1@seed.hamada.local", name: "Priya Sharma" },
      { email: "buyer2@seed.hamada.local", name: "Rahul Verma" },
      { email: "buyer3@seed.hamada.local", name: "Ananya Iyer" },
      { email: "buyer4@seed.hamada.local", name: "Vikram Mehta" },
      { email: "buyer5@seed.hamada.local", name: "Neha Kapoor" },
    ].map((b, i) =>
      prisma.user.create({
        data: {
          email: b.email,
          role: "customer",
          full_name: b.name,
          is_verified: true,
          gstin_verified: true,
          gstin: `29ABCDE1234F${String(i + 1).padStart(2, "0")}Z${i + 1}`,
          company_name: `${b.name} Foods Pvt Ltd`,
        },
      })
    )
  );
  console.log(`Buyers (for reviews): ${buyers.length}`);

  const catPremium = await prisma.category.create({
    data: {
      name: "Premium Japanese Teas",
      slug: "premium-japanese-teas",
      display_order: 1,
    },
  });

  const catInstant = await prisma.category.create({
    data: {
      name: "Instant Teas and Ready Formats",
      slug: "instant-teas-and-ready-formats",
      display_order: 2,
    },
  });

  type VariantSeed = {
    size: string;
    unit: string;
    sample_price: number;
    bulk_price: number;
    stock_quantity: number;
    min_bulk_quantity: number;
  };

  type ProductSeed = {
    name: string;
    categoryId: string;
    grade: string;
    short_description: string;
    full_description: string;
    use_cases: string[];
    featured?: boolean;
    variants: VariantSeed[];
  };

  const premiumProducts: ProductSeed[] = [
    {
      name: "Matcha — Ceremonial Grade",
      categoryId: catPremium.id,
      grade: "Ceremonial",
      short_description: "Stone-ground ceremonial matcha for cafes and tea bars.",
      full_description:
        "Vibrant jade colour, silky foam, and low bitterness — ideal for usucha and koicha service in hospitality.",
      use_cases: ["Cafe Menu", "Hotel", "Retail"],
      featured: true,
      variants: [
        { size: "50g", unit: "grams", sample_price: 299, bulk_price: 260, stock_quantity: 120, min_bulk_quantity: 5 },
        { size: "100g", unit: "grams", sample_price: 549, bulk_price: 480, stock_quantity: 85, min_bulk_quantity: 3 },
        { size: "500g", unit: "grams", sample_price: 2400, bulk_price: 2100, stock_quantity: 40, min_bulk_quantity: 2 },
        { size: "1kg", unit: "grams", sample_price: 4500, bulk_price: 4000, stock_quantity: 22, min_bulk_quantity: 1 },
      ],
    },
    {
      name: "Matcha — Culinary Grade",
      categoryId: catPremium.id,
      grade: "Culinary",
      short_description: "Bold matcha for lattes, baking, and dessert menus.",
      full_description:
        "Higher astringency and deep colour — formulated for blended drinks and pastry applications.",
      use_cases: ["Bakery", "Cafe Menu", "Retail"],
      featured: true,
      variants: [
        { size: "50g", unit: "grams", sample_price: 199, bulk_price: 170, stock_quantity: 200, min_bulk_quantity: 5 },
        { size: "100g", unit: "grams", sample_price: 349, bulk_price: 300, stock_quantity: 150, min_bulk_quantity: 3 },
        { size: "500g", unit: "grams", sample_price: 1500, bulk_price: 1320, stock_quantity: 55, min_bulk_quantity: 2 },
        { size: "1kg", unit: "grams", sample_price: 2800, bulk_price: 2500, stock_quantity: 30, min_bulk_quantity: 1 },
      ],
    },
    {
      name: "Sencha — Fukamushi",
      categoryId: catPremium.id,
      grade: "Premium",
      short_description: "Deep-steamed sencha with rich umami and mellow sweetness.",
      full_description:
        "Classic Kagoshima sencha profile; works beautifully as iced tea for QSR and hotel buffets.",
      use_cases: ["Cafe Menu", "Hotel"],
      variants: [
        { size: "50g", unit: "grams", sample_price: 179, bulk_price: 155, stock_quantity: 95, min_bulk_quantity: 5 },
        { size: "100g", unit: "grams", sample_price: 319, bulk_price: 280, stock_quantity: 70, min_bulk_quantity: 3 },
        { size: "500g", unit: "grams", sample_price: 1400, bulk_price: 1220, stock_quantity: 28, min_bulk_quantity: 2 },
      ],
    },
    {
      name: "Hojicha — Roasted Green Tea",
      categoryId: catPremium.id,
      grade: "Premium",
      short_description: "Low-caffeine roasted tea with caramel and cocoa notes.",
      full_description:
        "Comforting roast aroma; popular for evening menus and dessert pairings.",
      use_cases: ["Cafe Menu", "Retail"],
      featured: true,
      variants: [
        { size: "50g", unit: "grams", sample_price: 159, bulk_price: 135, stock_quantity: 110, min_bulk_quantity: 5 },
        { size: "100g", unit: "grams", sample_price: 289, bulk_price: 250, stock_quantity: 88, min_bulk_quantity: 3 },
        { size: "500g", unit: "grams", sample_price: 1200, bulk_price: 1050, stock_quantity: 35, min_bulk_quantity: 2 },
      ],
    },
    {
      name: "Genmaicha — Brown Rice Tea",
      categoryId: catPremium.id,
      grade: "Standard",
      short_description: "Sencha with toasted rice — nutty, approachable, everyday cup.",
      full_description:
        "Balanced and forgiving brew; strong appeal for lunch menus and retail tins.",
      use_cases: ["Hotel", "Retail", "Cafe Menu"],
      variants: [
        { size: "50g", unit: "grams", sample_price: 149, bulk_price: 125, stock_quantity: 140, min_bulk_quantity: 5 },
        { size: "100g", unit: "grams", sample_price: 269, bulk_price: 235, stock_quantity: 100, min_bulk_quantity: 3 },
      ],
    },
  ];

  const instantProducts: ProductSeed[] = [
    {
      name: "Matcha Latte Premix",
      categoryId: catInstant.id,
      grade: "Commercial",
      short_description: "Just-add-milk premix for consistent cafe throughput.",
      full_description:
        "Pre-balanced sweetness and matcha solids — reduces training time and waste.",
      use_cases: ["Cafe Menu", "Hotel"],
      featured: true,
      variants: [
        { size: "500g", unit: "grams", sample_price: 420, bulk_price: 360, stock_quantity: 60, min_bulk_quantity: 2 },
        { size: "1kg", unit: "grams", sample_price: 780, bulk_price: 680, stock_quantity: 34, min_bulk_quantity: 1 },
      ],
    },
    {
      name: "Hojicha Latte Premix",
      categoryId: catInstant.id,
      grade: "Commercial",
      short_description: "Roasted latte base with clean finish.",
      full_description:
        "Pairs with dairy and oat; ideal for seasonal menus and grab-and-go formats.",
      use_cases: ["Cafe Menu", "Retail"],
      variants: [
        { size: "500g", unit: "grams", sample_price: 390, bulk_price: 340, stock_quantity: 48, min_bulk_quantity: 2 },
        { size: "1kg", unit: "grams", sample_price: 720, bulk_price: 640, stock_quantity: 25, min_bulk_quantity: 1 },
      ],
    },
  ];

  const allDefs = [...premiumProducts, ...instantProducts];

  const reviewBodies: string[] = [
    "Consistent colour batch to batch — our baristas noticed immediately. Dispatch was quick.",
    "We ran side-by-side cuppings with our previous supplier; this won on clarity and sweetness.",
    "Bulk pricing is transparent and the GST paperwork was painless.",
    "Sample pack was enough for two weeks of R&D. Moved to 500g for the spring menu.",
    "Guests comment on the aroma daily. Will reorder before we run out.",
    "Solid for our bakery line — no clumping in our dry mix process.",
  ];

  const createdProducts: { id: string; slug: string; name: string }[] = [];

  for (const p of allDefs) {
    const slug = slugify(p.name);
    const product = await prisma.product.create({
      data: {
        category_id: p.categoryId,
        name: p.name,
        slug,
        grade: p.grade,
        short_description: p.short_description,
        full_description: p.full_description,
        use_cases: p.use_cases,
        origin: "Kagoshima, Japan",
        shelf_life: "18–24 months from packing",
        storage_instructions: "Cool, dry place; refrigerate after opening if advised on pack.",
        is_active: true,
        is_featured: p.featured ?? false,
        variants: {
          create: p.variants.map((v) => ({
            size: v.size,
            unit: v.unit,
            sample_price: v.sample_price,
            bulk_price: v.bulk_price,
            stock_quantity: v.stock_quantity,
            min_bulk_quantity: v.min_bulk_quantity,
            is_active: true,
          })),
        },
        images: {
          create: [0, 1, 2].map((i) => ({
            image_url: stockImageUrl(slug, i),
            alt_text: `${p.name} — image ${i + 1}`,
            display_order: i,
            is_primary: i === 0,
          })),
        },
      },
    });
    createdProducts.push({ id: product.id, slug, name: p.name });
  }

  console.log(`Products + 3 stock images each: ${createdProducts.length}`);

  let reviewCount = 0;
  const shuffledBuyers = [...buyers].sort(() => Math.random() - 0.5);

  for (let i = 0; i < createdProducts.length; i++) {
    const prod = createdProducts[i];
    const numReviews = i < 3 ? 3 : i < 5 ? 2 : 1;
    for (let r = 0; r < numReviews; r++) {
      const user = shuffledBuyers[(i + r) % shuffledBuyers.length];
      const rating = 4 + ((i + r) % 2);
      await prisma.review.create({
        data: {
          user_id: user.id,
          product_id: prod.id,
          rating,
          review_text: reviewBodies[(i * 2 + r) % reviewBodies.length],
          created_at: new Date(Date.UTC(2025, (i + r) % 12, 3 + r, 12, 0, 0)),
        },
      });
      reviewCount++;
    }
  }

  console.log(`Reviews: ${reviewCount}`);
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
