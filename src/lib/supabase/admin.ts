import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseAdminInit =
  | { ok: true; client: SupabaseClient }
  | { ok: false; message: string };

/**
 * Server-only Supabase client using the service role key (bypasses RLS).
 * Never import this module from client components.
 */
export function createSupabaseAdmin(): SupabaseAdminInit {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    return {
      ok: false,
      message:
        "Database is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  return { ok: true, client: createClient(url, key) };
}
