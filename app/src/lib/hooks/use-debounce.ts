"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay_ms: number): T {
  const [debounced_value, set_debounced_value] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => set_debounced_value(value), delay_ms);
    return () => clearTimeout(timer);
  }, [value, delay_ms]);

  return debounced_value;
}
