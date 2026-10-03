import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { TableList } from "@/components/table-list";
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
  ClipboardList,
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
  consultation_submissions: ClipboardList,
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
  const { data } = await adminClient()
    .from(name)
    .select("*")
    .order(cfg.orderBy, { ascending: !cfg.desc });
  const rows = (data ?? []) as Record<string, unknown>[];
  const Icon = ICONS[name] ?? FileText;
  const tint = TINTS[TABLES.findIndex((t) => t.name === name) % TINTS.length];
  return (
    <Shell current={name}>
      <div className="rise">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
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
        <TableList cfg={cfg} rows={rows} />
      </div>
    </Shell>
  );
}
