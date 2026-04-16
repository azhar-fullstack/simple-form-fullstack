import { insertContactSqlite } from "@/lib/sqlite";

export type InsertContactResult =
  | { ok: true; id: string | null; demo?: boolean }
  | {
      ok: false;
      message: string;
      hint?: string;
      devDetail?: string;
    };

/**
 * Local: SQLite file under `data/contacts.db`.
 * Vercel: no persistent disk — validated submissions succeed as a demo (logged only).
 */
export async function insertContactRow(
  name: string,
  phone: string,
): Promise<InsertContactResult> {
  if (process.env.VERCEL) {
    console.info("[contacts] submit (demo — not persisted to DB)", {
      name,
      phone,
    });
    return { ok: true, id: null, demo: true };
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
