import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_SECONDS } from "@/lib/auth/constants";
import { createAuthToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { validateSignupInput } from "@/lib/auth/validators";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      email?: string;
      phone?: string;
      password?: string;
    };

    const validated = validateSignupInput(body);
    if ("error" in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: validated.email }, { phone: validated.phone }],
      },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email or phone already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        phone: validated.phone,
        full_name: validated.username,
        password_hash: passwordHash,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        full_name: true,
        gstin_verified: true,
      },
    });

    const token = await createAuthToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.full_name ?? "",
      phone: user.phone,
      gstin_verified: user.gstin_verified,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          username: user.full_name,
          gstin_verified: user.gstin_verified,
        },
      },
      { status: 201 },
    );

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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email or phone already exists." },
        { status: 409 },
      );
    }

    console.error("Signup failed:", error);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
