"use client";

import { useEffect } from "react";

type LocaleLangProps = {
  locale: string;
};

export function LocaleLang({ locale }: LocaleLangProps): null {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
