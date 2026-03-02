import { z } from "zod";

export const leaderboard_query_schema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type LeaderboardQuery = z.infer<typeof leaderboard_query_schema>;
