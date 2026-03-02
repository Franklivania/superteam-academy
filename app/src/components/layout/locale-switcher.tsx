"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCALE_OPTIONS = [
  { value: "en", key: "en", flag_code: "us" },
  { value: "pt-BR", key: "ptBR", flag_code: "br" },
  { value: "es", key: "es", flag_code: "es" },
  { value: "hi", key: "hi", flag_code: "in" },
  { value: "pt", key: "pt", flag_code: "pt" },
] as const;

const FLAG_CDN_BASE = "https://flagcdn.com/w40";

function LocaleFlagIcon({ locale_value }: { locale_value: string }): ReactElement {
  const opt = LOCALE_OPTIONS.find((o) => o.value === locale_value);
  if (!opt) return <span className="size-5 shrink-0" aria-hidden />;
  return (
    <Image
      src={`${FLAG_CDN_BASE}/${opt.flag_code}.png`}
      alt=""
      width={20}
      height={15}
      className="shrink-0 object-cover"
      aria-hidden
    />
  );
}

export function LocaleSwitcher(): ReactElement {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handle_change = (new_locale: string): void => {
    router.replace(pathname, { locale: new_locale });
  };

  return (
    <Select value={locale} onValueChange={handle_change}>
      <SelectTrigger
        id="locale-select"
        aria-label={t("label")}
        className="w-[140px] border-border bg-background sm:w-[180px]"
      >
        <SelectValue placeholder={t("label")} />
      </SelectTrigger>
        <SelectContent>
          {LOCALE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <span className="flex items-center gap-2">
                <LocaleFlagIcon locale_value={opt.value} />
                {t(opt.key)}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
    </Select>
  );
}
