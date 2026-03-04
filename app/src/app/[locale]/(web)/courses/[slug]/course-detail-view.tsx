"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Link } from "@/i18n/navigation";
import { useAPIQuery, useAPIMutation } from "@/lib/api/useAPI";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useWalletStore } from "@/store/wallet-store";

type Course = {
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
  modules: Array<{
    slug: string;
    title: string;
    order: number;
    lessons: Array<{ slug: string; title: string; order: number }>;
  }>;
};

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
      // 1. Request unsigned transaction from backend
      const prepared = await enroll_prepare_mutation.mutateAsync({ course_slug: slug });

      if (!prepared.transaction) {
        // already_enrolled path
        set_enroll_success(true);
        return;
      }

      // 2. Deserialize and sign/send via wallet adapter
      const tx_buffer = Buffer.from(prepared.transaction, "base64");
      const transaction = Transaction.from(tx_buffer);
      const tx_signature = await sendTransaction(transaction, connection);

      // 3. Wait for confirmation
      await connection.confirmTransaction(tx_signature, "confirmed");

      // 4. Confirm with backend to mirror enrollment to DB
      await enroll_confirm_mutation.mutateAsync({
        course_slug: slug,
        tx_signature,
      });
      set_enroll_success(true);
    } catch (err) {
      set_enroll_error(err instanceof Error ? err.message : "Enrollment failed");
    }
  };

  if (isPending) return <p className="container mx-auto py-8">{t("title")}...</p>;
  if (error || !course) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-destructive">{error?.message ?? t("noCourses")}</p>
        <Link href="/courses">
          <Button variant="outline" className="mt-4 rounded-none border-2">
            {t("title")}
          </Button>
        </Link>
      </div>
    );
  }

  const total_lessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const est_minutes = total_lessons * 15;
  const duration_label = est_minutes < 60 ? `${est_minutes}m` : `${Math.floor(est_minutes / 60)}h ${est_minutes % 60}m`;
  const estimated_xp = total_lessons * 100;
  const diff_label = total_lessons <= 10 ? "Beginner" : total_lessons <= 25 ? "Intermediate" : "Advanced";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
      {course.description && (
        <p className="mt-2 max-w-2xl text-muted-foreground">{course.description}</p>
      )}

      {/* Course Metadata */}
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="inline-block rounded-none border-2 border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {diff_label}
        </span>
        <span className="inline-block rounded-none border-2 border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          ⏱ {duration_label}
        </span>
        <span className="inline-block rounded-none border-2 border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          ⭐ {estimated_xp} XP
        </span>
        <span className="inline-block rounded-none border-2 border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          📚 {total_lessons} {t("lessons")}
        </span>
      </div>

      {enroll_success && (
        <p className="mt-4 text-sm text-primary" role="status">
          {t("enrollmentSuccess")}
        </p>
      )}
      {enroll_error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {enroll_error}
        </p>
      )}
      <div className="mt-4">
        <Button
          onClick={handle_enroll}
          disabled={
            enroll_success ||
            is_status_pending ||
            enrollment_status?.enrolled === true ||
            enroll_prepare_mutation.isPending ||
            enroll_confirm_mutation.isPending
          }
          className="rounded-none border-2 border-foreground"
        >
          {enrollment_status?.enrolled || enroll_success ? t("enrolled") : t("enroll")}
        </Button>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">{t("modules")}</h2>
        <ul className="mt-4 space-y-4">
          {course.modules.map((mod) => (
            <li key={mod.slug} className="rounded-none border-2 border-border bg-card p-4 shadow-[3px_3px_0_0_hsl(var(--foreground)/0.08)]">
              <h3 className="font-semibold text-foreground">{mod.title}</h3>
              <ul className="mt-2 space-y-1">
                {mod.lessons.map((les) => (
                  <li key={les.slug}>
                    <Link
                      href={`/courses/${slug}/lessons/${les.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {les.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
