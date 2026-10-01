"use client";

import { removeRow } from "@/lib/actions";

export function DeleteButton({ table, id }: { table: string; id: string }) {
  return (
    <form action={removeRow.bind(null, table, id)}>
      <button
        className="btn danger"
        style={{ padding: "4px 10px", fontSize: 12 }}
        onClick={(e) => {
          if (!confirm(`Delete “${id}”?`)) e.preventDefault();
        }}
      >
        Delete
      </button>
    </form>
  );
}
