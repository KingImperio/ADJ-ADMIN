"use client";

import { useActionState } from "react";
import { saveRow } from "@/lib/actions";
import type { Table } from "@/lib/tables";

function val(row: Record<string, unknown>, name: string, kind: string): string {
  const v = row[name];
  if (v == null) return "";
  if (kind === "lines" && Array.isArray(v)) return v.join("\n");
  if (kind === "json") return JSON.stringify(v, null, 2);
  return String(v);
}

export function RowForm({
  table,
  id,
  row,
}: {
  table: Table;
  id: string | null;
  row: Record<string, unknown>;
}) {
  const [err, act, busy] = useActionState(
    (_prev: string, form: FormData) => saveRow(table.name, id, form),
    "",
  );
  return (
    <form action={act} className="card">
      {table.fields.map((f) => (
        <div key={f.name} className="field">
          <label htmlFor={f.name}>{f.label}</label>
          {f.kind === "text" && (
            <input
              id={f.name}
              name={f.name}
              defaultValue={val(row, f.name, f.kind)}
              readOnly={table.readonly?.includes(f.name) && id !== null}
            />
          )}
          {f.kind === "textarea" && (
            <textarea
              id={f.name}
              name={f.name}
              rows={f.rows ?? 3}
              defaultValue={val(row, f.name, f.kind)}
            />
          )}
          {f.kind === "select" && (
            <select id={f.name} name={f.name} defaultValue={val(row, f.name, f.kind)}>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          )}
          {f.kind === "lines" && (
            <>
              <textarea
                id={f.name}
                name={f.name}
                rows={4}
                defaultValue={val(row, f.name, f.kind)}
              />
              {f.hint && <div className="hint">{f.hint}</div>}
            </>
          )}
          {f.kind === "json" && (
            <>
              <textarea
                id={f.name}
                name={f.name}
                rows={12}
                spellCheck={false}
                defaultValue={val(row, f.name, f.kind)}
              />
              {f.hint && <div className="hint">{f.hint}</div>}
            </>
          )}
        </div>
      ))}
      {err && <p className="err">{err}</p>}
      <button className="btn" disabled={busy}>
        {busy ? "Saving…" : id ? "Save changes" : "Create"}
      </button>
    </form>
  );
}
