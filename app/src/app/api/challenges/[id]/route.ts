import { NextRequest } from "next/server";
import { require_admin_role } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";
import { patch_challenge_body_schema } from "@/lib/validators/challenge";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }): Promise<Response> {
  const { id } = await params;
  return json_ok({ id, title: "", difficulty: "easy" });
}

export async function PATCH(request: NextRequest, { params }: { params: Params }): Promise<Response> {
  const result = await require_admin_role();
  if (result.response) return result.response;
  const { id } = await params;
  const body = await request.json();
  const parsed = patch_challenge_body_schema.safeParse(body);
  if (!parsed.success) return json_error("Invalid body", 400);
  return json_ok({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Params }): Promise<Response> {
  const result = await require_admin_role();
  if (result.response) return result.response;
  const { id } = await params;
  return json_ok({ ok: true });
}
