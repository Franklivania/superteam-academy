/** User role — PRD: user | admin | super_admin */
export type UserRole = "user" | "admin" | "super_admin";

export type SessionPayload = {
  sub: string; // user_id
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};
