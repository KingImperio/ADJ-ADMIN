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
      <p className="text-[11px] font-bold tracking-[0.14em] text-pine uppercase">Dashboard</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy-deep">
        Website content at a glance
      </h1>
      <p className="mt-1 text-sm text-muted">
        {total} live records across {TABLES.length} tables. Edits publish to the site within
        minutes.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TABLES.map((t, i) => {
          const Icon = ICONS[t.name] ?? FileText;
          return (
            <Link
              key={t.name}
              href={`/admin/${t.name}`}
              className="rise group flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-navy/40 hover:shadow-lg"
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
