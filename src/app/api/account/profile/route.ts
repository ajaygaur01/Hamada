import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthUser } from "@/lib/auth/require-user";

export async function GET() {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.full_name ?? "",
      email: user.email,
      phone: user.phone ?? "",
      role: user.role,
    },
  });
}

export async function PATCH(request: Request) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      username?: string;
      phone?: string;
      email?: string;
    };

    const username = body.username?.trim() ?? "";
    const phone = (body.phone ?? "").replace(/\D/g, "");
    const email = body.email?.trim().toLowerCase() ?? "";

    if (username.length < 2) {
      return NextResponse.json({ error: "Username must be at least 2 characters." }, { status: 400 });
    }
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Phone must be a valid 10-digit number." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const duplicate = await prisma.user.findFirst({
      where: {
        id: { not: user.id },
        OR: [{ email }, { phone }],
      },
      select: { id: true },
    });

    if (duplicate) {
      return NextResponse.json({ error: "Email or phone is already used by another account." }, { status: 409 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        full_name: username,
        email,
        phone,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        username: updated.full_name ?? "",
        email: updated.email,
        phone: updated.phone ?? "",
        role: updated.role,
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }
}
