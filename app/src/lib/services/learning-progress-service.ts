import { get_xp_balance } from "@/lib/services/blockchain-service";
import { get_course_by_slug } from "@/lib/services/course-service";
import { get_user_streak } from "@/lib/services/streak-service";
import { get_leaderboard } from "@/lib/services/leaderboard-service";
import { fetch_credential_nfts } from "@/lib/services/blockchain-service";
import { get_user_achievements } from "@/lib/services/achievement-service";
import { db } from "@/lib/db";
import { lesson_progress } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

type User_course_progress = {
  completed_lessons: number;
  total_lessons: number;
  progress_percent: number;
};

export async function get_user_course_progress(
  user_id: string,
  course_slug: string,
): Promise<User_course_progress | null> {
  const course = await get_course_by_slug(course_slug, false);
  if (!course) {
    return null;
  }

  const all_lessons = course.modules.flatMap((module_item) => module_item.lessons);
  const total_lessons = all_lessons.length;
  if (total_lessons === 0) {
    return {
      completed_lessons: 0,
      total_lessons: 0,
      progress_percent: 0,
    };
  }

  const slugs = all_lessons.map((lesson_item) => lesson_item.slug);

  const rows = await db
    .select({
      completed: lesson_progress.completed,
      lesson_slug: lesson_progress.lesson_slug,
    })
    .from(lesson_progress)
    .where(and(eq(lesson_progress.user_id, user_id), eq(lesson_progress.course_slug, course.slug)));

  const completed_set = new Set(
    rows.filter((row) => row.completed && slugs.includes(row.lesson_slug)).map((row) => row.lesson_slug),
  );

  const completed_lessons = completed_set.size;
  const raw_percent = (completed_lessons / total_lessons) * 100;
  const progress_percent = Number.isFinite(raw_percent) ? Math.round(raw_percent) : 0;

  return {
    completed_lessons,
    total_lessons,
    progress_percent,
  };
}

export async function complete_lesson(user_id: string, course_slug: string, lesson_slug: string): Promise<void> {
  const now = new Date();

  await db
    .insert(lesson_progress)
    .values({
      user_id,
      course_slug,
      lesson_slug,
      completed: true,
      completed_at: now,
      updated_at: now,
    })
    .onConflictDoUpdate({
      target: [lesson_progress.user_id, lesson_progress.course_slug, lesson_progress.lesson_slug],
      set: {
        completed: true,
        completed_at: now,
        updated_at: now,
      },
    });
}

export async function get_xp_balance_for_wallet(wallet_public_key: string) {
  return get_xp_balance(wallet_public_key);
}

export async function get_streak_data(user_id: string) {
  return get_user_streak(user_id);
}

export async function get_leaderboard_entries(timeframe: "all_time" | "30d" | "7d" | "24h") {
  return get_leaderboard({ timeframe, limit: 50, offset: 0 });
}

export async function get_credentials(wallet_public_key: string) {
  return fetch_credential_nfts(wallet_public_key);
}

export async function get_user_achievement_summary(user_id: string) {
  return get_user_achievements(user_id);
}

