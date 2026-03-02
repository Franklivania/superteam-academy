import { NextRequest } from "next/server";
import { json_error, json_ok } from "@/lib/api/response";
import { leaderboard_query_schema } from "@/lib/validators/leaderboard";

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const limit = url.searchParams.get("limit");
  const offset = url.searchParams.get("offset");
  const parsed = leaderboard_query_schema.safeParse({
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });
  if (!parsed.success) return json_error("Invalid query", 400);
  return json_ok({ entries: [] });
}
