import { json_ok } from "@/lib/api/response";

export async function GET(): Promise<Response> {
  return json_ok({ challenges: [] });
}
