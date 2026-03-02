import { get_session } from "@/lib/auth/session";
import { json_error, json_ok } from "@/lib/api/response";

export async function GET(): Promise<Response> {
  const session = await get_session();
  if (!session) {
    return json_error("Unauthorized", 401);
  }
  return json_ok({
    user_id: session.sub,
    email: session.email,
    role: session.role,
  });
}
