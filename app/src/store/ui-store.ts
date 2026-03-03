"use client";

import { create } from "zustand";

type UIState = {
  sidebar_open: boolean;
  toast_milestone: string | null;
  set_sidebar_open: (open: boolean) => void;
  set_toast_milestone: (message: string | null) => void;
  toggle_sidebar: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebar_open: false,
  toast_milestone: null,
  set_sidebar_open: (sidebar_open) => set({ sidebar_open }),
  set_toast_milestone: (toast_milestone) => set({ toast_milestone }),
  toggle_sidebar: () => set((s) => ({ sidebar_open: !s.sidebar_open })),
}));
