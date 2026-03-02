import { boolean, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const lesson_progress = pgTable(
  "lesson_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    course_slug: text("course_slug").notNull(),
    lesson_slug: text("lesson_slug").notNull(),
    completed: boolean("completed").notNull().default(false),
    completed_at: timestamp("completed_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("lesson_progress_user_id_idx").on(t.user_id),
    index("lesson_progress_course_lesson_idx").on(t.course_slug, t.lesson_slug),
    uniqueIndex("lesson_progress_user_course_lesson_unique").on(t.user_id, t.course_slug, t.lesson_slug),
  ],
);
