import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Shell } from "@/components/shell";
import { table } from "@/lib/tables";
import { RowForm } from "@/components/row-form";

export default async function NewPage({ params }: { params: Promise<{ table: string }> }) {
  const { table: name } = await params;
  const cfg = table(name);
  if (!cfg || cfg.readonly) notFound();
  return (
    <Shell current={name}>
      <Link
        href={`/admin/${name}`}
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-pine hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {cfg.label}
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-deep">
        New {cfg.label.replace(/s$/, "").toLowerCase()}
      </h1>
      <div className="mt-5">
        <RowForm table={cfg} id={null} row={{}} />
      </div>
    </Shell>
  );
}
