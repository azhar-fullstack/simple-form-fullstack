"use client";

import { useState } from "react";
import { normalizePhoneDigits, validateContact } from "@/lib/validation";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string; demo?: boolean }
  | { status: "error"; message: string; details?: string[] };

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitState({ status: "idle" });

    const validation = validateContact({ name, phone });
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }
    setFieldErrors([]);

    setSubmitState({ status: "submitting" });

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const payload = (await res.json()) as {
        ok?: boolean;
        error?: string;
        details?: string[] | string;
        message?: string;
        hint?: string;
        demo?: boolean;
      };

      if (!res.ok) {
        const detailList = Array.isArray(payload.details)
          ? payload.details
          : payload.details
            ? [payload.details]
            : [];
        if (payload.hint) {
          detailList.push(payload.hint);
        }
        setSubmitState({
          status: "error",
          message: payload.error ?? `Request failed (${res.status}).`,
          details: detailList.length ? detailList : undefined,
        });
        return;
      }

      setSubmitState({
        status: "success",
        message: payload.message ?? "Saved successfully.",
        demo: Boolean(payload.demo),
      });
      setName("");
      setPhone("");
    } catch (err) {
      console.error("[ContactForm] submit:", err);
      setSubmitState({
        status: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  }

  const phoneHint =
    phone.length > 0 && normalizePhoneDigits(phone).length < 10
      ? "Enter at least 10 digits."
      : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      noValidate
    >
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Contact
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Leave your name and phone. On your computer, submissions are saved to a local file; on Vercel this demo only
          validates and confirms (see README to add a real database later).
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          aria-invalid={fieldErrors.some((m) => m.toLowerCase().includes("name"))}
          aria-describedby={fieldErrors.length ? "form-errors" : undefined}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          aria-invalid={fieldErrors.some((m) => m.toLowerCase().includes("phone"))}
        />
        {phoneHint ? (
          <p className="text-xs text-amber-700 dark:text-amber-400">{phoneHint}</p>
        ) : null}
      </div>

      {fieldErrors.length > 0 ? (
        <ul id="form-errors" className="list-inside list-disc text-sm text-red-600 dark:text-red-400">
          {fieldErrors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      ) : null}

      {submitState.status === "success" ? (
        <div
          className="space-y-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
          role="status"
        >
          <p>{submitState.message}</p>
          {submitState.demo ? (
            <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80">
              Tip: check Vercel → Logs for this request; submissions are not written to a database until you connect one.
            </p>
          ) : null}
        </div>
      ) : null}

      {submitState.status === "error" ? (
        <div
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200"
          role="alert"
        >
          <p>{submitState.message}</p>
          {submitState.details?.length ? (
            <ul className="mt-2 list-inside list-disc text-xs">
              {submitState.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitState.status === "submitting"}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {submitState.status === "submitting" ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
