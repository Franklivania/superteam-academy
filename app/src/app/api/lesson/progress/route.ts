import { NextRequest } from "next/server";
import { require_auth } from "@/lib/api/guard";
import { json_error, json_ok } from "@/lib/api/response";
import { lesson_progress_query_schema } from "@/lib/validators/lesson";
import { get_user_course_progress } from "@/lib/services/learning-progress-service";

export async function GET(request: NextRequest): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const { session } = result;
  const url = new URL(request.url);
  const course_slug = url.searchParams.get("course_slug") ?? undefined;
  const parsed = lesson_progress_query_schema.safeParse({ course_slug });
  if (!parsed.success) return json_error("Invalid query", 400);
  const progress_slug = parsed.data.course_slug;
  if (!progress_slug) return json_error("course_slug is required", 400);

  const progress = await get_user_course_progress(session.sub, progress_slug);
  return json_ok({ progress: progress ?? { completed_lessons: 0, total_lessons: 0, progress_percent: 0 } });
}
