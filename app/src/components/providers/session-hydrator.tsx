"use client";

import { useEffect } from "react";
import { getData } from "@/lib/api/config";
import { useAuthStore } from "@/store/auth-store";

export function SessionHydrator(): null {
  const set_session = useAuthStore((s) => s.set_session);
  const set_loaded = useAuthStore((s) => s.set_loaded);

  useEffect(() => {
    getData<{ user_id: string; email: string; role: string }>("/api/auth/session")
      .then((data) => {
        set_session({
          user_id: data.user_id,
          email: data.email,
          role: data.role,
        });
      })
      .catch(() => {
        set_session(null);
      })
      .finally(() => {
        set_loaded(true);
      });
  }, [set_session, set_loaded]);

  return null;
}
