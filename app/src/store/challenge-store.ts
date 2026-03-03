"use client";

import { create } from "zustand";

type ChallengeState = {
  current_solution: string;
  last_result: "idle" | "running" | "passed" | "failed" | null;
  set_solution: (code: string) => void;
  set_result: (result: ChallengeState["last_result"]) => void;
  reset: () => void;
};

export const useChallengeStore = create<ChallengeState>((set) => ({
  current_solution: "",
  last_result: null,
  set_solution: (current_solution) => set({ current_solution }),
  set_result: (last_result) => set({ last_result }),
  reset: () => set({ current_solution: "", last_result: null }),
}));
