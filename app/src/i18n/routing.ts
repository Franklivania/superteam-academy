import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt-BR", "es", "hi", "pt"],
  defaultLocale: "en",
  localePrefix: "always",
});
