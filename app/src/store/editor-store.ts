"use client";

import { create } from "zustand";

type EditorState = {
  is_open: boolean;
  language: string;
  set_open: (open: boolean) => void;
  set_language: (language: string) => void;
  toggle: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  is_open: false,
  language: "javascript",
  set_open: (is_open) => set({ is_open }),
  set_language: (language) => set({ language }),
  toggle: () => set((s) => ({ is_open: !s.is_open })),
}));
