import type { UserRole } from "@/lib/types/auth";

const ROLE_ORDER: Record<UserRole, number> = {
  user: 0,
  admin: 1,
  super_admin: 2,
};

export function has_role(user_role: UserRole, required: UserRole): boolean {
  return ROLE_ORDER[user_role] >= ROLE_ORDER[required];
}

export function require_admin(user_role: UserRole): boolean {
  return has_role(user_role, "admin");
}
