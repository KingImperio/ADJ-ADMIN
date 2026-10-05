"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function LoginPage() {
  const [err, act, busy] = useActionState(login, "");

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#071858]">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full border-[22px] border-[#D5A11E]/15" />
        <div className="absolute -left-16 -top-16 h-[25rem] w-[25rem] rounded-full border border-[#F5E5B5]/20" />
        <div className="absolute -bottom-48 right-[-8rem] h-[32rem] w-[32rem] rounded-full border-[20px] border-[#D5A11E]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(213,161,30,.18),transparent_32%),linear-gradient(135deg,transparent_48%,rgba(255,255,255,.04)_49%,transparent_50%)]" />
      </div>

      <section className="relative hidden w-[46%] flex-col justify-between p-10 text-white lg:flex xl:p-16">
        <div className="flex items-center gap-3">
          <Image
            src="/adj-logo.png"
            alt="ADJ logo"
            width={1536}
            height={1536}
            className="h-12 w-12 rounded-full border border-[#D5A11E]/60 bg-white object-cover p-0.5"
          />
          <div>
            <p className="text-sm font-bold tracking-tight">ADJ Educational Consultants</p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-[0.18em] text-[#F5E5B5] uppercase">
              Content workspace
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="text-[11px] font-bold tracking-[0.22em] text-[#F5E5B5] uppercase">
            Editorial operations
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight xl:text-5xl">
            Keep every academic detail moving in the right direction.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            Maintain the programmes, guidance, proof, and enquiries that shape the ADJ student experience.
          </p>
        </div>

        <p className="text-xs text-white/45">Private workspace · authorised team members only</p>
      </section>

      <section className="relative flex flex-1 items-center justify-center bg-[#F5F7FC] px-4 py-10 sm:px-8 lg:rounded-l-[3rem]">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image
              src="/adj-logo.png"
              alt="ADJ logo"
              width={1536}
              height={1536}
              className="h-11 w-11 rounded-full border border-[#D5A11E]/50 bg-white object-cover p-0.5"
            />
            <div>
              <p className="text-sm font-bold tracking-tight text-navy-deep">ADJ Content Admin</p>
              <p className="text-xs text-faint">Private editorial workspace</p>
            </div>
          </div>

          <div className="rise rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_24px_70px_-36px_rgba(7,24,88,.45)] sm:p-9">
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-pine-deep uppercase">
                Secure sign in
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-deep">Welcome back.</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Sign in to update the content shown on the ADJ public website.
              </p>
            </div>

            <form action={act} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-[13px] font-semibold text-navy-deep">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-line bg-[#fbfcff] px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-navy focus:ring-4 focus:ring-navy/10"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-[13px] font-semibold text-navy-deep">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-line bg-[#fbfcff] px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-navy focus:ring-4 focus:ring-navy/10"
                />
              </div>
              {err && (
                <p role="alert" className="rounded-xl border border-danger/20 bg-red-50 px-3.5 py-3 text-[13px] font-semibold text-danger">
                  {err}
                </p>
              )}
              <button
                disabled={busy}
                className="w-full rounded-xl bg-pine py-3.5 text-sm font-bold text-[#101A3D] shadow-[0_14px_28px_-14px_rgba(213,161,30,.8)] transition hover:-translate-y-0.5 hover:bg-[#E7C768] focus:outline-none focus:ring-4 focus:ring-pine/25 active:translate-y-0 disabled:cursor-wait disabled:opacity-60"
              >
                {busy ? "Signing in…" : "Sign in to workspace"}
              </button>
            </form>

            <p className="mt-6 border-t border-line/70 pt-5 text-center text-xs leading-relaxed text-faint">
              This is an internal content workspace. If you need access, contact the ADJ administrator.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
