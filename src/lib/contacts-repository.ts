import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { insertContactSqlite } from "@/lib/sqlite";

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
  const supabaseInit = createSupabaseAdmin();
  if (supabaseInit.ok) {
    const { data, error } = await supabaseInit.client
      .from("contacts")
      .insert({ name, phone })
      .select("id")
      .single();

    if (error) {
      console.error("[insertContactRow] Supabase error:", error.message, error);
      const hint =
        error.message.includes("relation") && error.message.includes("does not exist")
          ? 'Create the "contacts" table in Supabase (run supabase/schema.sql in the SQL Editor).'
          : undefined;
      return {
        ok: false,
        message: "Could not save your submission. Please try again later.",
        hint,
        devDetail: process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }

    return { ok: true, id: data?.id ?? null };
  }

  if (process.env.VERCEL) {
    return {
      ok: false,
      message:
        "Add Supabase to this deployment: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel (see README).",
    };
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
