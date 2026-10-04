"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { saveRow } from "@/lib/actions";
import type { Table } from "@/lib/tables";

type Vals = Record<string, string>;

function initial(table: Table, row: Record<string, unknown>): Vals {
  const out: Vals = {};
  for (const f of table.fields) {
    const v = row[f.name];
    if (v == null) out[f.name] = "";
    else if (f.kind === "lines" && Array.isArray(v)) out[f.name] = v.join("\n");
    else if (f.kind === "json") out[f.name] = JSON.stringify(v, null, 2);
    else out[f.name] = String(v);
  }
  return out;
}

const TONE_BADGE: Record<string, string> = {
  emerald: "bg-[#ECFDF5] border-[#006c48] text-[#006c48]",
  navy: "bg-[#EFF6FF] border-[#002045] text-[#002045]",
  indigo: "bg-[#EEF2FF] border-[#3730A3] text-[#3730A3]",
  amber: "bg-[#FEF3C7] border-[#B45309] text-[#B45309]",
  neutral: "bg-[#eaedff] border-[#c4c6cf] text-[#002045]",
};
const TONE_DOT: Record<string, string> = {
  emerald: "bg-[#006c48]",
  navy: "bg-[#002045]",
  indigo: "bg-[#3730A3]",
  amber: "bg-[#B45309]",
  neutral: "bg-[#74777f]",
  primary: "bg-[#1a365d]",
  secondary: "bg-[#006c48]",
  tertiary: "bg-[#eb851c]",
};

const inputCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-faint/70 focus:border-navy focus:outline-none read-only:bg-[#f2f3ff] read-only:text-muted";

export function RowForm({
  table,
  id,
  row,
}: {
  table: Table;
  id: string | null;
  row: Record<string, unknown>;
}) {
  const [vals, setVals] = useState<Vals>(() => initial(table, row));
  const [jsonErr, setJsonErr] = useState("");
  const [err, act, busy] = useActionState(
    (_prev: string, form: FormData) => saveRow(table.name, id, form),
    "",
  );
  const set = (name: string, v: string) => setVals((s) => ({ ...s, [name]: v }));

  const submit = (form: FormData) => {
    for (const f of table.fields) {
      if (f.kind === "json" && vals[f.name].trim()) {
        try {
          JSON.parse(vals[f.name]);
        } catch {
          setJsonErr(`“${f.label}” is not valid JSON — fix it before saving.`);
          return;
        }
      }
    }
    setJsonErr("");
    act(form);
  };

  const bullets = (vals.bullets ?? "").split("\n");
  const setBullet = (i: number, v: string) => {
    const next = [...bullets];
    next[i] = v;
    set("bullets", next.join("\n"));
  };

  return (
    <form action={submit}>
      <div className="sticky top-0 z-10 -mx-4 border-b border-line bg-[#f4f6fb]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm text-muted">
            {id ? (
              <>
                Editing <span className="font-mono text-xs text-faint">{id}</span>
              </>
            ) : (
              "New record — unsaved changes are lost if you leave"
            )}
          </p>
          <button
            disabled={busy}
            className="shrink-0 rounded-xl bg-pine px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-pine-deep active:scale-95 disabled:opacity-60"
          >
            {busy ? "Saving…" : id ? "Save changes" : "Create"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
        <div className="rise rounded-2xl border border-line bg-white p-5 sm:p-7 lg:col-span-3">
          {table.fields.map((f) => (
            <div key={f.name} className="mb-6 last:mb-0">
              <label htmlFor={f.name} className="mb-1.5 block text-xs font-bold text-navy-deep">
                {f.label}
                {table.readonly?.includes(f.name) && id !== null && (
                  <span className="ml-2 rounded-full bg-[#e2e7ff] px-2 py-0.5 text-[10px] font-bold text-navy">
                    locked
                  </span>
                )}
              </label>

              {f.kind === "text" && !/icon/i.test(f.name) && (
                <input
                  id={f.name}
                  name={f.name}
                  value={vals[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  readOnly={table.readonly?.includes(f.name) && id !== null}
                  className={inputCls}
                />
              )}

              {f.kind === "text" && /icon/i.test(f.name) && (
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e2e7ff] text-xl text-navy">
                    <span className="material-symbols-outlined">{vals[f.name] || "?"}</span>
                  </span>
                  <input
                    id={f.name}
                    name={f.name}
                    value={vals[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder="e.g. groups"
                    className={`${inputCls} font-mono`}
                  />
                </div>
              )}

              {f.kind === "textarea" && (
                <textarea
                  id={f.name}
                  name={f.name}
                  rows={f.rows ?? 3}
                  value={vals[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className={inputCls}
                />
              )}

              {f.kind === "select" && /tone|accent/.test(f.name) && (
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={f.label}>
                  {f.options.map((o) => (
                    <label key={o}>
                      <input
                        type="radio"
                        name={f.name}
                        value={o}
                        checked={vals[f.name] === o}
                        onChange={() => set(f.name, o)}
                        className="peer sr-only"
                      />
                      <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-muted transition-all peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white hover:border-navy/50">
                        <span className={`h-2.5 w-2.5 rounded-full ${TONE_DOT[o] ?? "bg-faint"}`} />
                        {o}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {f.kind === "select" && !/tone|accent/.test(f.name) && (
                <select
                  id={f.name}
                  name={f.name}
                  value={vals[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className={inputCls}
                >
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              )}

              {f.kind === "lines" && (
                <div className="space-y-2">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 shrink-0 text-right font-mono text-xs text-faint tabular-nums">
                        {i + 1}
                      </span>
                      <input
                        name={f.name}
                        value={b}
                        onChange={(e) => setBullet(i, e.target.value)}
                        placeholder={`Bullet ${i + 1}`}
                        className={inputCls}
                      />
                      <button
                        type="button"
                        aria-label={`Remove bullet ${i + 1}`}
                        onClick={() => set("bullets", bullets.filter((_, j) => j !== i).join("\n"))}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-faint transition-colors hover:border-danger hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set("bullets", [...bullets, ""].join("\n"))}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-xs font-bold text-pine transition-colors hover:border-pine"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add bullet
                  </button>
                  {f.hint && <p className="text-xs text-faint">{f.hint}</p>}
                </div>
              )}

              {f.kind === "json" && (
                <>
                  <div className="overflow-hidden rounded-xl border border-line">
                    <div className="flex items-center justify-between border-b border-line/60 bg-[#f7f8fd] px-3 py-1.5">
                      <span className="font-mono text-[11px] text-faint">JSON</span>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            set(f.name, JSON.stringify(JSON.parse(vals[f.name]), null, 2));
                            setJsonErr("");
                          } catch {
                            setJsonErr(`“${f.label}” is not valid JSON.`);
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] font-bold text-pine transition-colors hover:bg-pine/10"
                      >
                        <Wand2 className="h-3 w-3" />
                        Format
                      </button>
                    </div>
                    <textarea
                      id={f.name}
                      name={f.name}
                      rows={12}
                      spellCheck={false}
                      value={vals[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      className="w-full bg-[#131b2e] px-3 py-2.5 font-mono text-[13px] leading-relaxed text-[#dae2fd] focus:outline-none"
                    />
                  </div>
                  {f.hint && <p className="mt-1 font-mono text-xs text-faint">{f.hint}</p>}
                </>
              )}
            </div>
          ))}
          {(err || jsonErr) && (
            <p role="alert" className="mb-4 text-[13px] font-semibold text-danger">
              {jsonErr || err}
            </p>
          )}
          <button
            disabled={busy}
            className="rounded-xl bg-pine px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-pine-deep active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? "Saving…" : id ? "Save changes" : "Create"}
          </button>
        </div>

        <aside className="lg:col-span-2 lg:sticky lg:top-20">
          <Preview table={table.name} vals={vals} />
        </aside>
      </div>
    </form>
  );
}

function Preview({ table, vals }: { table: string; vals: Vals }) {
  return (
    <div className="rise overflow-hidden rounded-2xl border border-line bg-white" style={{ animationDelay: "80ms" }}>
      <p className="border-b border-line/60 bg-[#f7f8fd] px-5 py-2.5 text-[11px] font-bold tracking-wider text-faint uppercase">
        Live preview
      </p>
      <div className="p-5">
        {table === "tracks" && <TrackPreview vals={vals} />}
        {table === "pillars" && <PillarPreview vals={vals} />}
        {table === "wall_entries" && <WallPreview vals={vals} />}
        {table === "testimonials" && <TestiPreview vals={vals} />}
        {table === "metrics" && <MetricPreview vals={vals} />}
        {!["tracks", "pillars", "wall_entries", "testimonials", "metrics"].includes(table) && (
          <OutlinePreview vals={vals} />
        )}
      </div>
    </div>
  );
}

function TrackPreview({ vals }: { vals: Vals }) {
  const bullets = (vals.bullets ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  return (
    <article className="rounded-xl border border-[#c4c6cf] bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase ${TONE_BADGE[vals.tone] ?? TONE_BADGE.navy}`}
        >
          {vals.badge || "Badge"}
        </span>
        <span className="text-[11px] text-[#43474e]">{vals.side}</span>
      </div>
      <h3 className="mt-3 font-bold text-[#002045]">{vals.title || "Untitled track"}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-[#43474e]">{vals.description}</p>
      {!!bullets.length && (
        <ul className="mt-3 space-y-1.5 border-t border-[#c4c6cf]/40 pt-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-[#131b2e]">
              <span className="material-symbols-outlined mt-0.5 text-sm text-[#006c48]">check</span>
              {b}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-[#c4c6cf]/60 pt-4">
        <span className="text-[11px] font-bold text-[#002045]">{vals.foot_label}</span>
        <span className="rounded bg-[#006c48] px-3 py-1.5 text-[11px] font-bold text-white">
          {vals.cta_label || "Enroll"}
        </span>
      </div>
    </article>
  );
}

function PillarPreview({ vals }: { vals: Vals }) {
  return (
    <div className="rounded-xl border border-[#c4c6cf] bg-white p-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e2e7ff] text-2xl text-[#002045]">
        <span className="material-symbols-outlined">{vals.icon || "?"}</span>
      </span>
      <h3 className="mt-3 font-bold text-[#002045]">{vals.title || "Untitled pillar"}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-[#43474e]">{vals.copy}</p>
      {!!vals.tag && <p className="mt-3 text-[11px] font-bold text-[#006c48]">{vals.tag}</p>}
    </div>
  );
}

function WallPreview({ vals }: { vals: Vals }) {
  return (
    <article className="rounded-xl border border-[#c4c6cf] bg-white p-5">
      <span
        className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase ${TONE_BADGE[vals.tone] ?? TONE_BADGE.emerald}`}
      >
        {vals.badge || "Badge"}
      </span>
      <h3 className="mt-2 font-bold text-[#002045]">{vals.name || "Candidate name"}</h3>
      <p className="text-[13px] text-[#43474e]">{vals.area}</p>
      <div className="mt-3 space-y-1 border-t border-[#c4c6cf]/40 pt-3 text-[13px]">
        <p className="font-semibold text-[#002045]">{vals.perf}</p>
        <p className="text-[#43474e]">{vals.place}</p>
        <p className="text-[11px] tracking-wide text-[#74777f] uppercase">{vals.reg}</p>
      </div>
    </article>
  );
}

function TestiPreview({ vals }: { vals: Vals }) {
  return (
    <figure className="rounded-xl border border-[#c4c6cf] bg-white p-5">
      <p className="text-[13px] leading-relaxed text-[#43474e] italic">
        &ldquo;{(vals.quote || "The quote appears here as you type.").slice(0, 280)}&rdquo;
      </p>
      <figcaption className="mt-3 flex items-center gap-2 border-t border-[#c4c6cf] pt-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002045] text-[11px] font-bold text-white">
          {vals.initials || "?"}
        </span>
        <span>
          <span className="block text-[13px] font-bold text-[#002045]">{vals.name || "Name"}</span>
          <span className="block text-xs text-[#43474e]">{vals.detail}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function MetricPreview({ vals }: { vals: Vals }) {
  return (
    <div className="rounded-xl border border-[#c4c6cf] bg-white p-5 text-center">
      <p className="text-4xl font-bold tracking-tight text-[#002045] tabular-nums">
        {vals.value || "—"}
      </p>
      <p className="mt-1 text-[11px] font-bold tracking-widest text-[#74777f] uppercase">
        {vals.label}
      </p>
    </div>
  );
}

function OutlinePreview({ vals }: { vals: Vals }) {
  const keys = Object.entries(vals).filter(([k, v]) => v.trim() && !/sort/i.test(k));
  return (
    <dl className="space-y-3">
      {keys.map(([k, v]) => (
        <div key={k}>
          <dt className="text-[11px] font-bold tracking-wider text-[#74777f] uppercase">{k}</dt>
          <dd className="mt-0.5 truncate text-[13px] text-[#131b2e]">{v.split("\n")[0].slice(0, 120)}</dd>
        </div>
      ))}
      {!keys.length && <p className="text-[13px] text-[#74777f]">Nothing to preview yet.</p>}
    </dl>
  );
}
