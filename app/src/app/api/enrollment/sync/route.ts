import { NextRequest } from "next/server";
import { require_auth } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";

export async function POST(request: NextRequest): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const body = await request.json();
  const { enrollment_status_query_schema } = await import("@/lib/validators/enrollment");
  const { enrollment_sync_body_schema } = await import("@/lib/validators/enrollment");
  const parsed = enrollment_sync_body_schema.safeParse(body);
  if (!parsed.success) return json_error("Invalid body", 400);
  return json_ok({ ok: true });
}
