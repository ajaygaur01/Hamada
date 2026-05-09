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

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: search
          ? { name: { contains: search, mode: "insensitive" } }
          : undefined,
        include: {
          category: { select: { id: true, name: true } },
          variants: { select: { id: true, size: true, unit: true, sample_price: true, bulk_price: true, stock_quantity: true, is_active: true }, orderBy: { sample_price: "asc" } },
          images: { select: { id: true, image_url: true, is_primary: true }, orderBy: { display_order: "asc" } },
          _count: { select: { sample_orders: true, bulk_order_items: true, reviews: true } },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.category.findMany({ orderBy: { display_order: "asc" }, select: { id: true, name: true } }),
    ]);

    return NextResponse.json({
      categories,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryId: p.category_id,
        categoryName: p.category.name,
        isActive: p.is_active,
        isFeatured: p.is_featured,
        shortDescription: p.short_description,
        origin: (p as any).origin || null,
        images: p.images.map(img => ({ id: img.id, url: img.image_url, isPrimary: img.is_primary })),
        imageUrl: p.images[0]?.image_url || null,
        variantCount: p.variants.length,
        variants: p.variants.map(v => ({
          id: v.id, size: v.size, unit: v.unit,
          samplePrice: Number(v.sample_price), bulkPrice: Number(v.bulk_price),
          stock: v.stock_quantity, isActive: v.is_active,
        })),
        sampleOrders: p._count.sample_orders,
        bulkOrders: p._count.bulk_order_items,
        reviews: p._count.reviews,
        createdAt: p.created_at.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Admin products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, name, shortDescription, isActive, isFeatured, categoryId, variants } = body;

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    // Update product fields
    await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(shortDescription !== undefined && { short_description: shortDescription }),
        ...(isActive !== undefined && { is_active: isActive }),
        ...(isFeatured !== undefined && { is_featured: isFeatured }),
        ...(categoryId !== undefined && { category_id: categoryId }),
      },
    });

    // Update variants if provided
    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (!v.id) continue;
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            ...(v.samplePrice !== undefined && { sample_price: v.samplePrice }),
            ...(v.bulkPrice !== undefined && { bulk_price: v.bulkPrice }),
            ...(v.stock !== undefined && { stock_quantity: v.stock }),
            ...(v.isActive !== undefined && { is_active: v.isActive }),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin product update error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

  try {
    await prisma.product.update({ where: { id }, data: { is_active: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin product delete error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
