import { NextRequest } from "next/server";
import { create_session_for_user, find_user_by_email } from "@/lib/services/auth-service";
import { login_body_schema } from "@/lib/validators/auth";
import { json_error, json_ok, set_session_cookie } from "@/lib/api/response";

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const parsed = login_body_schema.safeParse(body);
  if (!parsed.success) {
    return json_error("Invalid body", 400);
  }
  const { email } = parsed.data;
  const user = await find_user_by_email(email);
  if (!user) {
    return json_error("User not found", 401);
  }
  if (user.deleted_at) {
    return json_error("Account disabled", 403);
  }
  try {
    const token = await create_session_for_user(user.id, user.email, user.role as "user" | "admin" | "super_admin");
    const response = json_ok({ ok: true });
    set_session_cookie(response, token);
    return response;
  } catch {
    return json_error("Login failed", 500);
  }
}
