import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthUser } from "@/lib/auth/require-user";

export async function GET() {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlistItems = await prisma.wishlist.findMany({
    where: { user_id: user.id },
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          short_description: true,
          use_cases: true,
          category: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({
    items: wishlistItems.map((item) => ({
      id: item.id,
      productId: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      shortDescription: item.product.short_description,
      categoryName: item.product.category.name,
      useCases: item.product.use_cases,
      addedAt: item.created_at,
    })),
  });
}

export async function POST(request: Request) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { productId?: string };
    if (!body.productId) {
      return NextResponse.json({ error: "Product is required." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: body.productId },
      select: { id: true, is_active: true },
    });

    if (!product || !product.is_active) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await prisma.wishlist.upsert({
      where: {
        user_id_product_id: {
          user_id: user.id,
          product_id: body.productId,
        },
      },
      update: {},
      create: {
        user_id: user.id,
        product_id: body.productId,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not add to wishlist." }, { status: 500 });
  }
}
