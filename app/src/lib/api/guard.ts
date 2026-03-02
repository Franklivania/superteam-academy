import { NextResponse } from "next/server";
import { get_session } from "@/lib/auth/session";
import { require_admin } from "@/lib/auth/role-guard";
import type { SessionPayload } from "@/lib/types/auth";
import { json_error } from "./response";

export async function require_auth(): Promise<{ session: SessionPayload; response: null } | { session: null; response: NextResponse }> {
  const session = await get_session();
  if (!session) {
    return { session: null, response: json_error("Unauthorized", 401) };
  }
  return { session, response: null };
}

export async function require_admin_role(): Promise<
  { session: SessionPayload; response: null } | { session: null; response: NextResponse }
> {
  const result = await require_auth();
  if (result.response) return result;
  if (!require_admin(result.session.role)) {
    return { session: null, response: json_error("Forbidden", 403) };
  }
  return result;
}
