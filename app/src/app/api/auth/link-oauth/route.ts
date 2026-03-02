import { NextRequest } from "next/server";
import { get_session } from "@/lib/auth/session";
import { link_oauth_body_schema } from "@/lib/validators/auth";
import { json_error, json_ok } from "@/lib/api/response";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await get_session();
  if (!session) {
    return json_error("Unauthorized", 401);
  }
  const body = await request.json();
  const parsed = link_oauth_body_schema.safeParse(body);
  if (!parsed.success) {
    return json_error("Invalid body", 400);
  }
  // TODO: exchange code for tokens, upsert oauth_accounts for session.sub
  return json_ok({ ok: true });
}
