import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAuthToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        full_name: true,
        gstin_verified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        username: user.full_name,
        gstin_verified: user.gstin_verified,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
