"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { dummy_admin_status } from "@/lib/data/dummy-leaderboard";
import { AdminLeaderboardSkeleton } from "./leaderboard-skeleton";

export function AdminLeaderboardView(): ReactNode {
  const t = useTranslations("admin.leaderboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(dummy_admin_status.last_refresh_at);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refresh_error, set_refresh_error] = useState<string | null>(null);

  const data = {
    last_refresh_at: lastRefreshed,
    total_indexed: dummy_admin_status.total_indexed,
  };
  const isLoading = false;
  const error = null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsSuccess(false);
    set_refresh_error(null);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toISOString());
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  if (isLoading) return <AdminLeaderboardSkeleton />;

  return (
    <div className="space-y-4">
      <h1 className="font-archivo text-xl font-bold uppercase tracking-wide">{t("title")}</h1>
      {refresh_error && (
        <Alert variant="destructive">
          <span>{refresh_error}</span>
        </Alert>
      )}
      <div className="grid gap-4 border border-border p-4 md:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{t("lastRefresh")}</p>
          <p className="mt-1 font-mono text-sm">
            {data?.last_refresh_at ? new Date(data.last_refresh_at).toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{t("totalUsers")}</p>
          <p className="mt-1 font-mono text-sm">{data?.total_indexed ?? 0}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-2 border-border font-mono text-xs uppercase tracking-wide"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "…" : t("refresh")}
        </Button>
        {isSuccess && (
          <Badge variant="outline" className="rounded-none text-[10px]">
            {t("queued")}
          </Badge>
        )}
      </div>
    </div>
  );
}
