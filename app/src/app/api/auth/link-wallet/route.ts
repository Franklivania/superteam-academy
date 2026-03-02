import { NextRequest } from "next/server";
import { get_session } from "@/lib/auth/session";
import { link_wallet } from "@/lib/services/auth-service";
import { link_wallet_body_schema } from "@/lib/validators/auth";
import { json_error, json_ok } from "@/lib/api/response";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await get_session();
  if (!session) {
    return json_error("Unauthorized", 401);
  }
  const body = await request.json();
  const parsed = link_wallet_body_schema.safeParse(body);
  if (!parsed.success) {
    return json_error("Invalid body", 400);
  }
  const { public_key } = parsed.data;
  // TODO: verify message signature (wallet auth)
  try {
    await link_wallet(session.sub, public_key);
    return json_ok({ ok: true });
  } catch {
    return json_error("Failed to link wallet", 500);
  }
}
