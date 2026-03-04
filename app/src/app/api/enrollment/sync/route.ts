import { NextRequest } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { require_auth } from "@/lib/api/guard";
import { api_error, api_success } from "@/lib/api/response";
import { enrollment_sync_body_schema } from "@/lib/validators/enrollment";
import { db } from "@/lib/db";
import { course_enrollments, wallets } from "@/lib/db/schema";
import { academy_build_enroll_tx } from "@/lib/services/academy-client";

export async function POST(request: NextRequest): Promise<Response> {
  const result = await require_auth();
  if (result.response) return result.response;
  const { session } = result;

  const body = await request.json();
  const parsed = enrollment_sync_body_schema.safeParse(body);
  if (!parsed.success) return api_error("Invalid body", 400);

  const { course_slug } = parsed.data;

  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.user_id, session.sub))
    .limit(1);

  if (!wallet) {
    return api_error("Wallet not linked", 400);
  }

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

  try {
    const serialized_tx = await academy_build_enroll_tx({
      learner_public_key: wallet.public_key,
      course_id: course_slug,
    });

    return api_success(
      {
        transaction: serialized_tx,
        course_slug,
      },
      "Sign and send this transaction with your wallet. Submit the signature to /api/enrollment/sync/confirm.",
      200,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to build enrollment transaction";
    return api_error(msg, 500);
  }
}
