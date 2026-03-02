import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

/** Mirror of on-chain enrollment; DB canonical for lookup/cache. */
export const course_enrollments = pgTable(
  "course_enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    wallet_public_key: text("wallet_public_key").notNull(),
    course_slug: text("course_slug").notNull(),
    course_id_on_chain: text("course_id_on_chain"), // e.g. course PDA identifier
    enrolled_at: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
    closed_at: timestamp("closed_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("course_enrollments_user_id_idx").on(t.user_id),
    index("course_enrollments_course_slug_idx").on(t.course_slug),
    uniqueIndex("course_enrollments_user_course_unique").on(t.user_id, t.course_slug),
  ],
);
