# simple-form-fullstack

Minimal [Next.js](https://nextjs.org) (App Router) app: a **name + phone** form, **POST** API route, validation, and **Supabase (Postgres)** persistence. Environment variables hold all secrets—nothing is hardcoded.

## Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/azhar-fullstack/simple-form-fullstack.git
   cd simple-form-fullstack
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - In **SQL Editor**, run the script in `supabase/schema.sql` to create the `contacts` table.
   - Under **Project Settings → API**, copy the **Project URL** and **service_role** key (server-only).

3. **Environment**

   ```bash
   cp .env.example .env.local
   ```

   Fill in:

   | Variable | Description |
   |----------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key (use only on the server / Vercel env) |

4. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000), submit the form, then confirm the row in Supabase **Table Editor → contacts**.

5. **Build**

   ```bash
   npm run build
   npm start
   ```

## Deploy on Vercel

1. Push this repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Add the same env vars (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) in **Project → Settings → Environment Variables**.
3. Deploy, then test the live URL end-to-end (form submit → new row in Supabase).

## Project layout

- `src/app/page.tsx` — page shell
- `src/components/ContactForm.tsx` — client form, client-side validation, fetch to API
- `src/app/api/contacts/route.ts` — `POST` handler, server validation, Supabase insert
- `src/lib/validation.ts` — shared validation rules
- `src/lib/supabase/admin.ts` — server-only Supabase client

Errors are surfaced in JSON responses and in the UI (no silent failures). API returns `503` if Supabase env is missing, `400` for validation, `500` with logging if the database insert fails.

## AI (Cursor) usage and verification

- **Usage:** The app structure, API route, Supabase integration, validation, and README were drafted and edited in Cursor with an AI assistant from the existing Next.js scaffold (dependencies + `create-next-app` defaults).
- **Verification:** Run `npm run build` locally; run `npm run dev`, submit the form with valid/invalid data; check Network tab for `/api/contacts` status and JSON body; confirm rows in the Supabase dashboard. After Vercel deploy, repeat on the production URL with env vars set.

## License

Private / use as you like for learning or client work.
