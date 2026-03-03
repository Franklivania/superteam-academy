"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAPIQuery, useAPIMutation } from "@/lib/api/useAPI";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { useAuthStore } from "@/store/auth-store";

type Challenge = {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  starter_code?: string;
  xp_reward?: number;
};

export function ChallengeDetailView({ challenge_id }: { challenge_id: string }) {
  const t = useTranslations("challenges");
  const session = useAuthStore((s) => s.session);
  const is_editor_open = useEditorStore((s) => s.is_open);
  const toggle_editor = useEditorStore((s) => s.toggle);

  const [solution, set_solution] = useState("");
  const [submit_error, set_submit_error] = useState<string | null>(null);
  const [submit_success, set_submit_success] = useState(false);

  const { data: challenge, isPending, error } = useAPIQuery<Challenge>({
    queryKey: ["challenge", challenge_id],
    path: `/api/challenges/${challenge_id}`,
  });

  const submit_mutation = useAPIMutation<{ passed: boolean; xp_awarded: number }>("patch", `/api/challenges/${challenge_id}/submit`);

  const handle_submit = async () => {
    if (!session) return;
    set_submit_error(null);
    try {
      const result = await submit_mutation.mutateAsync({ solution_code: solution });
      set_submit_success(result.passed);
    } catch (err) {
      set_submit_error(err instanceof Error ? err.message : "Submit failed");
    }
  };

  if (isPending) return <p className="container mx-auto py-8">{t("title")}...</p>;
  if (error || !challenge) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-destructive">{error?.message ?? "Not found"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">{challenge.title}</h1>
      {challenge.description && (
        <p className="mt-2 text-muted-foreground">{challenge.description}</p>
      )}
      <p className="mt-2 text-sm text-muted-foreground">
        {t("difficulty")}: {t(challenge.difficulty as "easy" | "medium" | "hard" | "hell")} · {t("xpReward")}: {challenge.xp_reward ?? 0}
      </p>

      <div className="mt-4">
        <Button variant="outline" onClick={toggle_editor} className="rounded-none">
          {t("toggleEditor")}
        </Button>
      </div>
      {is_editor_open && (
        <div className="mt-4 border border-border bg-muted/30 p-4">
          <textarea
            value={solution}
            onChange={(e) => set_solution(e.target.value)}
            placeholder="Solution code"
            className="min-h-[200px] w-full border border-input bg-background p-3 font-mono text-sm rounded-none"
            spellCheck={false}
          />
          <Button
            onClick={handle_submit}
            disabled={submit_mutation.isPending}
            className="mt-2 rounded-none"
          >
            {t("submit")}
          </Button>
        </div>
      )}

      {submit_success && (
        <p className="mt-4 text-sm text-primary">{t("submitSuccess")}</p>
      )}
      {submit_error && (
        <p className="mt-4 text-sm text-destructive">{submit_error}</p>
      )}
    </div>
  );
}
