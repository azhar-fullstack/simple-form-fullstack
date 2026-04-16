# simple-form-fullstack

Next.js contact form (name + phone) + **Saved** table.

```bash
npm install
npm run dev
```

**Local:** data in `data/contacts.db`.

**Vercel:** add **Redis** from the [Vercel Marketplace](https://vercel.com/marketplace) (Upstash). Link it to the project so `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, then redeploy. Form submissions and **Saved** use the same Redis list.
