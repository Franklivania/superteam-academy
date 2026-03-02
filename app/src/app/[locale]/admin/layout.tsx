import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <h1 className="text-lg font-semibold">Admin</h1>
      </header>
      {children}
    </div>
  );
}
