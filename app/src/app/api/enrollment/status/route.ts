import { NextRequest } from "next/server";
import { require_auth } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";
import { enrollment_status_query_schema } from "@/lib/validators/enrollment";

export async function GET(request: NextRequest): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const url = new URL(request.url);
  const course_slug = url.searchParams.get("course_slug") ?? "";
  const parsed = enrollment_status_query_schema.safeParse({ course_slug });
  if (!parsed.success) return json_error("Invalid query", 400);
  return json_ok({ enrolled: false });
}
