import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthUser } from "@/lib/auth/require-user";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await context.params;
  if (!productId) {
    return NextResponse.json({ error: "Product id is required." }, { status: 400 });
  }

  await prisma.wishlist.deleteMany({
    where: {
      user_id: user.id,
      product_id: productId,
    },
  });

  return NextResponse.json({ success: true });
}
