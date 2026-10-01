import Link from "next/link";
import { notFound } from "next/navigation";
import { logout } from "@/lib/actions";
import { DeleteButton } from "@/components/delete-button";
import { adminClient } from "@/lib/supabase";
import { table } from "@/lib/tables";

export default async function TablePage({ params }: { params: Promise<{ table: string }> }) {
  const { table: name } = await params;
  const cfg = table(name);
  if (!cfg) notFound();
  const { data } = await adminClient().from(name).select("*").order(cfg.orderBy);
  const rows = (data ?? []) as Record<string, unknown>[];
  return (
    <>
      <div className="topbar">
        <span>
          <Link href="/admin">← Content</Link> <strong> · {cfg.label}</strong>
        </span>
        <form action={logout}>
          <button type="submit">Sign out</button>
        </form>
      </div>
      <div className="wrap">
        <p>
          <Link href={`/admin/${name}/new`} className="btn">
            + New {cfg.label.replace(/s$/, "")}
          </Link>
        </p>
        <table className="rows">
          <thead>
            <tr>
              <th>{cfg.list}</th>
              <th>Key</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const id = String(r[cfg.pk]);
              return (
                <tr key={id}>
                  <td>
                    <Link href={`/admin/${name}/${encodeURIComponent(id)}`}>
                      {String(r[cfg.list] ?? id).slice(0, 80)}
                    </Link>
                  </td>
                  <td className="muted">{id}</td>
                  <td>
                    {!cfg.readonly || cfg.serial ? (
                      <DeleteButton table={name} id={id} />
                    ) : (
                      <span className="muted">locked</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
