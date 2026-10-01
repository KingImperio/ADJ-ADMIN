import Link from "next/link";
import { notFound } from "next/navigation";
import { logout } from "@/lib/actions";
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
  if (!cfg) notFound();
  const key = isNaN(Number(id)) ? decodeURIComponent(id) : Number(id);
  const { data } = await adminClient().from(name).select("*").eq(cfg.pk, key).single();
  if (!data) notFound();
  return (
    <>
      <div className="topbar">
        <span>
          <Link href={`/admin/${name}`}>← {cfg.label}</Link>
        </span>
        <form action={logout}>
          <button type="submit">Sign out</button>
        </form>
      </div>
      <div className="wrap">
        <h1>{String((data as Record<string, unknown>)[cfg.list] ?? id).slice(0, 60)}</h1>
        <RowForm table={cfg} id={String(key)} row={data as Record<string, unknown>} />
      </div>
    </>
  );
}
