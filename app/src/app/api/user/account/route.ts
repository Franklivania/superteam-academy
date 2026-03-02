import { require_auth } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";

export async function DELETE(): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  return json_ok({ ok: true });
}
