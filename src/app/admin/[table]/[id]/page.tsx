import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Shell } from "@/components/shell";
import { adminClient } from "@/lib/supabase";
import { table } from "@/lib/tables";
import { RowForm } from "@/components/row-form";

export default async function EditPage({
  params,
}: {
  params: Promise<{ table: string; id: string }>;
}) {
  const { table: name, id } = await params;
  const cfg = table(name);
  if (!cfg || cfg.allowEdit === false) notFound();
  const key = isNaN(Number(id)) ? decodeURIComponent(id) : Number(id);
  const { data } = await adminClient().from(name).select("*").eq(cfg.pk, key).single();
  if (!data) notFound();
  const title = String((data as Record<string, unknown>)[cfg.list] ?? id).slice(0, 70);
  return (
    <Shell current={name}>
      <Link
        href={`/admin/${name}`}
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-pine hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {cfg.label}
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-deep">{title}</h1>
      <p className="mt-1 font-mono text-xs text-faint">
        {cfg.pk}: {String(key)}
      </p>
      <div className="mt-5">
        <RowForm table={cfg} id={String(key)} row={data as Record<string, unknown>} />
      </div>
    </Shell>
  );
}
