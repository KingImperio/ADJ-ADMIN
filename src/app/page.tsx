"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function LoginPage() {
  const [err, act, busy] = useActionState(login, "");
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4">
      <div className="rise w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <Image
            src="/adj-logo.png"
            alt="ADJ logo"
            width={512}
            height={512}
            className="h-10 w-10 rounded-full border border-line object-cover"
          />
          <span>
            <span className="block text-[15px] font-bold tracking-tight text-navy-deep">
              Welcome back
            </span>
            <span className="block text-[13px] text-faint">Sign in to your ADJ workspace</span>
          </span>
        </div>
        <form action={act} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[13px] text-faint">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              placeholder="you@company.com"
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint/70 focus:border-navy focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] text-faint">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint/70 focus:border-navy focus:outline-none"
            />
          </div>
          {err && <p className="text-[13px] font-semibold text-danger">{err}</p>}
          <button
            disabled={busy}
            className="w-full rounded-xl bg-[#D5A11E] py-3 text-sm font-bold text-[#101A3D] shadow-md transition-all hover:bg-[#e5b532] active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
