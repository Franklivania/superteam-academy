"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAPIMutation } from "@/lib/api/useAPI";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { useAuthStore } from "@/store/auth-store";

type LessonViewProps = { course_slug: string; lesson_id: string };

export function LessonView({ course_slug, lesson_id }: LessonViewProps) {
  const t = useTranslations("lesson");
  const t_courses = useTranslations("courses");
  const session = useAuthStore((s) => s.session);
  const is_editor_open = useEditorStore((s) => s.is_open);
  const toggle_editor = useEditorStore((s) => s.toggle);

  const [complete_error, set_complete_error] = useState<string | null>(null);
  const [complete_success, set_complete_success] = useState(false);

  const complete_mutation = useAPIMutation(
    "post",
    "/api/lesson/complete",
  );

  const handle_complete = async () => {
    if (!session) return;
    set_complete_error(null);
    try {
      await complete_mutation.mutateAsync({
        course_slug,
        lesson_slug: lesson_id,
      });
      set_complete_success(true);
    } catch (err) {
      set_complete_error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="min-w-0">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href={`/courses/${course_slug}`}>{t_courses("title")}</Link>
            <span className="mx-2">/</span>
            <span>{lesson_id}</span>
          </nav>
          <h1 className="text-xl font-semibold">{t("title")}: {lesson_id}</h1>
          <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Lesson content (CMS).</p>
          </div>
          {complete_success && (
            <p className="mt-4 text-sm text-primary">{t("completed")}</p>
          )}
          {complete_error && (
            <p className="mt-4 text-sm text-destructive">{complete_error}</p>
          )}
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handle_complete}
              disabled={complete_success || complete_mutation.isPending}
              className="rounded-none"
            >
              {t("complete")}
            </Button>
            <Button
              variant="outline"
              onClick={toggle_editor}
              className="rounded-none"
            >
              {is_editor_open ? "Hide editor" : "Show editor"}
            </Button>
          </div>
        </section>
        <section className="min-w-0">
          {is_editor_open && (
            <div className="border border-border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Monaco editor (lazy-loaded) — Run tests / Submit via API.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
