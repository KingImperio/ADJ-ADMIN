"use client";

import { Trash2 } from "lucide-react";
import { removeRow } from "@/lib/actions";

export function DeleteButton({ table, id }: { table: string; id: string }) {
  return (
    <form action={removeRow.bind(null, table, id)}>
      <button
        aria-label={`Delete ${id}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-danger hover:bg-danger hover:text-white"
        onClick={(e) => {
          if (!confirm(`Delete “${id}”?`)) e.preventDefault();
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
