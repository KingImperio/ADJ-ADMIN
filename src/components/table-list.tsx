"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Search } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";
import type { Table } from "@/lib/tables";

const STATUS_TONES: Record<string, string> = {
  new: "bg-[#d6e3ff] text-[#1a365d]",
  called: "bg-[#ffdcc3]/70 text-[#a34a24]",
  scheduled: "bg-[#98f6c5]/60 text-[#006c48]",
  declined: "bg-[#ffdad6] text-[#93000a]",
};

export const STATUSES = ["all", "new", "called", "scheduled", "declined"];

/* Client-side search + status filter for the admin tables. Rows arrive
   serialized from the server; nothing is fetched here. */
export function TableList({
  cfg,
  rows,
}: {
  cfg: Table;
  rows: Record<string, unknown>[];
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const hasStatus = cfg.name === "consultation_submissions";

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (hasStatus && status !== "all" && r.status !== status) return false;
      if (!needle) return true;
      return Object.entries(r)
        .filter(([k]) => k !== "id")
        .some(([, v]) => String(v ?? "").toLowerCase().includes(needle));
    });
  }, [rows, q, status, hasStatus]);

  if (cfg.name === "consultation_submissions") {
    return (
      <div className="rise overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 px-4 py-3">
          <span className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm focus-within:border-navy">
            <Search className="h-4 w-4 text-faint" />
            <input aria-label="Search booking requests" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, course…" className="w-56 bg-transparent outline-none placeholder:text-faint/70" />
          </span>
          <span className="flex items-center gap-1 overflow-x-auto">
            {STATUSES.map((s) => <button key={s} onClick={() => setStatus(s)} className={`rounded-full border px-2.5 py-1.5 text-[11px] font-bold capitalize ${status === s ? "border-navy bg-navy text-white" : "border-line bg-white text-muted"}`}>{s}</button>)}
          </span>
        </div>
        <div className="grid gap-3 p-3 sm:grid-cols-2">
          {visible.map((r) => {
            const id = String(r[cfg.pk]);
            const tone = STATUS_TONES[String(r.status)] ?? STATUS_TONES.new;
            return <article key={id} className="rounded-2xl border border-line bg-[#fbfcff] p-4 transition hover:border-navy/35 hover:shadow-md">
              <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-navy-deep">{String(r.name ?? "Unnamed enquiry")}</p><p className="mt-1 text-xs text-faint">{String(r.exam ?? "Programme enquiry")} · {String(r.mode ?? "Mode not specified")}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${tone}`}>{String(r.status ?? "new")}</span></div>
              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">{String(r.notes ?? "No notes provided.")}</p>
              <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3"><span className="text-xs text-faint">{String(r.created_at ?? "")}</span><Link href={`/admin/${cfg.name}/${encodeURIComponent(id)}`} className="inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-bold text-white"><Pencil className="h-3 w-3" /> Open</Link></div>
            </article>;
          })}
        </div>
        {visible.length === 0 && <p className="px-5 py-10 text-center text-sm text-faint">{q || status !== "all" ? "No matches for this filter." : "No booking requests yet."}</p>}
        <p className="border-t border-line/70 px-5 py-3 text-xs text-faint tabular-nums">{visible.length} of {rows.length} requests</p>
      </div>
    );
  }

  if (cfg.name === "testimonials") {
    return (
      <div className="rise overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex items-center gap-2 border-b border-line/60 px-4 py-3">
          <Search className="h-4 w-4 text-faint" />
          <input aria-label="Search testimonials" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people or testimonial text…" className="w-full bg-transparent text-sm outline-none placeholder:text-faint/70" />
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((r) => {
            const id = String(r[cfg.pk]);
            return <article key={id} className="group relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-line bg-[#fffdf7] p-5 transition hover:-translate-y-0.5 hover:border-[#D5A11E]/60 hover:shadow-lg">
              <span className="absolute -right-4 -top-8 font-serif text-8xl leading-none text-[#D5A11E]/15" aria-hidden="true">“</span>
              <div className="flex items-center justify-between"><span className="rounded-full bg-[#F5E5B5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7A5700]">{String(r.scope ?? "home")}</span><span className="text-[10px] font-semibold text-faint">Order {String(r.sort ?? "—")}</span></div>
              <blockquote className="relative mt-5 line-clamp-5 flex-1 text-sm leading-relaxed text-muted">“{String(r.quote ?? "No testimonial text yet.")}”</blockquote>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#eadfbf] pt-4"><div className="min-w-0"><p className="truncate text-sm font-bold text-navy-deep">{String(r.name ?? "Unnamed")}</p><p className="truncate text-xs text-faint">{String(r.detail ?? r.area ?? "")}</p></div><Link href={`/admin/${cfg.name}/${encodeURIComponent(id)}`} aria-label={`Edit testimonial by ${String(r.name ?? id)}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white transition group-hover:bg-[#D5A11E] group-hover:text-[#101A3D]"><Pencil className="h-4 w-4" /></Link></div>
            </article>;
          })}
        </div>
        {visible.length === 0 && <p className="px-5 py-10 text-center text-sm text-faint">{q ? "No matching testimonials." : "No testimonials yet."}</p>}
        <p className="border-t border-line/70 px-5 py-3 text-xs text-faint tabular-nums">{visible.length} of {rows.length} testimonials</p>
      </div>
    );
  }

  return (
    <div className="rise overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-line/60 px-4 py-3">
        <span className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm focus-within:border-navy">
          <Search className="h-4 w-4 text-faint" />
          <input
            aria-label={`Search ${cfg.label}`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${cfg.name === "consultation_submissions" ? "name, phone, course" : "title, key"}…`}
            className="w-56 bg-transparent outline-none placeholder:text-faint/70"
          />
        </span>
        {hasStatus && (
          <span className="flex items-center gap-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full border px-2.5 py-1.5 text-[11px] font-bold capitalize transition-colors ${
                  status === s
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-white text-muted hover:border-navy/50"
                }`}
              >
                {s}
              </button>
            ))}
          </span>
        )}
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line/70 bg-[#f7f8fd]">
            <th className="px-5 py-2.5 text-[11px] font-bold tracking-wider text-faint uppercase">
              {cfg.list === cfg.pk ? "Key" : "Title"}
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold tracking-wider text-faint uppercase">Key</th>
            <th className="w-28 px-5 py-2.5 text-right text-[11px] font-bold tracking-wider text-faint uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => {
            const id = String(r[cfg.pk]);
            return (
              <tr key={id} className="border-b border-line/50 transition-colors last:border-0 hover:bg-[#f7f8fd]">
                <td className="max-w-0 px-5 py-3 text-sm">
                  {typeof r.status === "string" && r.status && (
                    <span
                      className={`mb-1 mr-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        STATUS_TONES[r.status] ?? STATUS_TONES.new
                      }`}
                    >
                      {r.status}
                    </span>
                  )}
                  {cfg.allowEdit === false ? (
                    <span className="block truncate font-semibold text-navy-deep">
                      {String(r[cfg.list] ?? id).slice(0, 90)}
                    </span>
                  ) : (
                    <Link
                      href={`/admin/${cfg.name}/${encodeURIComponent(id)}`}
                      className="block truncate font-semibold text-navy-deep hover:text-pine hover:underline"
                    >
                      {String(r[cfg.list] ?? id).slice(0, 90)}
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-faint">{id}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center justify-end gap-1.5">
                    {cfg.allowEdit !== false && (
                      <Link
                        href={`/admin/${cfg.name}/${encodeURIComponent(id)}`}
                        aria-label={`Edit ${id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-navy hover:text-navy"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    {cfg.serial ? <DeleteButton table={cfg.name} id={id} /> : null}
                  </span>
                </td>
              </tr>
            );
          })}
          {visible.length === 0 && (
            <tr>
              <td colSpan={3} className="px-5 py-10 text-center text-sm text-faint">
                {q || status !== "all" ? "No matches for this filter." : "No rows yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="border-t border-line/70 px-5 py-3 text-xs text-faint tabular-nums">
        {visible.length} of {rows.length} records
      </p>
    </div>
  );
}
