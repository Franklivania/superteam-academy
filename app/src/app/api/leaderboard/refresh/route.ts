import { require_admin_role } from "@/lib/api/guard";
import { json_ok } from "@/lib/api/response";

export async function PATCH(): Promise<Response> {
  const result = await require_admin_role();
  if (result.response) return result.response;
  return json_ok({ ok: true });
}
