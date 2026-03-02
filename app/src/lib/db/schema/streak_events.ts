import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const streak_events = pgTable(
  "streak_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    event_type: text("event_type").notNull(), // lesson_complete | challenge_complete
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("streak_events_user_id_idx").on(t.user_id),
    index("streak_events_created_at_idx").on(t.created_at),
  ],
);
