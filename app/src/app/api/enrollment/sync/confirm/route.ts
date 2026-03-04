import { NextRequest } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { require_auth } from "@/lib/api/guard";
import { api_error, api_success } from "@/lib/api/response";
import { db } from "@/lib/db";
import { course_enrollments, wallets } from "@/lib/db/schema";

type Confirm_body = {
  course_slug: string;
  tx_signature: string;
};

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl("devnet");

export async function POST(request: NextRequest): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const { session } = result;

  const body = (await request.json()) as Confirm_body;
  if (!body || typeof body.course_slug !== "string" || body.course_slug.length === 0) {
    return api_error("Invalid body", 400);
  }
  if (!body.tx_signature || typeof body.tx_signature !== "string") {
    return api_error("Missing tx_signature", 400);
  }

  const { course_slug, tx_signature } = body;

  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.user_id, session.sub))
    .limit(1);

  if (!wallet) {
    return api_error("Wallet not linked", 400);
  }

  // Verify the transaction exists on-chain
  try {
    const connection = new Connection(RPC_URL, { commitment: "confirmed" });
    const tx_info = await connection.getTransaction(tx_signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!tx_info) {
      return api_error("Transaction not found on-chain. Please wait and retry.", 404);
    }

    if (tx_info.meta?.err) {
      return api_error("Transaction failed on-chain", 400);
    }
  } catch {
    return api_error("Failed to verify transaction on-chain", 500);
  }

  // Check for existing enrollment
  const [existing] = await db
    .select()
    .from(course_enrollments)
    .where(
      and(
        eq(course_enrollments.user_id, session.sub),
        eq(course_enrollments.course_slug, course_slug),
        isNull(course_enrollments.closed_at),
      ),
    )
    .limit(1);

  if (existing) {
    return api_success(
      {
        already_enrolled: true,
      },
      "Enrollment already mirrored",
      200,
    );
  }

  const now = new Date();

  await db.insert(course_enrollments).values({
    user_id: session.sub,
    wallet_public_key: wallet.public_key,
    course_slug,
    course_id_on_chain: tx_signature,
    enrolled_at: now,
    created_at: now,
    updated_at: now,
  });

  return api_success(
    {
      enrolled: true,
      tx_signature,
    },
    "Enrollment confirmed and mirrored",
    200,
  );
}
