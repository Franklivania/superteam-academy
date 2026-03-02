import { index, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const user_streaks = pgTable(
  "user_streaks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    current_streak_days: integer("current_streak_days").notNull().default(0),
    longest_streak_days: integer("longest_streak_days").notNull().default(0),
    last_activity_at: timestamp("last_activity_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("user_streaks_user_id_idx").on(t.user_id)],
);
