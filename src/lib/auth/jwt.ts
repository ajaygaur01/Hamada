import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { AUTH_TOKEN_TTL_SECONDS } from "@/lib/auth/constants";

export type AuthTokenPayload = JWTPayload & {
  sub: string;
  email: string;
  role: string;
  username: string;
  phone: string | null;
  gstin_verified: boolean;
};

function getJwtSecret() {
  const jwtSecret = process.env.AUTH_JWT_SECRET ?? process.env.JWT_SECRET;

  if (!jwtSecret) {
    if (process.env.NODE_ENV !== "production") {
      return new TextEncoder().encode("dev-only-insecure-auth-secret-change-me");
    }

    throw new Error("Missing AUTH_JWT_SECRET (or JWT_SECRET) environment variable.");
  }

  return new TextEncoder().encode(jwtSecret);
}

export async function createAuthToken(payload: Omit<AuthTokenPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${AUTH_TOKEN_TTL_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify<AuthTokenPayload>(token, getJwtSecret());
  return payload;
}
