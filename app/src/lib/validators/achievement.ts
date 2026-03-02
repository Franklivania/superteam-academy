import { z } from "zod";

export const award_achievement_body_schema = z.object({
  achievement_id: z.string().min(1),
  user_id: z.string().uuid().optional(),
});

export type AwardAchievementBody = z.infer<typeof award_achievement_body_schema>;
