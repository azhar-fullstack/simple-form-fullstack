import type { ContactRow } from "@/lib/contact-types";
import {
  insertContactRedis,
  isRedisConfigured,
  listContactsRedis,
} from "@/lib/redis-contacts";
import { insertContactSqlite, listContactsSqlite } from "@/lib/sqlite";

export type { ContactRow };

/** True when the server saves to Redis or local SQLite (not Vercel demo-only). */
export function usesServerPersistence(): boolean {
  return isRedisConfigured() || !process.env.VERCEL;
}

export type InsertContactResult =
  | { ok: true; id: string | null }
  | {
      ok: false;
      message: string;
      hint?: string;
      devDetail?: string;
    };

export async function insertContactRow(
  name: string,
  phone: string,
): Promise<InsertContactResult> {
  if (isRedisConfigured()) {
    try {
      const id = await insertContactRedis(name, phone);
      return { ok: true, id };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[insertContactRow] Redis error:", msg, err);
      return {
        ok: false,
        message: "Could not save your submission. Please try again later.",
        devDetail: process.env.NODE_ENV === "development" ? msg : undefined,
      };
    }
  }

  if (process.env.VERCEL) {
    console.info("[contacts] submit (no Redis — not persisted)", { name, phone });
    return { ok: true, id: null };
  }

  try {
    const id = await insertContactSqlite(name, phone);
    return { ok: true, id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[insertContactRow] SQLite error:", msg, err);
    return {
      ok: false,
      message: "Could not save your submission. Please try again later.",
      devDetail: process.env.NODE_ENV === "development" ? msg : undefined,
    };
  }
}

export async function listContactRows(): Promise<{
  items: ContactRow[];
  persisted: boolean;
}> {
  if (isRedisConfigured()) {
    try {
      const items = await listContactsRedis();
      return { items, persisted: true };
    } catch (err) {
      console.error("[listContactRows] Redis error:", err);
      return { items: [], persisted: true };
    }
  }

  if (process.env.VERCEL) {
    return { items: [], persisted: false };
  }

  try {
    const items = await listContactsSqlite();
    return { items, persisted: true };
  } catch (err) {
    console.error("[listContactRows]", err);
    return { items: [], persisted: true };
  }
}
