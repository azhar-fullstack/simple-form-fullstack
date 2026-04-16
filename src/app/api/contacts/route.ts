import { NextResponse } from "next/server";
import { insertContactRow, listContactRows } from "@/lib/contacts-repository";
import { validateContact } from "@/lib/validation";

export async function GET() {
  const { items, persisted } = await listContactRows();
  return NextResponse.json({ ok: true, items, persisted });
}

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

  const { name, phone } = validation.data;
  const result = await insertContactRow(name, phone);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.message,
        details: result.devDetail ? [result.devDetail] : undefined,
        hint: result.hint,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      id: result.id,
      message: "Thank you.",
    },
    { status: 201 },
  );
}
