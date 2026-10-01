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
    <form action={act} className="rise rounded-2xl border border-line bg-white p-5 sm:p-7">
      {table.fields.map((f) => (
        <div key={f.name} className="mb-5 last:mb-0">
          <label htmlFor={f.name} className="mb-1.5 block text-xs font-bold text-navy-deep">
            {f.label}
            {table.readonly?.includes(f.name) && id !== null && (
              <span className="ml-2 rounded-full bg-[#e2e7ff] px-2 py-0.5 text-[10px] font-bold text-navy">
                locked
              </span>
            )}
          </label>
          {f.kind === "text" && (
            <input
              id={f.name}
              name={f.name}
              defaultValue={val(row, f.name, f.kind)}
              readOnly={table.readonly?.includes(f.name) && id !== null}
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-foreground transition-colors focus:border-navy focus:outline-none read-only:bg-[#f2f3ff] read-only:text-muted"
            />
          )}
          {f.kind === "textarea" && (
            <textarea
              id={f.name}
              name={f.name}
              rows={f.rows ?? 3}
              defaultValue={val(row, f.name, f.kind)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-foreground transition-colors focus:border-navy focus:outline-none"
            />
          )}
          {f.kind === "select" && (
            <select
              id={f.name}
              name={f.name}
              defaultValue={val(row, f.name, f.kind)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-foreground transition-colors focus:border-navy focus:outline-none"
            >
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
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-foreground transition-colors focus:border-navy focus:outline-none"
              />
              {f.hint && <p className="mt-1 text-xs text-faint">{f.hint}</p>}
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
                className="w-full rounded-lg border border-line bg-[#131b2e] px-3 py-2.5 font-mono text-[13px] leading-relaxed text-[#dae2fd] transition-colors focus:border-navy focus:outline-none"
              />
              {f.hint && <p className="mt-1 font-mono text-xs text-faint">{f.hint}</p>}
            </>
          )}
        </div>
      ))}
      {err && <p className="mb-4 text-[13px] font-semibold text-danger">{err}</p>}
      <button
        disabled={busy}
        className="rounded-lg bg-pine px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-pine-deep active:scale-[0.99] disabled:opacity-60"
      >
        {busy ? "Saving…" : id ? "Save changes" : "Create"}
      </button>
    </form>
  );
}
