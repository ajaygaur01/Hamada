#!/usr/bin/env tsx
/**
 * Re-seed the Hamada product catalog from prisma/data/hamada-catalog.ts
 *
 * Usage:
 *   npm run seed:catalog              # products + categories only (keeps users)
 *   npm run seed:catalog -- --full    # same as npm run db:seed (users + products)
 */

import { PrismaClient } from "@prisma/client";
import {
  clearProductCatalog,
  seedProductCatalog,
} from "../prisma/seed/catalog-seeder";

const prisma = new PrismaClient();
const fullReset = process.argv.includes("--full");

async function seedUsers() {
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
}

async function main() {
  console.log("Hamada catalog seed");
  console.log(`Mode: ${fullReset ? "full (users + catalog)" : "catalog only"}\n`);

  if (fullReset) {
    await clearProductCatalog(prisma);
    await seedUsers();
  } else {
    await clearProductCatalog(prisma);
  }

  const result = await seedProductCatalog(prisma);
  console.log(`Categories: ${result.categories}`);
  console.log(`Products: ${result.products.length}`);
  for (const p of result.products) {
    console.log(`  · ${p.name} (${p.slug})`);
  }
  console.log("\nDone. Edit prisma/data/hamada-catalog.ts and re-run to update prices.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
