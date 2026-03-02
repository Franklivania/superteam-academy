import { NextRequest } from "next/server";
import { require_admin_role } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";
import { admin_role_body_schema } from "@/lib/validators/admin";

export async function PATCH(request: NextRequest): Promise<Response> {
  const result = await require_admin_role();
  if (result.response) return result.response;
  const body = await request.json();
  const parsed = admin_role_body_schema.safeParse(body);
  if (!parsed.success) return json_error("Invalid body", 400);
  return json_ok({ ok: true });
}
