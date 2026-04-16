# simple-form-fullstack

Small [Next.js](https://nextjs.org) (App Router) app: **name + phone** form, **POST** `/api/contacts`, and validation.

## Behavior

| Where | What happens |
|--------|----------------|
| **Your PC** (`npm run dev`) | Submissions are stored in **`data/contacts.db`** (SQLite via [sql.js](https://github.com/sql-js/sql.js)). |
| **Vercel** | No database is configured by default: the API **validates** input, returns **success**, and **logs** the payload in **Vercel → Logs**. Nothing is persisted to a database until you add one. |

No accounts or env vars are required for a basic GitHub → Vercel deploy.

## Run locally

```bash
git clone https://github.com/azhar-fullstack/simple-form-fullstack.git
cd simple-form-fullstack
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The DB file is created under `data/` (gitignored).

## Deploy on Vercel

Import the repo and deploy. The form should submit without errors; read **Vercel → Project → Logs** to see demo submissions.

## Adding a real database later

Use any hosted Postgres, run `db/schema.sql` once, then wire inserts in `src/lib/contacts-repository.ts` (e.g. `@vercel/postgres` or your driver of choice). Until then, production remains **demo mode** (no server-side storage).

## Scripts

```bash
npm run dev
npm run build
npm start
```

## Layout

- `src/components/ContactForm.tsx` — form
- `src/app/api/contacts/route.ts` — POST handler
- `src/lib/validation.ts` — shared rules
- `src/lib/sqlite.ts` — local file DB
- `src/lib/contacts-repository.ts` — local SQLite vs Vercel demo branch
