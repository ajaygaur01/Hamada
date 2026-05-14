import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pickHeroImageUrl, productCardImageInclude } from "@/lib/product-images";
import { getServerAuthUser } from "@/lib/auth/server-session";

export async function GET() {
  try {
    const user = await getServerAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { user_id: user.id },
      include: {
        product: {
          include: {
            images: {
              ...productCardImageInclude,
            },
            variants: {
              where: { is_active: true },
              orderBy: { sample_price: "asc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const formattedWishlist = wishlist.map((item) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      imageUrl: pickHeroImageUrl(item.product.images),
      price: item.product.variants[0]?.sample_price ? Number(item.product.variants[0].sample_price) : null,
      addedAt: item.created_at.toISOString(),
    }));

    return NextResponse.json({ wishlist: formattedWishlist });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getServerAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing wishlist item id" }, { status: 400 });
    }

    await prisma.wishlist.delete({
      where: {
        id,
        user_id: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
