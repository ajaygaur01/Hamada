import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findUnique({
    where: { slug: "hojicha-latte-premix" },
    include: { images: true, variants: true }
  });
  console.log(JSON.stringify(p, null, 2));
}

main().finally(() => prisma.$disconnect());
