import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
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
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/actions";
import { adminClient } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";

const ICONS: Record<string, typeof Settings2> = {
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

export async function Shell({
  current,
  children,
}: {
  current?: string;
  children: React.ReactNode;
}) {
  const sb = adminClient();
  const counts = await Promise.all(
    TABLES.map(async (t) => {
      const { count } = await sb.from(t.name).select("*", { count: "exact", head: true });
      return count ?? 0;
    }),
  );
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-navy-deep text-white max-md:hidden">
        <Link href="/admin" className="flex items-center gap-3 px-5 pt-6 pb-5">
          <Image
            src="/adj-logo.png"
            alt="ADJ logo"
            width={1536}
            height={1536}
            className="h-10 w-10 rounded-full border border-[#D5A11E]/45 bg-white object-cover p-0.5"
          />
          <span>
            <span className="block text-sm font-bold tracking-tight">ADJ Content</span>
            <span className="block text-[11px] tracking-widest text-mist/70 uppercase">Admin</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4">
          <SideLink href="/admin" active={!current} icon={LayoutDashboard} label="Dashboard" />
          <p className="px-3 pt-6 pb-1 text-[10px] font-bold tracking-[0.14em] text-mist/65 uppercase">Manage</p>
          {TABLES.map((t, i) => (
            <SideLink
              key={t.name}
              href={`/admin/${t.name}`}
              active={current === t.name}
              icon={ICONS[t.name] ?? FileText}
              label={t.label}
              count={counts[i]}
            />
          ))}
        </nav>
        <form action={logout} className="border-t border-white/10 p-3">
          <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-10 border-b border-line bg-cream/90 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/admin" className="text-sm font-bold text-navy-deep">
              ADJ Content Admin
            </Link>
            <form action={logout}>
              <button className="text-xs font-semibold text-pine">Sign out</button>
            </form>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-3">
            {TABLES.map((t) => (
              <Link
                key={t.name}
                href={`/admin/${t.name}`}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                  current === t.name
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-white text-navy"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

function SideLink({
  href,
  active,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  active?: boolean;
  icon: typeof Settings2;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
        active ? "bg-white/15 font-semibold text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
