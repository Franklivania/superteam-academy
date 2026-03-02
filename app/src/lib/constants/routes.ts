/**
 * Route paths. Used by middleware and guards.
 * PRD: /, /login, /register, /courses, /courses/[slug], /challenges, /challenges/[id],
 *      /dashboard, /profile, /settings, /certificates/[id], /leaderboard, /admin
 */

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  courses: "/courses",
  course: (slug: string) => `/courses/${slug}`,
  challenges: "/challenges",
  challenge: (id: string) => `/challenges/${id}`,
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
  certificate: (id: string) => `/certificates/${id}`,
  leaderboard: "/leaderboard",
  admin: "/admin",
} as const;

/** Paths that require authentication (no wallet required for basic access). */
export const AUTH_REQUIRED_PATHS = [
  "/dashboard",
  "/profile",
  "/settings",
  "/certificates",
  "/admin",
] as const;

/** Paths that require admin role. */
export const ADMIN_PATHS = ["/admin"] as const;

export function is_auth_required(pathname: string): boolean {
  return AUTH_REQUIRED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function is_admin_path(pathname: string): boolean {
  return ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
