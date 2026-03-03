"use client";

import { create } from "zustand";

export type SessionUser = {
  user_id: string;
  email: string;
  role: string;
};

export type AuthState = {
  session: SessionUser | null;
  is_loaded: boolean;
  set_session: (session: SessionUser | null) => void;
  set_loaded: (loaded: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  is_loaded: false,
  set_session: (session) => set({ session }),
  set_loaded: (is_loaded) => set({ is_loaded }),
  clear: () => set({ session: null }),
}));
