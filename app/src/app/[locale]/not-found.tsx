import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

export default function NotFound(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        404
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">Page not found.</p>
      <Link
        href="/"
        className="rounded-md bg-foreground px-4 py-2 text-background hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
