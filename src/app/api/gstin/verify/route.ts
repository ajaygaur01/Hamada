import { NextResponse } from "next/server";
import { getServerAuthUser } from "@/lib/auth/server-session";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_SECONDS } from "@/lib/auth/constants";
import { createAuthToken } from "@/lib/auth/jwt";

// Real AppyFlow API call
async function verifyGstinWithAppyFlow(gstin: string) {
  const keySecret = process.env.APPLYFLOW_SECRET || process.env.APPYFLOW_SECRET;

  if (!keySecret) {
    // Fallback mock if no API key is set
    console.warn("APPLYFLOW_SECRET not set, using mock response");
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (gstin.startsWith("99")) {
      return { success: false, error: "GSTIN not found or inactive" };
    }
    return {
      success: true,
      data: {
        tradeName: "MOCK BUSINESS ENTERPRISES",
        legalName: "MOCK BUSINESS ENTERPRISES PVT LTD",
        address: {
          buildingName: "123",
          street: "Mock Street",
          location: "Mock City",
          pincode: "110001",
          state: "Delhi",
        },
      },
    };
  }

  try {
    const response = await fetch(
      `https://appyflow.in/api/verifyGST?gstNo=${encodeURIComponent(gstin)}&key_secret=${encodeURIComponent(keySecret)}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) {
      return { success: false, error: "GST verification service unavailable" };
    }

    const data = await response.json();

    // AppyFlow returns error: true when GSTIN is invalid/not found
    if (data.error === true || !data.taxpayerInfo) {
      return { success: false, error: data.message || "GSTIN not found or inactive" };
    }

    const info = data.taxpayerInfo;

    // Check if GST is active
    if (info.sts && info.sts.toLowerCase() !== "active") {
      return { success: false, error: `GSTIN is not active (Status: ${info.sts})` };
    }

    // Build address from pradr
    const addr = info.pradr?.addr || {};
    const addressParts = [
      addr.bno,
      addr.st,
      addr.loc,
      addr.dst,
      addr.stcd,
      addr.pncd,
    ].filter(Boolean);
    const fullAddress = addressParts.join(", ");

    const tradeName = info.tradeNam || info.lgnm || "Unknown Business";
    const legalName = info.lgnm || tradeName;

    return {
      success: true,
      data: {
        tradeName,
        legalName,
        address: {
          full: fullAddress,
        },
      },
    };
  } catch (err) {
    console.error("AppyFlow API error:", err);
    return { success: false, error: "GST verification service error. Please try again." };
  }
}

export async function POST(request: Request) {
  try {
    const user = await getServerAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, gstin, companyName, companyAddress } = await request.json();

    if (action === "verify") {
      if (!gstin) {
        return NextResponse.json({ error: "GSTIN is required" }, { status: 400 });
      }

      const result = await verifyGstinWithAppyFlow(gstin);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      const resolvedAddress = result.data!.address.full
        || `${(result.data!.address as any).buildingName || ""}, ${(result.data!.address as any).street || ""}, ${(result.data!.address as any).location || ""}, ${(result.data!.address as any).state || ""} - ${(result.data!.address as any).pincode || ""}`;

      // Log verification attempt
      await prisma.gstinVerification.create({
        data: {
          user_id: user.id,
          gstin,
          company_name: result.data!.tradeName,
          company_address: resolvedAddress,
          verification_status: "verified",
          api_response: result.data as any,
          verified_at: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        companyName: result.data!.tradeName,
        companyAddress: resolvedAddress,
      });
    }

    if (action === "confirm") {
      const dbUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          gstin,
          company_name: companyName,
          company_address: companyAddress,
          gstin_verified: true,
        },
      });

      // Re-issue JWT with gstin_verified: true
      const token = await createAuthToken({
        sub: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        username: dbUser.full_name ?? "",
        phone: dbUser.phone,
        gstin_verified: true,
      });

      const cookieStore = await cookies();
      cookieStore.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        maxAge: AUTH_TOKEN_TTL_SECONDS,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("GST Verification failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
