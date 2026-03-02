import { NextRequest } from "next/server";
import { require_admin_role } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";

export async function DELETE(request: NextRequest): Promise<Response> {
  const result = await require_admin_role();
  if (result.response) return result.response;
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  if (!user_id) return json_error("user_id required", 400);
  return json_ok({ ok: true });
}
