import { z } from "zod";

export const enrollment_sync_body_schema = z.object({
  course_slug: z.string().min(1),
});

export const enrollment_status_query_schema = z.object({
  course_slug: z.string().min(1),
});

export const enrollment_close_body_schema = z.object({
  course_slug: z.string().min(1),
});

export type EnrollmentStatusQuery = z.infer<typeof enrollment_status_query_schema>;
export type EnrollmentCloseBody = z.infer<typeof enrollment_close_body_schema>;
