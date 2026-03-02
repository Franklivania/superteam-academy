import { z } from "zod";

export const register_body_schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(256).optional(),
  password: z.string().min(8).max(128).optional(),
});

export const login_body_schema = z.object({
  email: z.string().email(),
  password: z.string().min(1).optional(),
  provider: z.enum(["credentials", "google", "github"]).optional(),
});

export const link_wallet_body_schema = z.object({
  public_key: z.string().min(32).max(64),
  message: z.string(),
  signature: z.string(),
});

export const link_oauth_body_schema = z.object({
  provider: z.enum(["google", "github"]),
  code: z.string().min(1),
  redirect_uri: z.string().url(),
});

export const unlink_wallet_params_schema = z.object({
  public_key: z.string().min(32).max(64),
});

export type RegisterBody = z.infer<typeof register_body_schema>;
export type LoginBody = z.infer<typeof login_body_schema>;
export type LinkWalletBody = z.infer<typeof link_wallet_body_schema>;
export type LinkOAuthBody = z.infer<typeof link_oauth_body_schema>;
