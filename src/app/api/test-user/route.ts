import { NextResponse } from "next/server";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAuthToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    
    let payload = null;
    let payloadError = null;
    try {
      if (token) payload = await verifyAuthToken(token);
    } catch (e: any) {
      payloadError = e.message;
    }

    const user = await getServerAuthUser();
    return NextResponse.json({ user, hasToken: !!token, payload, payloadError });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
