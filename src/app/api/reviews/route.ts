import { NextResponse } from "next/server";
import { getServerAuthUser } from "@/lib/auth/server-session";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getServerAuthUser();

    // 1. Must be logged in
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Must be a verified wholesale buyer
    if (!user.gstin_verified) {
      return NextResponse.json({ error: "Only verified wholesale buyers can submit reviews." }, { status: 403 });
    }

    const body = await request.json();
    const { productId, rating, reviewText } = body;

    // 3. Validate input
    if (!productId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid input. Rating must be between 1 and 5." }, { status: 400 });
    }

    // 4. Create Review
    const newReview = await prisma.review.create({
      data: {
        user_id: user.id,
        product_id: productId,
        rating,
        review_text: reviewText?.trim() || null,
      },
      include: {
        user: {
          select: {
            full_name: true,
          }
        }
      }
    });

    // Format name
    let reviewerName = "Anonymous";
    if (newReview.user.full_name) {
      const parts = newReview.user.full_name.split(" ");
      if (parts.length > 1) {
        reviewerName = `${parts[0]} ${parts[parts.length - 1][0]}.`;
      } else {
        reviewerName = parts[0];
      }
    }

    const reviewResponse = {
      id: newReview.id,
      rating: newReview.rating,
      reviewText: newReview.review_text,
      createdAt: newReview.created_at.toISOString(),
      user: {
        name: reviewerName,
      }
    };

    return NextResponse.json({ success: true, review: reviewResponse }, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
