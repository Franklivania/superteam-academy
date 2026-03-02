import { cookies } from "next/headers";
import { verify_session_token } from "./jwt";
import { SESSION_COOKIE_NAME } from "@/lib/constants/auth";
import type { SessionPayload } from "@/lib/types/auth";

export async function get_session(): Promise<SessionPayload | null> {
  const cookie_store = await cookies();
  const token = cookie_store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verify_session_token(token);
}

export async function get_session_or_null(): Promise<SessionPayload | null> {
  return get_session();
}
