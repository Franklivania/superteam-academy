"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAPIQuery } from "@/lib/api/useAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";

type CourseItem = {
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
  modules: Array<{ slug: string; title: string; order: number; lessons: unknown[] }>;
};

type EnrollmentItem = {
  course_slug: string;
  completed: number;
  total: number;
};

const DIFFICULTY_OPTIONS = ["all", "beginner", "intermediate", "advanced"] as const;

function estimate_duration(lesson_count: number): string {
  const minutes = lesson_count * 15;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export default function CoursesPage() {
  const t = useTranslations("courses");
  const t_common = useTranslations("common");
  const session = useAuthStore((s) => s.session);
  const [search, set_search] = useState("");
  const [sort, set_sort] = useState<"date" | "xp" | "duration">("date");
  const [difficulty_filter, set_difficulty_filter] = useState<(typeof DIFFICULTY_OPTIONS)[number]>("all");
  const debounced_search = useDebounce(search, 300);

  const { data: courses = [], isPending, error } = useAPIQuery<CourseItem[]>({
    queryKey: ["courses"],
    path: "/api/courses",
  });

  const { data: enrollmentsData } = useAPIQuery<{ enrollments: EnrollmentItem[] }>({
    queryKey: ["enrollments"],
    path: "/api/user/enrollments",
    enabled: Boolean(session),
  });

  const enrollment_map = useMemo(() => {
    const map = new Map<string, EnrollmentItem>();
    for (const e of enrollmentsData?.enrollments ?? []) {
      map.set(e.course_slug, e);
    }
    return map;
  }, [enrollmentsData]);

  const filtered = useMemo(() => {
    let list = courses.filter((c) => c.published);
    if (debounced_search) {
      const q = debounced_search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q),
      );
    }
    if (difficulty_filter !== "all") {
      // Simple heuristic: group courses by total lesson count
      list = list.filter((c) => {
        const total = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        if (difficulty_filter === "beginner") return total <= 10;
        if (difficulty_filter === "intermediate") return total > 10 && total <= 25;
        return total > 25;
      });
    }
    list = [...list].sort((a, b) => {
      if (sort === "date") return 0;
      if (sort === "xp") return 0;
      if (sort === "duration") {
        const a_lessons = a.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        const b_lessons = b.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        return a_lessons - b_lessons;
      }
      return 0;
    });
    return list;
  }, [courses, debounced_search, sort, difficulty_filter]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => set_search(e.target.value)}
          className="max-w-xs rounded-none border-2"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("filterByDifficulty")}</span>
          <div className="flex gap-1">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <Button
                key={opt}
                variant={difficulty_filter === opt ? "default" : "outline"}
                size="sm"
                className="rounded-none border-2 text-xs capitalize"
                onClick={() => set_difficulty_filter(opt)}
              >
                {opt === "all" ? t_common("filter") : t(`difficulty_${opt}` as Parameters<typeof t>[0])}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("sortBy")}</span>
          <select
            value={sort}
            onChange={(e) => set_sort(e.target.value as "date" | "xp" | "duration")}
            className="border-2 border-input bg-background px-3 py-2 text-sm rounded-none"
          >
            <option value="date">{t("sortDate")}</option>
            <option value="xp">{t("sortXp")}</option>
            <option value="duration">{t("sortDuration")}</option>
          </select>
        </div>
      </div>

      {isPending && (
        <p className="mt-4 text-sm text-muted-foreground">{t_common("loading")}</p>
      )}
      {error && (
        <p className="mt-4 text-sm text-destructive">{error.message}</p>
      )}
      {!isPending && !error && filtered.length === 0 && (
        <p className="mt-8 text-muted-foreground">{t("noCourses")}</p>
      )}
      {!isPending && filtered.length > 0 && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const total_lessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const duration = estimate_duration(total_lessons);
            const enrollment = enrollment_map.get(course.slug);
            const progress_pct = enrollment && enrollment.total > 0
              ? Math.round((enrollment.completed / enrollment.total) * 100)
              : null;
            const difficulty_label = total_lessons <= 10
              ? t("difficulty_beginner" as Parameters<typeof t>[0])
              : total_lessons <= 25
                ? t("difficulty_intermediate" as Parameters<typeof t>[0])
                : t("difficulty_advanced" as Parameters<typeof t>[0]);

            return (
              <li key={course.slug}>
                <Link href={`/courses/${course.slug}`} className="block h-full group">
                  <Card className="flex flex-col h-full p-0 gap-0 overflow-hidden rounded-none border-2 border-border bg-card shadow-[5px_5px_0_0_#1b231d] dark:shadow-[5px_5px_0_0_#e8f0ea] transition-all group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[3px_3px_0_0_#1b231d] dark:group-hover:shadow-[3px_3px_0_0_#e8f0ea]">
                    {course.image_url && (
                      <div className="relative h-48 w-full border-b-2 border-border shrink-0">
                        <Image
                          src={course.image_url}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="flex flex-col flex-1 space-y-4 p-6 pt-5">
                      <h2 className="font-semibold text-foreground">{course.title}</h2>
                      {course.description && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {course.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block rounded-none border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {difficulty_label}
                        </span>
                        <span className="inline-block rounded-none border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {duration}
                        </span>
                        <span className="inline-block rounded-none border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {total_lessons} {t("lessons")}
                        </span>
                      </div>
                      {progress_pct !== null && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t("enrolled")}</span>
                            <span>{progress_pct}%</span>
                          </div>
                          <Progress value={progress_pct} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
