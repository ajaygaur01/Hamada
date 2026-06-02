import { PrismaClient } from "@prisma/client";
import {
  clearProductCatalog,
  seedProductCatalog,
} from "./seed/catalog-seeder";

const prisma = new PrismaClient();

const reviewBodies = [
  "Consistent colour batch to batch — our baristas noticed immediately. Dispatch was quick.",
  "We ran side-by-side cuppings with our previous supplier; this won on clarity and sweetness.",
  "Bulk pricing is transparent and the GST paperwork was painless.",
  "Sample pack was enough for two weeks of R&D. Moved to 500g for the spring menu.",
  "Guests comment on the aroma daily. Will reorder before we run out.",
];

async function seedDemoUsers() {
  await prisma.gstinVerification.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "hema@chirantea.in",
      role: "admin",
      full_name: "Hema",
      is_verified: true,
      gstin_verified: true,
      company_name: "Hamada Global Trading Pvt. Ltd.",
    },
  });

  const buyers = await Promise.all(
    [
      { email: "buyer1@seed.hamada.local", name: "Priya Sharma" },
      { email: "buyer2@seed.hamada.local", name: "Rahul Verma" },
      { email: "buyer3@seed.hamada.local", name: "Ananya Iyer" },
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

  console.log(`Admin: ${admin.email}`);
  console.log(`Demo buyers: ${buyers.length}`);
  return buyers;
}

async function seedDemoReviews(
  products: { id: string; name: string }[],
  buyerIds: string[]
) {
  let count = 0;
  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const numReviews = i < 4 ? 2 : 1;
    for (let r = 0; r < numReviews; r++) {
      await prisma.review.create({
        data: {
          user_id: buyerIds[(i + r) % buyerIds.length],
          product_id: prod.id,
          rating: 4 + ((i + r) % 2),
          review_text: reviewBodies[(i + r) % reviewBodies.length],
        },
      });
      count++;
    }
  }
  console.log(`Reviews: ${count}`);
}

async function main() {
  console.log("Full database seed (users + Hamada catalog)…\n");

  await clearProductCatalog(prisma);
  const buyers = await seedDemoUsers();
  const { products } = await seedProductCatalog(prisma);
  await seedDemoReviews(products, buyers.map((b) => b.id));

  console.log("\nSeed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
