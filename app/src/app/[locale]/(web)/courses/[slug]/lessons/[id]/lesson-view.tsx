"use client";

import { useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAPIQuery, useAPIMutation } from "@/lib/api/useAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEditorStore } from "@/store/editor-store";
import { useAuthStore } from "@/store/auth-store";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { LessonViewSkeleton } from "@/components/lessons/lesson-view-skeleton";

const LessonCodeEditor = dynamic(() => import("@/components/editor/code-editor").then(m => m.CodeEditor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

type Course_for_lesson = {
  slug: string;
  title: string;
  modules: Array<{
    slug: string;
    title: string;
    order: number;
    lessons: Array<{
      slug: string;
      title: string;
      order: number;
      content: string | null;
      challenge_id: string | null;
    }>;
  }>;
};

type Flat_lesson = {
  slug: string;
  title: string;
  content: string | null;
  challenge_id: string | null;
  module_title: string;
};

type LessonViewProps = { course_slug: string; lesson_id: string };

function render_markdown(content: string): ReactNode {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let current_paragraph: string[] = [];
  let in_code_block = false;
  let code_lines: string[] = [];
  let code_lang = "";

  const flush_paragraph = () => {
    if (current_paragraph.length === 0) return;
    const text = current_paragraph.join(" ").trim();
    if (text.length === 0) {
      current_paragraph = [];
      return;
    }
    elements.push(
      <p key={`p-${elements.length}`} className="mb-2">
        {text}
      </p>,
    );
    current_paragraph = [];
  };

  lines.forEach((line_raw) => {
    const line = line_raw.trimEnd();

    // Code block handling
    if (line.startsWith("```")) {
      if (in_code_block) {
        elements.push(
          <pre key={`code-${elements.length}`} className="my-3 overflow-x-auto rounded-none border-2 border-border bg-muted p-3 text-sm">
            <code className={code_lang ? `language-${code_lang}` : ""}>{code_lines.join("\n")}</code>
          </pre>,
        );
        code_lines = [];
        code_lang = "";
        in_code_block = false;
      } else {
        flush_paragraph();
        code_lang = line.slice(3).trim();
        in_code_block = true;
      }
      return;
    }

    if (in_code_block) {
      code_lines.push(line);
      return;
    }

    if (line.startsWith("### ")) {
      flush_paragraph();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="mt-4 text-base font-semibold">
          {line.slice(4)}
        </h3>,
      );
      return;
    }
    if (line.startsWith("## ")) {
      flush_paragraph();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="mt-6 text-lg font-semibold">
          {line.slice(3)}
        </h2>,
      );
      return;
    }
    if (line.startsWith("# ")) {
      flush_paragraph();
      elements.push(
        <h1 key={`h1-${elements.length}`} className="mt-6 text-xl font-semibold">
          {line.slice(2)}
        </h1>,
      );
      return;
    }
    if (line.trim().length === 0) {
      flush_paragraph();
      return;
    }
    current_paragraph.push(line);
  });

  flush_paragraph();
  return <>{elements}</>;
}

export function LessonView({ course_slug, lesson_id }: LessonViewProps) {
  const t = useTranslations("lesson");
  const t_courses = useTranslations("courses");
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const is_editor_open = useEditorStore((s) => s.is_open);
  const toggle_editor = useEditorStore((s) => s.toggle);

  const [complete_error, set_complete_error] = useState<string | null>(null);
  const [complete_success, set_complete_success] = useState(false);
  const [show_sidebar, set_show_sidebar] = useState(false);

  const { data: course, isPending: is_course_pending, error: course_error } = useAPIQuery<Course_for_lesson>({
    queryKey: ["course", course_slug],
    path: `/api/courses/${course_slug}`,
  });

  // Flatten all lessons for prev/next navigation
  const flat_lessons = useMemo((): Flat_lesson[] => {
    if (!course) return [];
    return course.modules.flatMap((mod) =>
      mod.lessons.map((les) => ({
        ...les,
        module_title: mod.title,
      })),
    );
  }, [course]);

  const current_index = useMemo(
    () => flat_lessons.findIndex((l) => l.slug === lesson_id),
    [flat_lessons, lesson_id],
  );

  const lesson = current_index >= 0 ? flat_lessons[current_index] : null;
  const prev_lesson = current_index > 0 ? flat_lessons[current_index - 1] : null;
  const next_lesson = current_index < flat_lessons.length - 1 ? flat_lessons[current_index + 1] : null;

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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
        queryClient.invalidateQueries({ queryKey: ["achievements"] }),
        queryClient.invalidateQueries({ queryKey: ["enrollments"] }),
      ]);
      set_complete_success(true);
    } catch (err) {
      set_complete_error(err instanceof Error ? err.message : "Failed");
    }
  };

  if (is_course_pending) {
    return <LessonViewSkeleton />;
  }

  if (course_error || !course || !lesson) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-destructive">
          {course_error instanceof Error ? course_error.message : t("title")}
        </p>
        <div className="mt-4">
          <Link href={`/courses/${course_slug}`}>
            <Button variant="outline" className="rounded-none border-2">
              {t_courses("title")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-6">
        {/* Module Sidebar (collapsible) */}
        <aside className={`${show_sidebar ? "block" : "hidden"} w-64 shrink-0 lg:block`}>
          <Card className="sticky top-20 rounded-none border-2 border-border">
            <CardContent className="max-h-[70vh] overflow-y-auto p-3">
              <h3 className="mb-3 text-sm font-bold text-foreground">{t("moduleOverview")}</h3>
              {course.modules.map((mod) => (
                <div key={mod.slug} className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground">{mod.title}</p>
                  <ul className="mt-1 space-y-0.5">
                    {mod.lessons.map((les) => (
                      <li key={les.slug}>
                        <Link
                          href={`/courses/${course_slug}/lessons/${les.slug}`}
                          className={`block truncate px-2 py-1 text-xs transition-colors hover:bg-muted ${les.slug === lesson_id
                              ? "border-l-2 border-primary bg-primary/10 font-semibold text-primary"
                              : "text-muted-foreground"
                            }`}
                        >
                          {les.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="min-w-0">
              {/* Breadcrumb */}
              <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={`/courses/${course_slug}`} className="hover:text-primary">{course.title}</Link>
                <span>/</span>
                <span className="truncate font-medium text-foreground">{lesson.title}</span>
              </nav>

              <h1 className="text-xl font-bold text-foreground">{lesson.title}</h1>

              {/* Mobile sidebar toggle */}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 rounded-none border-2 lg:hidden"
                onClick={() => set_show_sidebar(!show_sidebar)}
              >
                {t("moduleOverview")}
              </Button>

              <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none">
                {lesson.content ? (
                  render_markdown(lesson.content)
                ) : (
                  <p className="text-muted-foreground">{t("title")}</p>
                )}
              </div>

              {complete_success && (
                <p className="mt-4 text-sm font-semibold text-primary">{t("completed")}</p>
              )}
              {complete_error && (
                <p className="mt-4 text-sm text-destructive">{complete_error}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={handle_complete}
                  disabled={complete_success || complete_mutation.isPending}
                  className="rounded-none border-2 border-foreground"
                >
                  {complete_success ? t("completed") : t("complete")}
                </Button>
                <Button
                  variant="outline"
                  onClick={toggle_editor}
                  className="rounded-none border-2"
                >
                  {t("toggleEditor")}
                </Button>
              </div>

              {/* Previous/Next Navigation */}
              <nav className="mt-6 flex items-center justify-between border-t-2 border-border pt-4">
                {prev_lesson ? (
                  <Link href={`/courses/${course_slug}/lessons/${prev_lesson.slug}`}>
                    <Button variant="outline" size="sm" className="rounded-none border-2">
                      ← {t("previous")}
                    </Button>
                  </Link>
                ) : (
                  <span />
                )}
                {next_lesson ? (
                  <Link href={`/courses/${course_slug}/lessons/${next_lesson.slug}`}>
                    <Button variant="outline" size="sm" className="rounded-none border-2">
                      {t("next")} →
                    </Button>
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            </section>
            <section className="min-w-0">
              {is_editor_open && (
                <LessonCodeEditor
                  storageKey={`lesson:${course_slug}:${lesson_id}`}
                  language="typescript"
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
