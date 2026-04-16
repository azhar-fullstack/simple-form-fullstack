import { BrowserSavedTable } from "@/components/BrowserSavedTable";
import { SavedContactsTable } from "@/components/SavedContactsTable";
import { listContactRows } from "@/lib/contacts-repository";

export const dynamic = "force-dynamic";

export default async function ListPage() {
  const { items, persisted } = await listContactRows();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-100 px-4 py-10 dark:bg-zinc-900">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Saved</h1>

        {persisted ? (
          <SavedContactsTable rows={items} caption="Stored on the server." />
        ) : (
          <BrowserSavedTable />
        )}
      </div>
    </div>
  );
}
