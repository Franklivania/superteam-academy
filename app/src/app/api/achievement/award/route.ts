import { NextRequest } from "next/server";
import { require_admin_role } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";
import { award_achievement_body_schema } from "@/lib/validators/achievement";

export async function POST(request: NextRequest): Promise<Response> {
  const result = await require_admin_role();
  if (result.response) return result.response;
  const body = await request.json();
  const parsed = award_achievement_body_schema.safeParse(body);
  if (!parsed.success) return json_error("Invalid body", 400);
  return json_ok({ ok: true });
}
