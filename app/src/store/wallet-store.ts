"use client";

import { create } from "zustand";

type WalletState = {
  public_key: string | null;
  connected: boolean;
  set_wallet: (public_key: string | null) => void;
  set_connected: (connected: boolean) => void;
  clear: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  public_key: null,
  connected: false,
  set_wallet: (public_key) => set({ public_key }),
  set_connected: (connected) => set({ connected }),
  clear: () => set({ public_key: null, connected: false }),
}));
