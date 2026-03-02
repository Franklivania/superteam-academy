import { NextRequest } from "next/server";
import { require_auth } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";

export async function GET(): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  return json_ok({
    user_id: result.session.sub,
    email: result.session.email,
    role: result.session.role,
  });
}

export async function PATCH(request: NextRequest): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const body = await request.json();
  const { patch_profile_body_schema } = await import("@/lib/validators/user");
  const parsed = patch_profile_body_schema.safeParse(body);
  if (!parsed.success) return json_error("Invalid body", 400);
  return json_ok({ ok: true });
}
