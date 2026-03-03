"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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

  const { data: course, isPending, error } = useAPIQuery<Course>({
    queryKey: ["course", slug],
    path: `/api/courses/${slug}`,
  });

  const [enroll_error, set_enroll_error] = useState<string | null>(null);
  const [enroll_success, set_enroll_success] = useState(false);

  const enroll_mutation = useAPIMutation<{ ok: boolean }, { course_slug: string }>(
    "post",
    (vars) => "/api/enrollment/sync",
  );

  const handle_enroll = async () => {
    set_enroll_error(null);
    if (!session) {
      set_enroll_error(t_auth("validationError"));
      return;
    }
    if (!wallet_connected) {
      set_enroll_error(t("enrollmentError"));
      return;
    }
    try {
      await enroll_mutation.mutateAsync({ course_slug: slug });
      set_enroll_success(true);
    } catch (err) {
      set_enroll_error(err instanceof Error ? err.message : "Enrollment failed");
    }
  };

  if (isPending) return <p className="container mx-auto py-8">{t("title")}...</p>;
  if (error || !course) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-destructive">{error?.message ?? "Course not found"}</p>
        <Link href="/courses">
          <Button variant="outline" className="mt-4 rounded-none">
            Back to courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-foreground">{course.title}</h1>
      {course.description && (
        <p className="mt-2 text-muted-foreground">{course.description}</p>
      )}

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
          disabled={enroll_success || enroll_mutation.isPending}
          className="rounded-none"
        >
          {enroll_success ? t("enrolled") : t("enroll")}
        </Button>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">{t("modules")}</h2>
        <ul className="mt-4 space-y-4">
          {course.modules.map((mod) => (
            <li key={mod.slug} className="border border-border bg-card p-4">
              <h3 className="font-medium">{mod.title}</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {mod.lessons.map((les) => (
                  <li key={les.slug}>
                    <Link href={`/courses/${slug}/lessons/${les.slug}`}>
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
