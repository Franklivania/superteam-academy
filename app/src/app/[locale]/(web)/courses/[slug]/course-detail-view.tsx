"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Link } from "@/i18n/navigation";
import { useAPIQuery, useAPIMutation } from "@/lib/api/useAPI";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useWalletStore } from "@/store/wallet-store";
import { CustomPortableText } from "@/components/portable-text";

/* ──────────────────────── Types ──────────────────────── */

type Instructor = {
  name: string;
  avatar_url: string | null;
  bio: any | null;
  role: string | null;
  social: { twitter?: string; github?: string; website?: string } | null;
};

type Course = {
  slug: string;
  title: string;
  shortDescription: string | null;
  description: any | null;
  image_url: string | null;
  published: boolean;
  difficulty: string | null;
  durationHours: number | null;
  tags: string[] | null;
  track: { title: string } | null;
  instructor: Instructor | null;
  modules: Array<{
    slug: string;
    title: string;
    order: number;
    lessons: Array<{ slug: string; title: string; order: number }>;
  }>;
};


function DifficultyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    beginner: "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
    intermediate: "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    advanced: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
  };
  return (
    <span className={`inline-block rounded-none border-2 px-3 py-1 text-xs font-semibold capitalize ${colors[level] ?? "border-primary/40 bg-primary/10 text-primary"}`}>
      {level}
    </span>
  );
}


export function CourseDetailView({ slug }: { slug: string }) {
  const t = useTranslations("courses");
  const t_auth = useTranslations("auth");
  const session = useAuthStore((s) => s.session);
  const wallet_connected = useWalletStore((s) => s.connected);
  const wallet_public_key = useWalletStore((s) => s.public_key);
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();

  const { data: course, isPending, error } = useAPIQuery<Course>({
    queryKey: ["course", slug],
    path: `/api/courses/${slug}`,
  });

  const [enroll_error, set_enroll_error] = useState<string | null>(null);
  const [enroll_success, set_enroll_success] = useState(false);
  const [expanded_modules, set_expanded_modules] = useState<Set<string>>(new Set());

  const { data: enrollment_status, isPending: is_status_pending } = useAPIQuery<{
    enrolled: boolean;
    source: "db" | "on_chain" | "none";
  }>({
    queryKey: ["enrollment-status", slug],
    path: `/api/enrollment/status?course_slug=${encodeURIComponent(slug)}`,
    enabled: Boolean(session),
  });

  const enroll_prepare_mutation = useAPIMutation<{ transaction: string; course_slug: string }, { course_slug: string }>(
    "post",
    "/api/enrollment/sync",
  );

  const enroll_confirm_mutation = useAPIMutation<
    { enrolled: boolean; already_enrolled?: boolean },
    { course_slug: string; tx_signature: string }
  >("post", "/api/enrollment/sync/confirm");

  const handle_enroll = async () => {
    set_enroll_error(null);
    if (!session) {
      set_enroll_error(t_auth("validationError"));
      return;
    }
    if (!wallet_connected || !wallet_public_key) {
      set_enroll_error(t("enrollmentError"));
      return;
    }
    if (!sendTransaction) {
      set_enroll_error(t("enrollmentError"));
      return;
    }
    try {
      const prepared = await enroll_prepare_mutation.mutateAsync({ course_slug: slug });

      if (!prepared.transaction) {
        set_enroll_success(true);
        return;
      }

      const tx_buffer = Buffer.from(prepared.transaction, "base64");
      const transaction = Transaction.from(tx_buffer);
      const tx_signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(tx_signature, "confirmed");

      await enroll_confirm_mutation.mutateAsync({
        course_slug: slug,
        tx_signature,
      });
      set_enroll_success(true);
    } catch (err) {
      set_enroll_error(err instanceof Error ? err.message : "Enrollment failed");
    }
  };

  const toggle_module = (mod_slug: string) => {
    set_expanded_modules((prev) => {
      const next = new Set(prev);
      if (next.has(mod_slug)) next.delete(mod_slug);
      else next.add(mod_slug);
      return next;
    });
  };

  const expand_all = () => {
    if (!course) return;
    set_expanded_modules(new Set(course.modules.map((m) => m.slug)));
  };

  const collapse_all = () => set_expanded_modules(new Set());

  if (isPending) {
    return (
      <div className="container mx-auto flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg text-destructive">{error?.message ?? t("noCourses")}</p>
        <Link href="/courses">
          <Button variant="outline" className="mt-6 rounded-none border-2">
            &larr; {t("title")}
          </Button>
        </Link>
      </div>
    );
  }

  const total_lessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const total_modules = course.modules.length;
  const est_minutes = total_lessons * 15;
  const duration_label = course.durationHours
    ? `${course.durationHours}h`
    : est_minutes < 60
      ? `${est_minutes}m`
      : `${Math.floor(est_minutes / 60)}h ${est_minutes % 60}m`;
  const estimated_xp = total_lessons * 100;
  const diff_label = course.difficulty ?? (total_lessons <= 10 ? "beginner" : total_lessons <= 25 ? "intermediate" : "advanced");
  const is_enrolled = enrollment_status?.enrolled || enroll_success;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/courses" className="transition-colors hover:text-primary">{t("title")}</Link>
        <span>&rsaquo;</span>
        {course.track && (
          <>
            <span>{course.track.title}</span>
            <span>&rsaquo;</span>
          </>
        )}
        <span className="text-foreground">{course.title}</span>
      </nav>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

        <div className="min-w-0 flex-1">

          <div className="mb-10 border-b-2 border-border pb-10">
            <h1 className="text-3xl font-bold leading-tight text-foreground lg:text-4xl">
              {course.title}
            </h1>
            {course.shortDescription && (
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                {course.shortDescription}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <DifficultyBadge level={diff_label} />
              <span className="inline-block rounded-none border-2 border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                &#9201; {duration_label}
              </span>
              <span className="inline-block rounded-none border-2 border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                &#11088; {estimated_xp} XP
              </span>
              <span className="inline-block rounded-none border-2 border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                &#128218; {total_lessons} {t("lessons")}
              </span>
            </div>

            {course.instructor && (
              <div className="mt-5 flex items-center gap-3">
                {course.instructor.avatar_url ? (
                  <Image
                    src={course.instructor.avatar_url}
                    alt={course.instructor.name}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-muted text-sm font-bold text-foreground">
                    {course.instructor.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Created by {course.instructor.name}
                  </p>
                  {course.instructor.role && (
                    <p className="text-xs text-muted-foreground">{course.instructor.role}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {course.description && (
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-foreground">Description</h2>
              <div className="rounded-none border-2 border-border bg-card p-6 shadow-[3px_3px_0_0_hsl(var(--foreground)/0.08)]">
                <CustomPortableText value={course.description} />
              </div>
            </section>
          )}

          <section className="mb-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-foreground">Course content</h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{total_modules} sections &bull; {total_lessons} lectures &bull; {duration_label} total</span>
                <button
                  onClick={expanded_modules.size === total_modules ? collapse_all : expand_all}
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {expanded_modules.size === total_modules ? "Collapse all" : "Expand all"}
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-none border-2 border-border">
              {course.modules.map((mod, idx) => {
                const is_open = expanded_modules.has(mod.slug);
                return (
                  <div key={mod.slug} className={idx > 0 ? "border-t-2 border-border" : ""}>
                    <button
                      onClick={() => toggle_module(mod.slug)}
                      className="flex w-full items-center justify-between bg-muted/50 px-5 py-3.5 text-left transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${is_open ? "rotate-90" : ""}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-semibold text-foreground">{mod.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {mod.lessons.length} {mod.lessons.length === 1 ? "lecture" : "lectures"}
                      </span>
                    </button>

                    {is_open && (
                      <ul className="divide-y divide-border bg-card">
                        {mod.lessons.map((les) => (
                          <li key={les.slug}>
                            <Link
                              href={`/courses/${slug}/lessons/${les.slug}`}
                              className="flex items-center gap-3 px-5 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-primary"
                            >
                              <svg className="h-4 w-4 shrink-0 text-muted-foreground/60" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                              {les.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}

              {course.modules.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No modules have been added to this course yet.
                </div>
              )}
            </div>
          </section>

          {course.instructor && (
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-foreground">Instructor</h2>
              <div className="rounded-none border-2 border-border bg-card p-6 shadow-[3px_3px_0_0_hsl(var(--foreground)/0.08)]">
                <div className="flex items-start gap-4">
                  {course.instructor.avatar_url ? (
                    <Image
                      src={course.instructor.avatar_url}
                      alt={course.instructor.name}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-border bg-muted text-2xl font-bold text-foreground">
                      {course.instructor.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{course.instructor.name}</h3>
                    {course.instructor.role && (
                      <p className="text-sm text-muted-foreground">{course.instructor.role}</p>
                    )}
                    {course.instructor.social && (
                      <div className="mt-2 flex items-center gap-3">
                        {course.instructor.social.twitter && (
                          <a href={course.instructor.social.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline transition-colors hover:text-primary/80">
                            Twitter / X
                          </a>
                        )}
                        {course.instructor.social.github && (
                          <a href={course.instructor.social.github} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline transition-colors hover:text-primary/80">
                            GitHub
                          </a>
                        )}
                        {course.instructor.social.website && (
                          <a href={course.instructor.social.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline transition-colors hover:text-primary/80">
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {course.instructor.bio && (
                  <div className="mt-4 border-t border-border pt-4">
                    <CustomPortableText value={course.instructor.bio} />
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="w-full shrink-0 self-start lg:sticky lg:top-20 lg:w-sm shadow-(--shadow-flat) dark:shadow-(--shadow-flat-yellow)">
          <div className="overflow-hidden rounded-none border-2 border-foreground bg-card shadow-[5px_5px_0_0_hsl(var(--foreground))] dark:shadow-[5px_5px_0_0_hsl(var(--foreground)/0.15)] transition-all">
            {course.image_url && (
              <div className="relative aspect-video w-full border-b-2 border-foreground">
                <Image
                  src={course.image_url}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-4 p-5">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-base">&#128230;</span>
                  {total_modules} {total_modules === 1 ? "module" : "modules"}, {total_lessons} {t("lessons")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base">&#9201;</span>
                  {duration_label} total length
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base">&#11088;</span>
                  {estimated_xp} XP on completion
                </li>
                {course.track && (
                  <li className="flex items-center gap-2">
                    <span className="text-base">&#127919;</span>
                    Track: {course.track.title}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <span className="text-base">&#127942;</span>
                  Certificate of completion
                </li>
              </ul>

              <Button
                onClick={handle_enroll}
                disabled={
                  is_enrolled ||
                  is_status_pending ||
                  enroll_prepare_mutation.isPending ||
                  enroll_confirm_mutation.isPending
                }
                className="w-full rounded-none border-2 border-foreground py-3 text-base font-bold transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_hsl(var(--foreground))]"
                size="lg"
              >
                {enroll_prepare_mutation.isPending || enroll_confirm_mutation.isPending
                  ? "Processing\u2026"
                  : is_enrolled
                    ? `\u2713 ${t("enrolled")}`
                    : t("enroll")}
              </Button>

              {enroll_success && (
                <p className="text-center text-sm font-medium text-primary" role="status">
                  {t("enrollmentSuccess")}
                </p>
              )}
              {enroll_error && (
                <p className="text-center text-sm text-destructive" role="alert">
                  {enroll_error}
                </p>
              )}

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-none border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
