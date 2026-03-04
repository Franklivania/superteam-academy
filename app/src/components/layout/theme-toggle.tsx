"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle(): React.ReactElement {
  const t = useTranslations("user.header");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label={t("theme")}>
        <SunIcon className="size-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-none border-2" aria-label={t("theme")}>
          {theme === "dark" ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-none border-2">
        <DropdownMenuItem onClick={() => setTheme("light")}>{t("themeLight")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>{t("themeDark")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>{t("themeSystem")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
