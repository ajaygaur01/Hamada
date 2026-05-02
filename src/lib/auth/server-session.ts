import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAuthToken } from "@/lib/auth/jwt";

export type ServerAuthUser = {
  id: string;
  email: string;
  phone: string | null;
  role: string;
  username: string | null;
  gstin_verified: boolean;
};

export async function getServerAuthUser(): Promise<ServerAuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return null;
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
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      username: user.full_name,
      gstin_verified: user.gstin_verified,
    };
  } catch (error) {
    console.error("getServerAuthUser Error:", error);
    return null;
  }
}
