import Link from "next/link";
import { notFound } from "next/navigation";
import { logout } from "@/lib/actions";
import { table } from "@/lib/tables";
import { RowForm } from "@/components/row-form";

export default async function NewPage({ params }: { params: Promise<{ table: string }> }) {
  const { table: name } = await params;
  const cfg = table(name);
  if (!cfg || cfg.readonly) notFound();
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
        <h1>New {cfg.label.replace(/s$/, "")}</h1>
        <RowForm table={cfg} id={null} row={{}} />
      </div>
    </>
  );
}
