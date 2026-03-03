import { get_courses } from "@/lib/services/course-service";
import { json_ok } from "@/lib/api/response";

export async function GET(): Promise<Response> {
  const courses = await get_courses(false);
  return json_ok(courses);
}
