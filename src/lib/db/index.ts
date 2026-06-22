import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Lazy database handle. We're in the UI-first phase — no DATABASE_URL is set yet.
 * Importing `db` must never crash; only an actual query throws if the database
 * isn't connected. Once DATABASE_URL is configured, this works transparently.
 */
type DB = NeonHttpDatabase<typeof schema>;

let instance: DB | null = null;

function getDb(): DB {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Connect the database before using `db` (UI-first phase uses sample data)."
      );
    }
    instance = drizzle(neon(url), { schema });
  }
  return instance;
}

export const db = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    const real = getDb() as unknown as Record<string | symbol, unknown>;
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
