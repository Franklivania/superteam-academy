"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAPIQuery } from "@/lib/api/useAPI";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";

type ChallengeItem = {
  id: string;
  title: string;
  difficulty: string;
  xp_reward?: number;
  created_at?: string;
};

const difficulty_key: Record<string, string> = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
  hell: "hell",
};

export default function ChallengesPage() {
  const t = useTranslations("challenges");
  const t_common = useTranslations("common");
  const [search, set_search] = useState("");
  const [difficulty_filter, set_difficulty_filter] = useState<string>("");
  const debounced_search = useDebounce(search, 300);

  const { data, isPending, error } = useAPIQuery<{ challenges: ChallengeItem[] }>({
    queryKey: ["challenges"],
    path: "/api/challenges",
  });
  const challenges = data?.challenges ?? [];

  const filtered = useMemo(() => {
    let list = Array.isArray(challenges) ? challenges : [];
    if (debounced_search) {
      const q = debounced_search.toLowerCase();
      list = list.filter((c) => c.title?.toLowerCase().includes(q));
    }
    if (difficulty_filter) {
      list = list.filter((c) => c.difficulty === difficulty_filter);
    }
    list = [...list].sort((a, b) => {
      const a_date = a.created_at ? new Date(a.created_at).getTime() : 0;
      const b_date = b.created_at ? new Date(b.created_at).getTime() : 0;
      return b_date - a_date;
    });
    return list;
  }, [challenges, debounced_search, difficulty_filter]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder={t_common("search")}
          value={search}
          onChange={(e) => set_search(e.target.value)}
          className="max-w-xs rounded-none"
        />
        <select
          value={difficulty_filter}
          onChange={(e) => set_difficulty_filter(e.target.value)}
          className="border border-input bg-background px-3 py-2 text-sm rounded-none"
        >
          <option value="">{t("difficulty")}</option>
          <option value="easy">{t("easy")}</option>
          <option value="medium">{t("medium")}</option>
          <option value="hard">{t("hard")}</option>
          <option value="hell">{t("hell")}</option>
        </select>
      </div>

      {isPending && (
        <p className="mt-4 text-sm text-muted-foreground">{t_common("loading")}</p>
      )}
      {error && (
        <p className="mt-4 text-sm text-destructive">{error.message}</p>
      )}
      {!isPending && !error && filtered.length === 0 && (
        <p className="mt-8 text-muted-foreground">{t("noChallenges")}</p>
      )}
      {!isPending && filtered.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-4 py-2 text-left text-sm font-medium">
                  {t("titleColumn")}
                </th>
                <th className="border border-border px-4 py-2 text-left text-sm font-medium">
                  {t("difficulty")}
                </th>
                <th className="border border-border px-4 py-2 text-left text-sm font-medium">
                  {t("xpReward")}
                </th>
                <th className="border border-border px-4 py-2 text-left text-sm font-medium">
                  {t("createdAt")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="border border-border px-4 py-2">
                    <Link
                      href={`/challenges/${c.id}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {c.title}
                    </Link>
                  </td>
                  <td className="border border-border px-4 py-2 text-sm">
                    {difficulty_key[c.difficulty] ? t(c.difficulty as "easy" | "medium" | "hard" | "hell") : c.difficulty}
                  </td>
                  <td className="border border-border px-4 py-2 text-sm">
                    {c.xp_reward ?? 0}
                  </td>
                  <td className="border border-border px-4 py-2 text-sm text-muted-foreground">
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
