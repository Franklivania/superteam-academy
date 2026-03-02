import { z } from "zod";

export const patch_profile_body_schema = z.object({
  name: z.string().min(1).max(256).optional(),
  image_url: z.string().url().optional().nullable(),
});

export type PatchProfileBody = z.infer<typeof patch_profile_body_schema>;
