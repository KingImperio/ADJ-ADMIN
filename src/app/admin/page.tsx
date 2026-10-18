import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell } from "@/components/shell";
import { adminClient } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
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

export const dynamic = "force-dynamic";

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
  "bg-[#dce9e3] text-pine",
  "bg-[#f1dfb1] text-[#6a4b00]",
  "bg-[#d6e3ff] text-navy",
  "bg-[#e9e2d1] text-navy-deep",
];

export default async function AdminHome() {
  const sb = adminClient();
  const counts = await Promise.all(
    TABLES.map(async (t) => {
      const { count } = await sb.from(t.name).select("*", { count: "exact", head: true });
      return count ?? 0;
    }),
  );
  const { count: fresh } = await sb
    .from("consultation_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");
  const freshCount = fresh ?? 0;
  const total = counts.reduce((a, b) => a + b, 0);
  return (
    <Shell>
      <div className="admin-dashboard-surface rise overflow-hidden border border-[#c9c7bf] shadow-[0_18px_45px_-34px_rgba(6,26,50,.36)]">
        <div className="p-6 sm:p-8">
            <p className="text-[11px] font-bold tracking-[0.14em] text-pine uppercase">ADJ operations desk</p>
            <h1 className="mt-3 max-w-xl font-serif text-3xl font-bold leading-tight text-navy-deep sm:text-4xl">Keep the academic experience current.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">Manage programmes, proof, FAQs, enquiries, and editorial content from one focused workspace.</p>
        </div>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-pine uppercase">Content overview</p>
          <p className="mt-1 text-sm text-muted">{total} live records across {TABLES.length} tables. Edits publish within minutes.</p>
        </div>
        {freshCount > 0 && <Link href="/admin/consultation_submissions" className="border-b-2 border-[#bd851d] bg-[#f1dfb1] px-3 py-2 text-xs font-bold text-[#271a00]">Review {freshCount} new enquiries</Link>}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TABLES.map((t, i) => {
          const Icon = ICONS[t.name] ?? FileText;
          return (
            <Link
              key={t.name}
              href={`/admin/${t.name}`}
              className="rise group relative flex min-h-32 flex-col justify-between overflow-hidden border border-line bg-[#fffefa] p-4 transition-all hover:-translate-y-0.5 hover:border-pine/60 hover:shadow-lg"
              style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${TINTS[i % TINTS.length]}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span>
                {t.name === "consultation_submissions" && freshCount > 0 && (
                  <span className="mb-1 inline-flex items-center rounded-full bg-[#98f6c5]/60 px-2 py-0.5 text-[10px] font-black tracking-wider text-[#006c48] uppercase">
                    {freshCount} new
                  </span>
                )}
                <span className="block text-2xl font-bold tracking-tight tabular-nums">
                  {counts[i]}
                </span>
                <span className="flex items-center gap-1 text-[13px] text-muted">
                  {t.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </Shell>
  );
}
