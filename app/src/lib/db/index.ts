import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connection_string = process.env.DATABASE_URL;
const sql = connection_string ? neon(connection_string) : null;
const _db = sql ? drizzle(sql) : null;

function assert_db(): NonNullable<typeof _db> {
  if (!_db) throw new Error("DATABASE_URL is required");
  return _db;
}

export const db = _db ?? (new Proxy({} as NonNullable<typeof _db>, {
  get(_, prop) {
    return Reflect.get(assert_db(), prop);
  },
}) as NonNullable<typeof _db>);
