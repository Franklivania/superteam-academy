import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Challenge metadata; CMS is canonical for content, DB for attempts and linkage. */
export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    external_id: text("external_id").unique(), // CMS or slug
    title: text("title").notNull(),
    description: text("description"),
    difficulty: text("difficulty").notNull(), // easy | medium | hard | hell
    starter_code: text("starter_code"),
    language: text("language").notNull().default("javascript"),
    test_cases: jsonb("test_cases").$type<Array<{ input: string; expected: string }>>(),
    xp_reward: integer("xp_reward").notNull().default(0),
    time_estimate_minutes: integer("time_estimate_minutes"),
    track_association: text("track_association"),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("challenges_external_id_idx").on(t.external_id),
    index("challenges_difficulty_idx").on(t.difficulty),
  ],
);
