import type { ReactNode } from "react";

export default function AdminPage(): ReactNode {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Role management, user search, XP refresh, challenge management, logs</p>
    </div>
  );
}
