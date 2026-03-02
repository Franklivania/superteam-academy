import { require_auth } from "@/lib/api/guard";
import { json_ok } from "@/lib/api/response";

export async function GET(): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  return json_ok({ achievements: [] });
}
