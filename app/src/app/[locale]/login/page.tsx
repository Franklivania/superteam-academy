import type { ReactNode } from "react";

export default function LoginPage(): ReactNode {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-2 text-muted-foreground">Auth flow placeholder</p>
    </div>
  );
}
