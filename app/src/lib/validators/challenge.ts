import { z } from "zod";

export const challenge_difficulty_schema = z.enum(["easy", "medium", "hard", "hell"]);

export const create_challenge_body_schema = z.object({
  external_id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: challenge_difficulty_schema,
  starter_code: z.string().optional(),
  language: z.string().default("javascript"),
  test_cases: z.array(z.object({ input: z.string(), expected: z.string() })).optional(),
  xp_reward: z.number().int().min(0),
  time_estimate_minutes: z.number().int().min(0).optional(),
  track_association: z.string().optional(),
});

export const patch_challenge_body_schema = create_challenge_body_schema.partial();

export const attempt_challenge_body_schema = z.object({
  solution_code: z.string(),
});

export const submit_challenge_body_schema = z.object({
  solution_code: z.string(),
});

export type CreateChallengeBody = z.infer<typeof create_challenge_body_schema>;
export type PatchChallengeBody = z.infer<typeof patch_challenge_body_schema>;
export type AttemptChallengeBody = z.infer<typeof attempt_challenge_body_schema>;
export type SubmitChallengeBody = z.infer<typeof submit_challenge_body_schema>;
