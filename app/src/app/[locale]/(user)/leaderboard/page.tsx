import type { ReactNode } from "react";

export default function LeaderboardPage(): ReactNode {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <p className="mt-2 text-muted-foreground">XP ranking from chain + cache</p>
    </div>
  );
}
