import Link from "next/link";
import { logout } from "@/lib/actions";
import { TABLES } from "@/lib/tables";

export default function AdminHome() {
  return (
    <>
      <div className="topbar">
        <strong>ADJ Content Admin</strong>
        <form action={logout}>
          <button type="submit">Sign out</button>
        </form>
      </div>
      <div className="wrap">
        <h1>Content</h1>
        <p className="muted">
          Edits publish to the website within minutes. Rows marked read-only keep their keys so
          links never break.
        </p>
        <div className="grid">
          {TABLES.map((t) => (
            <Link key={t.name} href={`/admin/${t.name}`} className="tile">
              <b>{t.label}</b>
              <span>{t.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
