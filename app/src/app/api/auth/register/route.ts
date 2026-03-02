import { NextRequest } from "next/server";
import { create_user_and_session } from "@/lib/services/auth-service";
import { register_body_schema } from "@/lib/validators/auth";
import { json_error, json_ok, set_session_cookie } from "@/lib/api/response";

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const parsed = register_body_schema.safeParse(body);
  if (!parsed.success) {
    return json_error("Invalid body", 400);
  }
  const { email, name } = parsed.data;
  try {
    const { token } = await create_user_and_session(email, name ?? null);
    const response = json_ok({ ok: true });
    set_session_cookie(response, token);
    return response;
  } catch {
    return json_error("Registration failed", 500);
  }
}
