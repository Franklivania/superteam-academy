import { require_auth } from "@/lib/api/guard";
import { json_ok } from "@/lib/api/response";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const { id } = await params;
  return json_ok({ attempts: [] });
}
