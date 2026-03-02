import { NextRequest } from "next/server";
import { get_session } from "@/lib/auth/session";
import { unlink_wallet } from "@/lib/services/auth-service";
import { json_error, json_ok } from "@/lib/api/response";

export async function DELETE(request: NextRequest): Promise<Response> {
  const session = await get_session();
  if (!session) {
    return json_error("Unauthorized", 401);
  }
  const url = new URL(request.url);
  const public_key = url.searchParams.get("public_key");
  if (!public_key || public_key.length < 32) {
    return json_error("Invalid public_key", 400);
  }
  const removed = await unlink_wallet(session.sub, public_key);
  return json_ok({ ok: removed });
}
