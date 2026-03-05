"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAPIQuery, useAPIMutation } from "@/lib/api/useAPI";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { useAuthStore } from "@/store/auth-store";
import { useWalletStore } from "@/store/wallet-store";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { LessonViewSkeleton } from "@/components/lessons/lesson-view-skeleton";
import { CustomPortableText } from "@/components/portable-text";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Menu, X, Lock, PlayCircle, Loader2 } from "lucide-react";

/** ──── Dynamic Imports ──── */
const LessonCodeEditor = dynamic(() => import("@/components/editor/code-editor").then(m => m.CodeEditor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

/** ──── Types ──── */
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
      content: any | null; // PortableText
      lessonVideo?: { url?: string; file_url?: string } | null;
      challenge_id: string | null;
    }>;
  }>;
};

type Flat_lesson = {
  slug: string;
  title: string;
  content: any | null;
  lessonVideo?: { url?: string; file_url?: string } | null;
  challenge_id: string | null;
  module_title: string;
};

type LessonViewProps = { course_slug: string; lesson_id: string };

/** ──── Component ──── */
export function LessonView({ course_slug, lesson_id }: LessonViewProps) {
  const t = useTranslations("lesson");
  const t_courses = useTranslations("courses");
  const t_auth = useTranslations("auth");

  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const is_editor_open = useEditorStore((s) => s.is_open);
  const toggle_editor = useEditorStore((s) => s.toggle);
  const set_editor_open = useEditorStore((s) => s.set_open);

  const wallet_connected = useWalletStore((s) => s.connected);
  const wallet_public_key = useWalletStore((s) => s.public_key);
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [complete_error, set_complete_error] = useState<string | null>(null);
  const [complete_success, set_complete_success] = useState(false);
  const [show_mobile_sidebar, set_show_mobile_sidebar] = useState(false);

  const [enroll_error, set_enroll_error] = useState<string | null>(null);
  const [enroll_success, set_enroll_success] = useState(false);

  /* ──── Queries & Mutations ──── */
  const { data: course, isPending: is_course_pending, error: course_error } = useAPIQuery<Course_for_lesson>({
    queryKey: ["course", course_slug],
    path: `/api/courses/${course_slug}`,
  });

  const { data: enrollment_status, isPending: is_status_pending } = useAPIQuery<{
    enrolled: boolean;
    source: "db" | "on_chain" | "none";
  }>({
    queryKey: ["enrollment-status", course_slug],
    path: `/api/enrollment/status?course_slug=${encodeURIComponent(course_slug)}`,
    enabled: Boolean(session),
  });

  const complete_mutation = useAPIMutation("post", "/api/lesson/complete");
  const enroll_prepare_mutation = useAPIMutation<{ transaction: string; course_slug: string }, { course_slug: string }>(
    "post",
    "/api/enrollment/sync",
  );
  const enroll_confirm_mutation = useAPIMutation<
    { enrolled: boolean; already_enrolled?: boolean },
    { course_slug: string; tx_signature: string }
  >("post", "/api/enrollment/sync/confirm");

  /* ──── Derived Data ──── */
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

  const is_enrolled = enrollment_status?.enrolled || enroll_success;

  /* ──── Handlers ──── */
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

  const handle_enroll = async () => {
    set_enroll_error(null);
    if (!session) {
      set_enroll_error(t_auth("validationError"));
      return;
    }
    if (!wallet_connected || !wallet_public_key) {
      set_enroll_error("Please connect your wallet first.");
      return;
    }
    if (!sendTransaction) {
      set_enroll_error("Wallet not ready.");
      return;
    }
    try {
      const prepared = await enroll_prepare_mutation.mutateAsync({ course_slug });
      if (!prepared.transaction) {
        set_enroll_success(true);
        return;
      }
      const tx_buffer = Buffer.from(prepared.transaction, "base64");
      const transaction = Transaction.from(tx_buffer);
      const tx_signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(tx_signature, "confirmed");

      await enroll_confirm_mutation.mutateAsync({
        course_slug,
        tx_signature,
      });
      set_enroll_success(true);
      queryClient.invalidateQueries({ queryKey: ["enrollment-status", course_slug] });
    } catch (err) {
      set_enroll_error(err instanceof Error ? err.message : "Enrollment failed");
    }
  };

  useEffect(() => {
    if (lesson?.challenge_id && is_enrolled) {
      set_editor_open(true);
    }
  }, [lesson?.challenge_id, is_enrolled, set_editor_open]);


  if (is_course_pending || (session && is_status_pending)) {
    return <LessonViewSkeleton />;
  }

  if (course_error || !course || !lesson) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <p className="mb-4 text-lg text-destructive">
          {course_error instanceof Error ? course_error.message : t("title")}
        </p>
        <Link href={`/courses/${course_slug}`}>
          <Button variant="outline" className="rounded-none border-2">
            &larr; {t_courses("title")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-background lg:flex-row">

      <div className="flex items-center justify-between border-b-2 border-border bg-card p-4 lg:hidden">
        <span className="font-bold text-foreground truncate">{lesson.title}</span>
        <Button variant="ghost" size="icon" onClick={() => set_show_mobile_sidebar(!show_mobile_sidebar)}>
          {show_mobile_sidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <aside className={`
        ${show_mobile_sidebar ? "block" : "hidden"} 
        absolute inset-0 z-20 mt-[73px] flex w-full flex-col border-border bg-card
        lg:static lg:mt-0 lg:flex lg:w-80 lg:shrink-0 lg:border-r-2
      `}>
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b-2 border-border px-6">
          <Link href={`/courses/${course_slug}`} className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2">
            &larr; {t("moduleOverview")}
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-black text-foreground">{course.title}</h2>
          </div>
          {course.modules.map((mod, mIndex) => (
            <div key={mod.slug} className="mb-6">
              <h3 className="mb-2 px-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Section {mIndex + 1}: {mod.title}
              </h3>
              <ul className="space-y-1">
                {mod.lessons.map((les, lIndex) => {
                  const is_active = les.slug === lesson_id;
                  return (
                    <li key={les.slug}>
                      <Link
                        href={`/courses/${course_slug}/lessons/${les.slug}`}
                        onClick={() => set_show_mobile_sidebar(false)}
                        className={`group flex items-center gap-3 rounded-none border-2 p-3 text-sm transition-all
                          ${is_active
                            ? "border-foreground bg-foreground text-background shadow-none"
                            : "border-transparent text-muted-foreground hover:border-border hover:bg-muted"
                          }
                        `}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${is_active ? "bg-background text-foreground" : "bg-muted-foreground/20"}`}>
                          {lIndex + 1}
                        </span>
                        <span className="truncate font-medium">{les.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row bg-background">

        <div className={`flex flex-col flex-1 overflow-y-auto ${is_editor_open ? "lg:border-r-2 lg:border-border" : ""}`}>
          <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-12 lg:py-12">

            <header className="mb-8">
              <nav className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>{lesson.module_title}</span>
                <span>/</span>
                <span className="text-foreground">{lesson.title}</span>
              </nav>
              <h1 className="text-3xl font-black text-foreground tracking-tight lg:text-5xl">{lesson.title}</h1>
            </header>

            {!is_enrolled ? (
              <div className="flex flex-col items-center justify-center rounded-none border-2 border-foreground bg-card p-8 text-center shadow-[8px_8px_0_0_hsl(var(--foreground))]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Lock className="h-8 w-8 text-foreground" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">Enroll to Access</h2>
                <p className="mb-6 max-w-md text-muted-foreground">
                  You must be enrolled in this course to view the lesson content and complete challenges.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  <Button
                    onClick={handle_enroll}
                    disabled={enroll_prepare_mutation.isPending || enroll_confirm_mutation.isPending}
                    className="w-full rounded-none border-2 border-foreground py-6 text-lg font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_hsl(var(--foreground))]"
                  >
                    {enroll_prepare_mutation.isPending || enroll_confirm_mutation.isPending ? (
                      <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Processing...</span>
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                  {enroll_error && <p className="text-sm font-semibold text-destructive">{enroll_error}</p>}
                  {!session && (
                    <p className="text-xs font-medium text-muted-foreground mt-2">
                      Please sign in to enroll.
                    </p>
                  )}
                  {session && !wallet_connected && (
                    <p className="text-xs font-medium text-muted-foreground mt-2">
                      Please connect your wallet first via the top right menu.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Enrolled Content */
              <article className="min-h-[50vh]">

                {lesson.lessonVideo && (
                  <div className="mb-10 w-full overflow-hidden rounded-none border-2 border-foreground bg-black shadow-[6px_6px_0_0_hsl(var(--foreground))]">
                    {lesson.lessonVideo.url ? (
                      <div className="aspect-video w-full">
                        {lesson.lessonVideo.url.includes("youtube.com") || lesson.lessonVideo.url.includes("youtu.be") ? (
                          <iframe
                            className="h-full w-full"
                            src={`https://www.youtube.com/embed/${lesson.lessonVideo.url.includes("v=")
                              ? lesson.lessonVideo.url.split("v=")[1].split("&")[0]
                              : lesson.lessonVideo.url.split("/").pop()
                              }`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <iframe className="h-full w-full" src={lesson.lessonVideo.url} allowFullScreen />
                        )}
                      </div>
                    ) : lesson.lessonVideo.file_url ? (
                      <video
                        className="aspect-video w-full object-cover"
                        controls
                        poster=""
                      >
                        <source src={lesson.lessonVideo.file_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>
                )}

                <div className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed text-foreground">
                  {lesson.content ? (
                    <CustomPortableText value={lesson.content} />
                  ) : (
                    <p className="text-muted-foreground italic">No written content available for this lesson.</p>
                  )}
                </div>

                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t-2 border-border pt-8 sm:flex-row">
                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      onClick={handle_complete}
                      disabled={complete_success || complete_mutation.isPending}
                      size="lg"
                      className="rounded-none border-2 border-foreground font-bold transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_hsl(var(--foreground))]"
                    >
                      {complete_success ? `✓ ${t("completed")}` : t("complete")}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={toggle_editor}
                      className={`rounded-none border-2 font-bold transition-all ${is_editor_open ? "bg-muted" : "hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_hsl(var(--foreground))]"}`}
                    >
                      {is_editor_open ? "Close Editor" : "Open Code Editor"}
                    </Button>
                  </div>

                  {complete_error && (
                    <p className="text-sm font-bold text-destructive">{complete_error}</p>
                  )}

                  <div className="flex items-center gap-3">
                    {prev_lesson && (
                      <Link href={`/courses/${course_slug}/lessons/${prev_lesson.slug}`}>
                        <Button variant="ghost" className="font-semibold hover:bg-muted">← Prev</Button>
                      </Link>
                    )}
                    {next_lesson && (
                      <Link href={`/courses/${course_slug}/lessons/${next_lesson.slug}`}>
                        <Button variant="ghost" className="font-semibold hover:bg-muted">Next →</Button>
                      </Link>
                    )}
                  </div>
                </div>

              </article>
            )}
          </div>
        </div>

        {is_editor_open && (
          <div className={`flex flex-col w-full lg:w-1/2 flex-none border-t-2 lg:border-t-0 border-border bg-card ${!is_enrolled ? "opacity-50 pointer-events-none grayscale" : ""}`}>
            {is_enrolled ? (
              <LessonCodeEditor
                storageKey={`lesson:${course_slug}:${lesson_id}`}
                language="typescript"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-10 h-full text-center">
                <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold">Editor Locked</h3>
                <p className="text-muted-foreground mt-2">Enroll to unlock the coding environment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
