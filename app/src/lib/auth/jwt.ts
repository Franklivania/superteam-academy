import * as jose from "jose";
import type { SessionPayload } from "@/lib/types/auth";

const AUTH_SECRET = process.env.AUTH_SECRET;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function get_secret(): Uint8Array {
  if (!AUTH_SECRET || AUTH_SECRET.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(AUTH_SECRET);
}

export async function create_session_token(payload: Omit<SessionPayload, "iat" | "exp">): Promise<string> {
  const secret = get_secret();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.floor(SESSION_DURATION_MS / 1000);
  return await new jose.SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verify_session_token(token: string): Promise<SessionPayload | null> {
  try {
    const secret = get_secret();
    const { payload } = await jose.jwtVerify(token, secret);
    const sub = payload.sub;
    if (typeof sub !== "string") return null;
    return {
      sub,
      email: (payload.email as string) ?? "",
      role: (payload.role as SessionPayload["role"]) ?? "user",
      iat: typeof payload.iat === "number" ? payload.iat : 0,
      exp: typeof payload.exp === "number" ? payload.exp : 0,
    };
  } catch {
    return null;
  }
}
