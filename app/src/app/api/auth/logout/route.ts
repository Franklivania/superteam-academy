import { json_ok, clear_session_cookie } from "@/lib/api/response";

export async function POST(): Promise<Response> {
  const response = json_ok({ ok: true });
  clear_session_cookie(response);
  return response;
}
