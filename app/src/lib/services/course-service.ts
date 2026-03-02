/**
 * Course service — CMS (Sanity) canonical for courses, modules, lessons, challenge metadata.
 * PRD: get_courses(), get_course_by_slug(), get_lessons(), get_challenges()
 * Draft mode support; static generation where appropriate.
 */
import { is_sanity_configured } from "@/lib/sanity/client";

export type Course = {
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
  modules: Module[];
};

export type Module = {
  slug: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

export type Lesson = {
  slug: string;
  title: string;
  order: number;
  content: string | null;
  challenge_id: string | null;
};

export type ChallengeMeta = {
  id: string;
  title: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard" | "hell";
  xp_reward: number;
  time_estimate_minutes: number | null;
  language: string;
  track_association: string | null;
};

export async function get_courses(draft = false): Promise<Course[]> {
  if (!is_sanity_configured()) return [];
  // TODO: GROQ query for courses (draft filter when draft=true)
  return [];
}

export async function get_course_by_slug(slug: string, draft = false): Promise<Course | null> {
  const courses = await get_courses(draft);
  return courses.find((c) => c.slug === slug) ?? null;
}

export async function get_lessons(course_slug: string, draft = false): Promise<Lesson[]> {
  const course = await get_course_by_slug(course_slug, draft);
  if (!course) return [];
  return course.modules.flatMap((m) => m.lessons);
}

export async function get_challenges(draft = false): Promise<ChallengeMeta[]> {
  // TODO: Sanity client fetch
  return [];
}
