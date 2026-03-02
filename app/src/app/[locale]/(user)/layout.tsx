import type { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }): ReactNode {
  return <div className="min-h-screen bg-background">{children}</div>;
}
