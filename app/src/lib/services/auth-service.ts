import { and, eq } from "drizzle-orm";
import { create_session_token } from "@/lib/auth/jwt";
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema/sessions";
import { users } from "@/lib/db/schema/users";
import { wallets } from "@/lib/db/schema/wallets";
import type { UserRole } from "@/lib/types/auth";

const SESSION_EXPIRY_DAYS = 7;

function hash_token(token: string): string {
  const encoder = new TextEncoder();
  return Array.from(new Uint8Array(encoder.encode(token)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 64);
}

export async function create_user_and_session(
  email: string,
  name: string | null,
  role: UserRole = "user",
): Promise<{ token: string; user_id: string }> {
  const existing = await find_user_by_email(email);
  let user_id: string;
  let user_email: string;
  let user_role: string;

  if (existing) {
    user_id = existing.id;
    user_email = existing.email;
    user_role = existing.role;
    await db.update(users).set({ name: name ?? existing.name, updated_at: new Date() }).where(eq(users.id, user_id));
  } else {
    const [inserted] = await db
      .insert(users)
      .values({ email, name: name ?? null, role })
      .returning({ id: users.id, email: users.email, role: users.role });
    if (!inserted) throw new Error("Failed to create user");
    user_id = inserted.id;
    user_email = inserted.email;
    user_role = inserted.role;
  }

  const token = await create_session_token({
    sub: user_id,
    email: user_email,
    role: user_role as UserRole,
  });

  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + SESSION_EXPIRY_DAYS);

  await db.insert(sessions).values({
    user_id,
    token_hash: hash_token(token),
    expires_at,
  });

  return { token, user_id };
}

export async function create_session_for_user(
  user_id: string,
  email: string,
  role: UserRole,
): Promise<string> {
  const token = await create_session_token({ sub: user_id, email, role });
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + SESSION_EXPIRY_DAYS);
  await db.insert(sessions).values({
    user_id,
    token_hash: hash_token(token),
    expires_at,
  });
  return token;
}

export async function invalidate_session(token: string): Promise<void> {
  const hash = hash_token(token);
  await db.delete(sessions).where(eq(sessions.token_hash, hash));
}

export async function find_user_by_id(id: string) {
  const [u] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return u ?? null;
}

export async function find_user_by_email(email: string) {
  const [u] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return u ?? null;
}

export async function link_wallet(user_id: string, public_key: string): Promise<void> {
  await db.insert(wallets).values({ user_id, public_key });
}

export async function unlink_wallet(user_id: string, public_key: string): Promise<boolean> {
  const result = await db
    .delete(wallets)
    .where(and(eq(wallets.user_id, user_id), eq(wallets.public_key, public_key)))
    .returning({ id: wallets.id });
  return result.length > 0;
}
