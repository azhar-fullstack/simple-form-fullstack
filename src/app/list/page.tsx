import { listContactRows } from "@/lib/contacts-repository";

export const dynamic = "force-dynamic";

export default async function ListPage() {
  const { items, persisted } = await listContactRows();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-100 px-4 py-10 dark:bg-zinc-900">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Saved</h1>

        {!persisted ? (
          <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Connect{" "}
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">Redis</strong> on
            Vercel (Storage → Marketplace → Redis / Upstash) so{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">
              UPSTASH_REDIS_REST_URL
            </code>{" "}
            and{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">
              UPSTASH_REDIS_REST_TOKEN
            </code>{" "}
            are set, then redeploy.
          </p>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No rows yet. Submit the form first.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">ID</th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Name</th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Phone</th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Saved</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                  >
                    <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">{row.id}</td>
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{row.name}</td>
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{row.phone}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
