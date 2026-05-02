import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_SECONDS } from "@/lib/auth/constants";
import { createAuthToken } from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { normalizePhone, validateLoginInput } from "@/lib/auth/validators";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifier?: string;
      password?: string;
    };

    const validated = validateLoginInput(body);
    if ("error" in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const phoneCandidate = normalizePhone(validated.identifier);
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.identifier },
          ...(phoneCandidate ? [{ phone: phoneCandidate }] : []),
        ],
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        full_name: true,
        password_hash: true,
        gstin_verified: true,
      },
    });

    if (!user?.password_hash) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(validated.password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createAuthToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.full_name ?? "",
      phone: user.phone,
      gstin_verified: user.gstin_verified,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        username: user.full_name,
        gstin_verified: user.gstin_verified,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      maxAge: AUTH_TOKEN_TTL_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ error: "Could not login." }, { status: 500 });
  }
}
