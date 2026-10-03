import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Shell } from "@/components/shell";
import { DeleteButton } from "@/components/delete-button";
import { adminClient } from "@/lib/supabase";
import { table, TABLES } from "@/lib/tables";
import type { LucideIcon } from "lucide-react";
import {
  Settings2,
  Layers,
  Columns3,
  Trophy,
  MessagesSquare,
  BookOpen,
  FileText,
  Gauge,
  MapPin,
  Signpost,
  CircleHelp,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  site_settings: Settings2,
  tracks: Layers,
  pillars: Columns3,
  wall_entries: Trophy,
  testimonials: MessagesSquare,
  program_pages: BookOpen,
  page_sections: FileText,
  metrics: Gauge,
  catchments: MapPin,
  directions: Signpost,
  faqs: CircleHelp,
};

const TINTS = [
  "bg-[#e2e7ff] text-navy",
  "bg-[#98f6c5]/40 text-pine",
  "bg-[#ffdcc3]/60 text-[#a34a24]",
  "bg-[#d6e3ff] text-navy-deep",
];

export default async function TablePage({ params }: { params: Promise<{ table: string }> }) {
  const { table: name } = await params;
  const cfg = table(name);
  if (!cfg) notFound();
  const { data } = await adminClient().from(name).select("*").order(cfg.orderBy, { ascending: !cfg.desc });
  const rows = (data ?? []) as Record<string, unknown>[];
  const Icon = ICONS[name] ?? FileText;
  const tint = TINTS[TABLES.findIndex((t) => t.name === name) % TINTS.length];
  return (
    <Shell current={name}>
      <div className="rise overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[15px] font-bold tracking-tight text-navy-deep">
                {cfg.label}
              </span>
              <span className="block text-[13px] text-faint">
                {rows.length} record{rows.length === 1 ? "" : "s"} · edits publish within minutes
              </span>
            </span>
          </div>
          {cfg.allowNew !== false && (
            <Link
              href={`/admin/${name}/new`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-pine px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-pine-deep active:scale-95"
            >
              <Plus className="h-4 w-4" />
              New
            </Link>
          )}
        </div>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-y border-line/70 bg-[#f7f8fd]">
              <th className="px-5 py-2.5 text-[11px] font-bold tracking-wider text-faint uppercase">
                {cfg.list === cfg.pk ? "Key" : "Title"}
              </th>
              <th className="px-4 py-2.5 text-[11px] font-bold tracking-wider text-faint uppercase">
                Key
              </th>
              <th className="w-28 px-5 py-2.5 text-right text-[11px] font-bold tracking-wider text-faint uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const id = String(r[cfg.pk]);
              return (
                <tr
                  key={id}
                  className="border-b border-line/50 transition-colors last:border-0 hover:bg-[#f7f8fd]"
                >
                  <td className="max-w-0 px-5 py-3 text-sm">
                    {cfg.allowEdit === false ? (
                      <span className="block truncate font-semibold text-navy-deep">
                        {String(r[cfg.list] ?? id).slice(0, 90)}
                      </span>
                    ) : (
                      <Link
                        href={`/admin/${name}/${encodeURIComponent(id)}`}
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
                        href={`/admin/${name}/${encodeURIComponent(id)}`}
                        aria-label={`Edit ${id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-navy hover:text-navy"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      )}
                      {cfg.serial ? (
                        <DeleteButton table={name} id={id} />
                      ) : (
                        <span className="rounded-full bg-[#e2e7ff] px-2 py-0.5 text-[11px] font-bold text-navy">
                          locked
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="border-t border-line/70 px-5 py-3 text-xs text-faint tabular-nums">
          {rows.length} of {rows.length} records
        </p>
      </div>
    </Shell>
  );
}
