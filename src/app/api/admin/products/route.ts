import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuthUser } from "@/lib/auth/server-session";

async function requireAdmin() {
  const user = await getServerAuthUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const search = req.nextUrl.searchParams.get("search") || "";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
  const categoryId = req.nextUrl.searchParams.get("categoryId") || "";
  const status = req.nextUrl.searchParams.get("status") || "all"; // all | active | inactive
  const sort = req.nextUrl.searchParams.get("sort") || "created_at";
  const order = req.nextUrl.searchParams.get("order") || "desc";

  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { short_description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) where.category_id = categoryId;
    if (status === "active") where.is_active = true;
    if (status === "inactive") where.is_active = false;

    const orderBy: any = {};
    if (sort === "name") orderBy.name = order;
    else if (sort === "updated_at") orderBy.updated_at = order;
    else orderBy.created_at = order;

    const [total, products, categories] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, name: true, slug: true, grade: true,
          category_id: true, is_active: true, is_featured: true,
          short_description: true, origin: true, full_description: true,
          storage_instructions: true, shelf_life: true, brewing_guide: true,
          use_cases: true, tasting_profile: true, created_at: true, updated_at: true,
          category: { select: { id: true, name: true } },
          images: { orderBy: { display_order: "asc" }, select: { id: true, image_url: true, alt_text: true, is_primary: true, display_order: true } },
          variants: { orderBy: { size: "asc" }, select: { id: true, size: true, unit: true, sample_price: true, bulk_price: true, stock_quantity: true, min_bulk_quantity: true, is_active: true } },
          _count: { select: { sample_orders: true, bulk_order_items: true, reviews: true } },
        },
      }),
      prisma.category.findMany({ orderBy: { display_order: "asc" } }),
    ]);

    return NextResponse.json({
      products: products.map(p => ({
        ...p,
        categoryName: p.category.name,
        imageUrl: p.images.find(i => i.is_primary)?.image_url || p.images[0]?.image_url || null,
        images: p.images,
        variants: p.variants.map(v => ({
          ...v,
          samplePrice: Number(v.sample_price),
          bulkPrice: Number(v.bulk_price),
          stock: v.stock_quantity,
        })),
        sampleOrders: p._count.sample_orders,
        bulkOrders: p._count.bulk_order_items,
        reviews: p._count.reviews,
        createdAt: p.created_at.toISOString(),
        updatedAt: p.updated_at.toISOString(),
      })),
      categories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, slug, categoryId, grade, shortDescription, fullDescription, origin,
      tastingProfile, useCases, storageInstructions, shelfLife, brewingGuide,
      isActive, isFeatured, variants, images } = body;

    if (!name || !slug || !categoryId) {
      return NextResponse.json({ error: "Name, slug, and category are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name, slug, category_id: categoryId,
        grade: grade || null, short_description: shortDescription || "",
        full_description: fullDescription || "",
        origin: origin || null, tasting_profile: tastingProfile || null,
        use_cases: useCases || [], storage_instructions: storageInstructions || null,
        shelf_life: shelfLife || null, brewing_guide: brewingGuide || null,
        is_active: isActive ?? true, is_featured: isFeatured ?? false,
        variants: variants?.length ? {
          create: variants.map((v: any) => ({
            size: v.size, unit: v.unit || "grams",
            sample_price: v.samplePrice || 0, bulk_price: v.bulkPrice || 0,
            stock_quantity: v.stock || 0, min_bulk_quantity: v.minBulkQuantity || 1,
            is_active: v.isActive ?? true,
          })),
        } : undefined,
        images: images?.length ? {
          create: images.map((img: any, idx: number) => ({
            image_url: img.url,
            alt_text: img.altText?.trim() || null,
            is_primary: img.isPrimary ?? idx === 0,
            display_order: typeof img.displayOrder === "number" ? img.displayOrder : idx,
          })),
        } : undefined,
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    console.error("Admin products POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, ids, name, slug, categoryId, grade, shortDescription, fullDescription, origin,
      tastingProfile, useCases, storageInstructions, shelfLife, brewingGuide,
      isActive, isFeatured, variants, images } = body;

    // Handle Bulk Operations
    if (ids && Array.isArray(ids)) {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: {
          ...(isActive !== undefined && { is_active: isActive }),
          ...(categoryId !== undefined && { category_id: categoryId }),
          ...(isFeatured !== undefined && { is_featured: isFeatured }),
        },
      });
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(categoryId && { category_id: categoryId }),
        ...(grade !== undefined && { grade }),
        ...(shortDescription !== undefined && { short_description: shortDescription }),
        ...(fullDescription !== undefined && { full_description: fullDescription }),
        ...(origin !== undefined && { origin }),
        ...(tastingProfile !== undefined && { tasting_profile: tastingProfile }),
        ...(useCases !== undefined && { use_cases: useCases }),
        ...(storageInstructions !== undefined && { storage_instructions: storageInstructions }),
        ...(shelfLife !== undefined && { shelf_life: shelfLife }),
        ...(brewingGuide !== undefined && { brewing_guide: brewingGuide }),
        ...(isActive !== undefined && { is_active: isActive }),
        ...(isFeatured !== undefined && { is_featured: isFeatured }),
      },
    });

    // Variant updates: full catalog sync from ProductForm vs quick inline stock edit
    if (variants !== undefined && Array.isArray(variants)) {
      const fullVariantSync =
        variants.some((v: { id?: string; size?: string }) => !v.id || v.size !== undefined);

      if (fullVariantSync) {
        const existing = await prisma.productVariant.findMany({
          where: { product_id: id },
          select: { id: true },
        });
        const incomingIds = new Set(
          variants.filter((v: { id?: string }) => v.id).map((v: { id: string }) => v.id)
        );
        const removedIds = existing.filter((e) => !incomingIds.has(e.id)).map((e) => e.id);

        if (removedIds.length > 0) {
          await prisma.productVariant.updateMany({
            where: { id: { in: removedIds } },
            data: { is_active: false },
          });
        }

        for (const v of variants) {
          const variantData = {
            size: v.size || "Standard",
            unit: v.unit || "grams",
            sample_price: v.samplePrice ?? 0,
            bulk_price: v.bulkPrice ?? 0,
            stock_quantity: v.stock ?? 0,
            min_bulk_quantity: v.minBulkQuantity ?? 1,
            is_active: v.isActive ?? true,
          };

          if (v.id) {
            await prisma.productVariant.update({
              where: { id: v.id },
              data: variantData,
            });
          } else if (v.size?.trim()) {
            await prisma.productVariant.create({
              data: { product_id: id, ...variantData },
            });
          }
        }
      } else {
        for (const v of variants) {
          if (!v.id) continue;
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              ...(v.samplePrice !== undefined && { sample_price: v.samplePrice }),
              ...(v.bulkPrice !== undefined && { bulk_price: v.bulkPrice }),
              ...(v.stock !== undefined && { stock_quantity: v.stock }),
              ...(v.minBulkQuantity !== undefined && { min_bulk_quantity: v.minBulkQuantity }),
              ...(v.isActive !== undefined && { is_active: v.isActive }),
            },
          });
        }
      }
    }

    // Replace gallery when client sends `images` (ProductForm always sends the full list).
    // Previously only rows with `id` were updated — new uploads have no id, so nothing was inserted.
    if (images !== undefined && Array.isArray(images)) {
      const valid = images.filter(
        (img: { url?: string }) => typeof img?.url === "string" && img.url.trim().length > 0
      ) as { url: string; altText?: string; isPrimary?: boolean; displayOrder?: number }[];

      const primaryIdx = valid.findIndex((i) => i.isPrimary);
      const primaryRow = primaryIdx >= 0 ? primaryIdx : 0;

      await prisma.$transaction(async (tx) => {
        await tx.productImage.deleteMany({ where: { product_id: id } });
        if (valid.length === 0) return;
        await tx.productImage.createMany({
          data: valid.map((img, idx) => ({
            product_id: id,
            image_url: img.url.trim(),
            alt_text: img.altText?.trim() || null,
            is_primary: idx === primaryRow,
            display_order: typeof img.displayOrder === "number" ? img.displayOrder : idx,
          })),
        });
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin products PATCH error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id");
  const ids = req.nextUrl.searchParams.get("ids")?.split(",");

  try {
    if (ids && ids.length > 0) {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { is_active: false },
      });
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    await prisma.product.update({ where: { id }, data: { is_active: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin products DELETE error:", error);
    return NextResponse.json({ error: "Failed to deactivate product" }, { status: 500 });
  }
}
