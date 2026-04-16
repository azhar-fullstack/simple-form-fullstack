"use client";

import { useEffect, useState } from "react";
import {
  CONTACTS_UPDATED_EVENT,
  LOCAL_CONTACTS_KEY,
  readLocalContacts,
} from "@/lib/local-storage-contacts";
import { SavedContactsTable } from "@/components/SavedContactsTable";

export function BrowserSavedTable() {
  const [rows, setRows] = useState(readLocalContacts);

  useEffect(() => {
    const refresh = () => setRows(readLocalContacts());

    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_CONTACTS_KEY || e.key === null) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CONTACTS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CONTACTS_UPDATED_EVENT, refresh);
    };
  }, []);

  return (
    <SavedContactsTable
      rows={rows}
      caption="Stored in this browser (works on Vercel without Redis)."
    />
  );
}
