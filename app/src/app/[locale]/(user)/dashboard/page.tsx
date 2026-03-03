"use client";

import { useTranslations } from "next-intl";
import { useAPIQuery } from "@/lib/api/useAPI";
import { useAuthStore } from "@/store/auth-store";
import { Link } from "@/i18n/navigation";

type Profile = {
  user_id: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const session = useAuthStore((s) => s.session);
  const is_loaded = useAuthStore((s) => s.is_loaded);

  const { data: profile, isPending } = useAPIQuery<Profile>({
    queryKey: ["profile"],
    path: "/api/user/profile",
    enabled: !!session,
  });

  if (!is_loaded) return null;
  if (!session) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{profile?.email ?? session.email}</p>

      {isPending && <p className="mt-4 text-sm text-muted-foreground">Loading...</p>}
      {!isPending && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <section className="border border-border bg-card p-4">
            <h2 className="text-sm font-medium text-muted-foreground">{t("xpProgress")}</h2>
            <p className="mt-2 text-2xl font-semibold">0 XP</p>
            <div className="mt-2 h-2 w-full bg-muted">
              <div className="h-full w-0 bg-primary" style={{ width: "0%" }} />
            </div>
          </section>
          <section className="border border-border bg-card p-4">
            <h2 className="text-sm font-medium text-muted-foreground">{t("level")}</h2>
            <p className="mt-2 text-2xl font-semibold">0</p>
          </section>
          <section className="border border-border bg-card p-4">
            <h2 className="text-sm font-medium text-muted-foreground">{t("streak")}</h2>
            <p className="mt-2 text-2xl font-semibold">{t("streakDays", { count: 0 })}</p>
          </section>
          <section className="border border-border bg-card p-4">
            <h2 className="text-sm font-medium text-muted-foreground">{t("leaderboardRank")}</h2>
            <p className="mt-2 text-2xl font-semibold">—</p>
          </section>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">{t("recentActivity")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">No recent activity.</p>
      </section>
      <p className="mt-4">
        <Link href="/leaderboard" className="text-primary underline-offset-2 hover:underline">
          {t("leaderboardRank")}
        </Link>
      </p>
    </div>
  );
}
