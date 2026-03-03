"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAPIQuery } from "@/lib/api/useAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/hooks/use-debounce";

type CourseItem = {
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
  modules: Array<{ slug: string; title: string; order: number; lessons: unknown[] }>;
};

export default function CoursesPage() {
  const t = useTranslations("courses");
  const t_common = useTranslations("common");
  const [search, set_search] = useState("");
  const [sort, set_sort] = useState<"date" | "xp" | "duration">("date");
  const debounced_search = useDebounce(search, 300);

  const { data: courses = [], isPending, error } = useAPIQuery<CourseItem[]>({
    queryKey: ["courses"],
    path: "/api/courses",
  });

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
  }, [courses, debounced_search, sort]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => set_search(e.target.value)}
          className="max-w-xs rounded-none"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("sortBy")}</span>
          <select
            value={sort}
            onChange={(e) => set_sort(e.target.value as "date" | "xp" | "duration")}
            className="border border-input bg-background px-3 py-2 text-sm rounded-none"
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
          {filtered.map((course) => (
            <li key={course.slug}>
              <Link href={`/courses/${course.slug}`}>
                <article className="border border-border bg-card p-4 shadow-none transition-colors hover:border-primary">
                  <h2 className="font-semibold text-foreground">{course.title}</h2>
                  {course.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {course.modules.length} {t("modules")}
                  </p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
