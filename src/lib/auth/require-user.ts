import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAuthToken } from "@/lib/auth/jwt";

export async function requireAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);
    if (!payload.sub) {
      return null;
    }

    return await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        full_name: true,
      },
    });
  } catch {
    return null;
  }
}
