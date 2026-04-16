import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { validateContact } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const validation = validateContact(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", details: validation.errors },
      { status: 400 },
    );
  }

  const supabaseInit = createSupabaseAdmin();
  if (!supabaseInit.ok) {
    console.error("[api/contacts] Supabase config:", supabaseInit.message);
    return NextResponse.json(
      { ok: false, error: supabaseInit.message },
      { status: 503 },
    );
  }

  const { client } = supabaseInit;
  const { name, phone } = validation.data;

  const { data, error } = await client
    .from("contacts")
    .insert({ name, phone })
    .select("id")
    .single();

  if (error) {
    console.error("[api/contacts] Supabase insert error:", error.message, error);
    const hint =
      error.message.includes("relation") && error.message.includes("does not exist")
        ? 'Create the "contacts" table in Supabase (see supabase/schema.sql in this repo).'
        : undefined;
    return NextResponse.json(
      {
        ok: false,
        error: "Could not save your submission. Please try again later.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        hint,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, id: data?.id ?? null, message: "Thanks — your details were saved." },
    { status: 201 },
  );
}
