import { type NextRequest } from "next/server";
import { get_course_by_slug } from "@/lib/services/course-service";
import { json_error, json_ok } from "@/lib/api/response";

type Params = Promise<{ slug: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }): Promise<Response> {
  const { slug } = await params;
  const course = await get_course_by_slug(slug, false);
  if (!course) return json_error("Course not found", 404);
  return json_ok(course);
}
