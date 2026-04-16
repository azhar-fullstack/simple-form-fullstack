import {
  insertContactSqlite,
  listContactsSqlite,
  type ContactRow,
} from "@/lib/sqlite";

export type { ContactRow };

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
  if (process.env.VERCEL) {
    console.info("[contacts] submit", { name, phone });
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

/** Local file DB only; empty on Vercel (no persistent store). */
export async function listContactRows(): Promise<{
  items: ContactRow[];
  persisted: boolean;
}> {
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
