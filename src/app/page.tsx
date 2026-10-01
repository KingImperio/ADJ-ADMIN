"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function LoginPage() {
  const [err, act, busy] = useActionState(login, "");
  return (
    <div className="wrap login">
      <h1>ADJ Content Admin</h1>
      <p className="muted">Sign in to edit the ADJ website content.</p>
      <form action={act} className="card">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
