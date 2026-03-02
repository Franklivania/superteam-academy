import type { ReactNode } from "react";

export default function DashboardPage(): ReactNode {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">XP, level, streak, enrollment</p>
    </div>
  );
}
