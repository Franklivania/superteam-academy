import { NextRequest } from "next/server";
import { require_auth } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";
import { enrollment_close_body_schema } from "@/lib/validators/enrollment";

export async function DELETE(request: NextRequest): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const body = await request.json();
  const parsed = enrollment_close_body_schema.safeParse(body);
  if (!parsed.success) return json_error("Invalid body", 400);
  return json_ok({ ok: true });
}
