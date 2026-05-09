import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuthUser } from "@/lib/auth/server-session";

async function requireAdmin() {
  const user = await getServerAuthUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const search = req.nextUrl.searchParams.get("search") || "";

  try {
    const where = search
      ? {
          OR: [
            { full_name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { company_name: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const users = await prisma.user.findMany({
      where,
      orderBy: { created_at: "desc" },
      select: {
        id: true, email: true, full_name: true, phone: true, role: true,
        gstin: true, gstin_verified: true, company_name: true, created_at: true,
        _count: { select: { bulk_orders: true } },
      },
    });

    return NextResponse.json({
      users: users.map(u => ({
        id: u.id, email: u.email, fullName: u.full_name, phone: u.phone,
        role: u.role, gstin: u.gstin, gstinVerified: u.gstin_verified,
        companyName: u.company_name, createdAt: u.created_at.toISOString(),
        bulkOrderCount: u._count.bulk_orders,
      })),
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
