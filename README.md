# simple-form-fullstack

Next.js contact form (name + phone) + **Saved** table.

```bash
npm install
npm run dev
```

**Local:** data in `data/contacts.db`.

**Vercel (no setup):** **Saved** uses your **browser** (name + phone table).  
**Optional Redis:** add Upstash from the [Marketplace](https://vercel.com/marketplace) and set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` for server-side storage shared across devices.
