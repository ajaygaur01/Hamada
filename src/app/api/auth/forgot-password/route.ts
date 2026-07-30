import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email-service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // Return generic success message even if user not found to prevent email enumeration
    const successResponse = NextResponse.json({
      message: "If an account with that email exists, we have sent a password reset link.",
    });

    if (!user) {
      return successResponse;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_reset_token: token,
        password_reset_expires: expires,
      },
    });

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const appUrl = `${protocol}://${host}`;
    const resetLink = `${appUrl}/account/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, resetLink);

    return successResponse;
  } catch (error) {
    console.error("Forgot password request failed:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 },
    );
  }
}
