"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletStore } from "@/store/wallet-store";

export function WalletSync(): null {
  const { publicKey, connected } = useWallet();
  const set_wallet = useWalletStore((s) => s.set_wallet);
  const set_connected = useWalletStore((s) => s.set_connected);

  useEffect(() => {
    set_connected(connected);
    set_wallet(connected && publicKey ? publicKey.toBase58() : null);
  }, [connected, publicKey, set_wallet, set_connected]);

  return null;
}
