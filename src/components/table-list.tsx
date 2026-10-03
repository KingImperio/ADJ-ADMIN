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

  return (
    <div className="rise overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-line/60 px-4 py-3">
        <span className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm focus-within:border-navy">
          <Search className="h-4 w-4 text-faint" />
          <input
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
