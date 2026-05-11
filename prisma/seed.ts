const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data (optional, handle with care in production)
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.bulkOrderItem.deleteMany();
  await prisma.bulkOrder.deleteMany();
  await prisma.sampleOrder.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'hema@chirantea.in',
      role: 'admin',
      full_name: 'Hema',
      is_verified: true,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create Categories
  const premiumTeas = await prisma.category.create({
    data: {
      name: 'Premium Japanese Teas',
      slug: 'premium-japanese-teas',
      display_order: 1,
    },
  });

  const instantTeas = await prisma.category.create({
    data: {
      name: 'Instant Teas and Ready Formats',
      slug: 'instant-teas-and-ready-formats',
      display_order: 2,
    },
  });
  console.log('Created categories');

  // 3. Create Products - Premium Japanese Teas
  const premiumProducts = [
    { name: 'Matcha - Ceremonial Grade', hsn: '0902', use_cases: ['Cafe Menu', 'Hotel', 'Retail'] },
    { name: 'Matcha - Premium Grade', hsn: '0902', use_cases: ['Cafe Menu', 'Bakery', 'Retail'] },
    { name: 'Matcha - Culinary Grade', hsn: '0902', use_cases: ['Bakery', 'Cafe Menu'] },
    { name: 'Matcha - Ingredient Grade', hsn: '0902', use_cases: ['Bakery', 'Hotel'] },
    { name: 'Sencha', hsn: '0902', use_cases: ['Cafe Menu', 'Hotel', 'Retail'] },
    { name: 'Hojicha', hsn: '0902', use_cases: ['Cafe Menu', 'Hotel'] },
    { name: 'Hojicha Powder', hsn: '0902', use_cases: ['Bakery', 'Cafe Menu'] },
    { name: 'Genmaicha', hsn: '0902', use_cases: ['Hotel', 'Retail'] },
  ];

  for (const p of premiumProducts) {
    await prisma.product.create({
      data: {
        category_id: premiumTeas.id,
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        grade: p.name.includes('-') ? p.name.split('-')[1].trim() : 'Premium Grade',
        short_description: `Premium quality ${p.name}`,
        full_description: `Experience the authentic taste of ${p.name}, imported directly from Japan.`,
        storage_instructions: 'Refrigerate at 10-12°C',
        shelf_life: '18 months',
        use_cases: p.use_cases,
        variants: {
          create: [
            { size: '10g', unit: 'grams', sample_price: 250, bulk_price: 225, stock_quantity: 200, min_bulk_quantity: 10 },
            { size: '30g', unit: 'grams', sample_price: 500, bulk_price: 450, stock_quantity: 100, min_bulk_quantity: 5 },
            { size: '100g', unit: 'grams', sample_price: 1500, bulk_price: 1350, stock_quantity: 100, min_bulk_quantity: 5 },
            { size: '500g', unit: 'grams', sample_price: 7000, bulk_price: 6500, stock_quantity: 50, min_bulk_quantity: 2 },
            { size: '1kg', unit: 'grams', sample_price: 13500, bulk_price: 12500, stock_quantity: 20, min_bulk_quantity: 1 },
          ],
        },
      },
    });
  }

  // 4. Create Products - Instant Teas and Ready Formats
  const instantProducts = [
    { name: 'Matcha Latte Premix', hsn: '21012010', use_cases: ['Cafe Menu', 'Hotel', 'Retail'] },
    { name: 'Hojicha Latte Premix', hsn: '21012010', use_cases: ['Cafe Menu', 'Hotel'] },
    { name: 'Sencha Green Tea Bags', hsn: '09024090', use_cases: ['Hotel', 'Retail', 'Cafe Menu'] },
    { name: 'Hojicha Tea Bags', hsn: '09024090', use_cases: ['Hotel', 'Retail'] },
  ];

  for (const p of instantProducts) {
    await prisma.product.create({
      data: {
        category_id: instantTeas.id,
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        grade: 'Commercial Grade',
        short_description: `Convenient and authentic ${p.name}`,
        full_description: `Enjoy the perfect cup of ${p.name} anytime, anywhere.`,
        storage_instructions: 'Store in a cool, dry place away from direct sunlight',
        shelf_life: '24 months',
        use_cases: p.use_cases,
        variants: {
          create: [
            { size: '10g', unit: 'grams', sample_price: 150, bulk_price: 135, stock_quantity: 200, min_bulk_quantity: 10 },
            { size: '30g', unit: 'grams', sample_price: 300, bulk_price: 270, stock_quantity: 200, min_bulk_quantity: 10 },
            { size: '500g', unit: 'grams', sample_price: 2000, bulk_price: 1800, stock_quantity: 100, min_bulk_quantity: 5 },
            { size: '1kg', unit: 'grams', sample_price: 3800, bulk_price: 3400, stock_quantity: 50, min_bulk_quantity: 2 },
          ],
        },
      },
    });
  }

  console.log('Created products');
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
