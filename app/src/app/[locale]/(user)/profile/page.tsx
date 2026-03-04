"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAPIQuery, useAPIMutation } from "@/lib/api/useAPI";
import { useAuthStore } from "@/store/auth-store";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Credential = {
  name: string;
  mint: string;
  image?: string | null;
  attributes?: Record<string, string | number>;
};

type LinkedConn = {
  provider: string;
};

type ProfileData = {
  user_id: string;
  email: string;
  name: string | null;
  image_url: string | null;
  role: string;
  wallet_public_key: string | null;
  linked_connections: LinkedConn[];
  xp: { total_xp: number; level: number };
  streak: {
    current_streak_days: number;
    longest_streak_days: number;
    last_activity_at: string | null;
  };
  achievement_count: number;
  leaderboard_rank: number | null;
  credentials: Credential[];
};

type AchievementItem = {
  achievement_id: string;
  name: string | null;
  image_url?: string | null;
  xp_reward: number | null;
  awarded_at: string | null;
};

const EXPLORER_BASE = "https://explorer.solana.com/address";
const AWARD_IMAGE_FALLBACK = "/award.webp";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const session = useAuthStore((s) => s.session);

  const { data: profile, isPending } = useAPIQuery<ProfileData>({
    queryKey: ["profile"],
    path: "/api/user/profile",
    enabled: Boolean(session),
  });

  const { data: achievementsData } = useAPIQuery<{ achievements: AchievementItem[] }>({
    queryKey: ["achievements"],
    path: "/api/achievement/user",
    enabled: Boolean(session),
  });

  const updateMutation = useAPIMutation<{ ok: boolean }, { name?: string; image_url?: string }>(
    "patch",
    "/api/user/profile",
  );

  const [editName, setEditName] = useState("");
  const [editing, setEditing] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  if (!session) return null;

  const cardClass =
    "rounded-none border-2 border-border bg-card shadow-[3px_3px_0_0_hsl(var(--foreground)_/_0.15)]";

  const achievements = achievementsData?.achievements ?? [];
  const displayAchievements = showAllAchievements ? achievements : achievements.slice(0, 6);

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>

      {isPending && <p className="text-sm text-muted-foreground">{t("title")}…</p>}

      {profile && (
        <>
          {/* Profile Info */}
          <Card className={cardClass}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="flex shrink-0 items-center justify-center">
                {profile.image_url ? (
                  <img
                    src={profile.image_url}
                    alt={profile.name ?? ""}
                    className="size-20 rounded-none border-2 border-border object-cover"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-none border-2 border-border bg-muted text-xl font-bold text-muted-foreground">
                    {(profile.name ?? profile.email ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                {editing ? (
                  <div className="flex gap-2">
                    <Input
                      className="max-w-xs rounded-none border-2"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={t("name")}
                    />
                    <Button
                      size="sm"
                      className="rounded-none border-2"
                      disabled={updateMutation.isPending}
                      onClick={async () => {
                        await updateMutation.mutateAsync({ name: editName });
                        setEditing(false);
                      }}
                    >
                      {t("save")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none border-2"
                      onClick={() => setEditing(false)}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-foreground">
                      {profile.name ?? profile.email}
                    </h2>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none border-2 text-xs"
                      onClick={() => {
                        setEditName(profile.name ?? "");
                        setEditing(true);
                      }}
                    >
                      {t("editProfile")}
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                {profile.wallet_public_key && (
                  <p className="text-xs text-muted-foreground">
                    🔗 {profile.wallet_public_key.slice(0, 6)}…{profile.wallet_public_key.slice(-4)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground capitalize">
                  {t("role")}: {profile.role}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className={cardClass}>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-muted-foreground">XP</p>
                <p className="text-xl font-bold">{profile.xp.total_xp} XP</p>
                <p className="text-sm">{t("level")}: {profile.xp.level}</p>
              </CardContent>
            </Card>
            <Card className={cardClass}>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-muted-foreground">{t("streak")}</p>
                <p className="text-xl font-bold">{profile.streak.current_streak_days}d</p>
                <p className="text-sm">{t("longest")}: {profile.streak.longest_streak_days}d</p>
              </CardContent>
            </Card>
            <Card className={cardClass}>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-muted-foreground">{t("rank")}</p>
                <p className="text-xl font-bold">
                  {profile.leaderboard_rank != null ? `#${profile.leaderboard_rank}` : "—"}
                </p>
                <p className="text-sm">{profile.achievement_count} {t("achievements")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Linked Accounts */}
          {profile.linked_connections.length > 0 && (
            <Card className={cardClass}>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {t("linkedAccounts")}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {profile.linked_connections.map((conn) => (
                    <span
                      key={conn.provider}
                      className="inline-block rounded-none border-2 border-border bg-muted px-3 py-1 text-xs font-medium capitalize"
                    >
                      {conn.provider}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Credential NFTs */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">{t("credentials")}</h2>
            {profile.credentials.length === 0 ? (
              <Card className={cardClass}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">{t("noCredentials")}</p>
                  <Link href="/courses" className="mt-2 inline-block">
                    <Button variant="outline" size="sm" className="rounded-none border-2">
                      {t("startLearning")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {profile.credentials.map((cred) => (
                  <Card key={cred.mint} className={cardClass}>
                    <CardContent className="space-y-2 p-4">
                      {cred.image && (
                        <img
                          src={cred.image}
                          alt={cred.name}
                          className="h-32 w-full rounded-none border-2 border-border object-cover"
                        />
                      )}
                      <h3 className="font-bold text-foreground">{cred.name}</h3>
                      {cred.attributes && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(cred.attributes).map(([key, val]) => (
                            <span
                              key={key}
                              className="rounded-none border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                      )}
                      <a
                        href={`${EXPLORER_BASE}/${cred.mint}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        {t("viewOnExplorer")}
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Achievement Wall */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{t("achievements")}</h2>
              {achievements.length > 6 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none border-2 text-xs"
                  onClick={() => setShowAllAchievements(!showAllAchievements)}
                >
                  {showAllAchievements ? t("showLess") : t("showAll")}
                </Button>
              )}
            </div>
            {achievements.length === 0 ? (
              <Card className={cardClass}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">{t("noAchievements")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3" style={{ minWidth: "max-content" }}>
                  {displayAchievements.map((item) => (
                    <div
                      key={item.achievement_id}
                      className="flex w-40 shrink-0 flex-col items-center gap-1 rounded-none border-2 border-border bg-card p-3"
                    >
                      <img
                        src={item.image_url ?? AWARD_IMAGE_FALLBACK}
                        alt=""
                        className="size-12 rounded-none border-2 border-border object-cover"
                      />
                      <span className="mt-1 truncate text-center text-xs font-semibold text-foreground">
                        {item.name ?? item.achievement_id}
                      </span>
                      {typeof item.xp_reward === "number" && item.xp_reward > 0 && (
                        <span className="text-[11px] text-muted-foreground">{item.xp_reward} XP</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
