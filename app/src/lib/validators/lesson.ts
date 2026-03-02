import { z } from "zod";

export const lesson_complete_body_schema = z.object({
  course_slug: z.string().min(1),
  lesson_slug: z.string().min(1),
});

export const lesson_update_body_schema = z.object({
  course_slug: z.string().min(1),
  lesson_slug: z.string().min(1),
  completed: z.boolean().optional(),
});

export const lesson_progress_query_schema = z.object({
  course_slug: z.string().min(1).optional(),
});

export type LessonCompleteBody = z.infer<typeof lesson_complete_body_schema>;
export type LessonUpdateBody = z.infer<typeof lesson_update_body_schema>;
export type LessonProgressQuery = z.infer<typeof lesson_progress_query_schema>;
