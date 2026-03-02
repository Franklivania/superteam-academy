import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

/** Cache of on-chain XP for leaderboard/history. */
export const xp_snapshots = pgTable(
  "xp_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    wallet_public_key: text("wallet_public_key").notNull(),
    total_xp: integer("total_xp").notNull().default(0),
    snapshot_at: timestamp("snapshot_at", { withTimezone: true }).notNull().defaultNow(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("xp_snapshots_user_id_idx").on(t.user_id),
    index("xp_snapshots_snapshot_at_idx").on(t.snapshot_at),
  ],
);
