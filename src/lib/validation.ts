export type ContactPayload = {
  name: string;
  phone: string;
};

export type ValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; errors: string[] };

const NAME_MAX = 200;
/** Minimum digits after normalizing (simple international-friendly check). */
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function validateContact(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (input === null || typeof input !== "object") {
    return { ok: false, errors: ["Request body must be a JSON object."] };
  }

  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const phoneRaw = typeof raw.phone === "string" ? raw.phone.trim() : "";

  if (!name) {
    errors.push("Name is required.");
  } else if (name.length > NAME_MAX) {
    errors.push(`Name must be at most ${NAME_MAX} characters.`);
  }

  if (!phoneRaw) {
    errors.push("Phone is required.");
  } else {
    const digits = normalizePhoneDigits(phoneRaw);
    if (digits.length < PHONE_MIN_DIGITS) {
      errors.push(
        `Phone must contain at least ${PHONE_MIN_DIGITS} digits (after removing spaces and punctuation).`,
      );
    } else if (digits.length > PHONE_MAX_DIGITS) {
      errors.push(`Phone must contain at most ${PHONE_MAX_DIGITS} digits.`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { name, phone: phoneRaw } };
}
