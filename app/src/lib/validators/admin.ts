import { z } from "zod";

export const admin_role_body_schema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["user", "admin", "super_admin"]),
});

export const admin_users_query_schema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const admin_logs_query_schema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type AdminRoleBody = z.infer<typeof admin_role_body_schema>;
export type AdminUsersQuery = z.infer<typeof admin_users_query_schema>;
export type AdminLogsQuery = z.infer<typeof admin_logs_query_schema>;
