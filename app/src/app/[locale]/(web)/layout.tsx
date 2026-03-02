import type { ReactNode } from "react";

type WebLayoutProps = {
  children: ReactNode;
};

export default function WebLayout({ children }: WebLayoutProps): ReactNode {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {children}
    </div>
  );
}
