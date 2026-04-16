import type { ContactRow } from "@/lib/contact-types";

export const LOCAL_CONTACTS_KEY = "simpleform:contacts:v1";

export const CONTACTS_UPDATED_EVENT = "simpleform:contacts-updated";

function isRow(x: unknown): x is ContactRow {
  if (x === null || typeof x !== "object") {
    return false;
  }
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.phone === "string" &&
    typeof o.created_at === "string"
  );
}

export function readLocalContacts(): ContactRow[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_CONTACTS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isRow);
  } catch {
    return [];
  }
}

export function appendLocalContact(row: ContactRow): void {
  if (typeof window === "undefined") {
    return;
  }
  const next = [row, ...readLocalContacts()];
  window.localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CONTACTS_UPDATED_EVENT));
}
