"use client";

import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/sections/landing/navbar";
import { Footer } from "@/components/sections/landing/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { getWebLayoutContent } from "@/lib/content";

type WebLayoutClientProps = { children: ReactNode };

export function WebLayoutClient({ children }: WebLayoutClientProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const { nav, footer } = getWebLayoutContent(locale);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Navbar content={nav} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer content={footer} />
    </div>
  );
}
