# simple-form-fullstack

Small [Next.js](https://nextjs.org) (App Router) demo: **name + phone** form, **POST** `/api/contacts`, validation, and a **real database** (SQLite file on your machine out of the box; optional **Supabase** for Vercel).

## Run locally (no accounts, no Docker)

```bash
git clone https://github.com/azhar-fullstack/simple-form-fullstack.git
cd simple-form-fullstack
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), submit the form. Rows are stored in **`data/contacts.db`** (created automatically; ignored by git). Local SQLite uses **[sql.js](https://github.com/sql-js/sql.js)** (WASM), so you only need `npm install`—no C++ build tools or Docker.

If you see **“Can’t resolve …”** for a package, you are usually not in the project folder or you skipped **`npm install`** after cloning.

## Deploy on Vercel

Serverless hosting has no persistent disk, so you **must** use Supabase (or similar) in production:

1. Create a [Supabase](https://supabase.com) project, run `supabase/schema.sql` in the **SQL Editor** (creates `contacts`).
2. In Vercel → your project → **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (server secret only)
3. Deploy. If both variables are set, the app uses Supabase instead of SQLite.

Locally, if you add those same variables to `.env.local`, the app will use Supabase instead of the SQLite file.

## Scripts

```bash
npm run dev    # development
npm run build  # production build
npm start      # run production build
```

## Layout

- `src/components/ContactForm.tsx` — form + client validation
- `src/app/api/contacts/route.ts` — POST handler
- `src/lib/validation.ts` — shared rules
- `src/lib/sqlite.ts` — local `data/contacts.db` (default when not on Vercel and no Supabase env)
- `src/lib/supabase/admin.ts` — Supabase when env vars are set

## AI (Cursor) note

Scaffold and features were iterated in Cursor; verify with `npm run build`, local form submit, and (if deployed) Supabase **Table Editor**.
