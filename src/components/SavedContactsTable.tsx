import type { ContactRow } from "@/lib/contact-types";

type Props = {
  rows: ContactRow[];
  caption?: string;
};

export function SavedContactsTable({ rows, caption }: Props) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">No rows yet. Submit the form first.</p>
    );
  }

  return (
    <div className="space-y-2">
      {caption ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{caption}</p>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Name</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Phone</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Saved</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
              >
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{row.name}</td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{row.phone}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
