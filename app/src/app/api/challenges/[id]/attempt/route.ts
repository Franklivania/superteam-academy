import { NextRequest } from "next/server";
import { require_auth } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";
import { attempt_challenge_body_schema } from "@/lib/validators/challenge";

type Params = Promise<{ id: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const { id } = await params;
  const body = await request.json();
  const parsed = attempt_challenge_body_schema.safeParse(body);
  if (!parsed.success) return json_error("Invalid body", 400);
  return json_ok({ attempt_id: "stub" });
}
