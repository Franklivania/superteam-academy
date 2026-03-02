/**
 * Blockchain service — all chain calls wrapped here.
 * UI must NEVER call chain directly; all privileged actions via /api.
 * Phase 7: Devnet connection, XP mint fetch, level derivation, enrollment tx,
 * backend signer for lesson completion, credential issuance, achievement award.
 * Helius integration for leaderboard indexing.
 */

const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID;
const XP_MINT = process.env.NEXT_PUBLIC_XP_MINT;

export type XpBalance = {
  total_xp: number;
  level: number;
};

/** Level = floor(sqrt(totalXP / 100)) */
export function level_from_xp(total_xp: number): number {
  return Math.floor(Math.sqrt(total_xp / 100));
}

export async function get_xp_balance(wallet_public_key: string): Promise<XpBalance | null> {
  if (!XP_MINT) return null;
  // TODO: fetch token balance via Helius DAS or RPC
  return { total_xp: 0, level: 0 };
}

export async function get_enrollment_status(
  wallet_public_key: string,
  course_id: string,
): Promise<boolean> {
  if (!PROGRAM_ID) return false;
  // TODO: fetch Enrollment PDA
  return false;
}

export function get_backend_signer_keypair(): Uint8Array | null {
  const raw = process.env.BACKEND_SIGNER_PRIVATE_KEY;
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw) as number[];
    return new Uint8Array(arr);
  } catch {
    return null;
  }
}
