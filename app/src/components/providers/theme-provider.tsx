"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

const themeStorageKey = "superteam-academy-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={themeStorageKey}
      themes={["light", "dark", "system"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
