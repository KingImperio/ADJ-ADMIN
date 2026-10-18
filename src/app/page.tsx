"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function LoginPage() {
  const [err, act, busy] = useActionState(login, "");
  return (
    <main className="min-h-screen bg-[#faf9f5] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden border border-line bg-white shadow-[0_24px_60px_-36px_rgba(6,26,50,.35)] sm:min-h-[calc(100vh-4rem)] sm:grid-cols-[1.03fr_.97fr]">
        <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[#09264d] p-10 text-white sm:flex lg:p-14">
          <div className="admin-login-loom absolute inset-0 opacity-90" aria-hidden="true" />
          <div className="admin-kente-rule absolute inset-x-0 top-0" aria-hidden="true" />
          <div className="relative z-10 flex items-center gap-3">
            <Image src="/adj-logo.png" alt="" width={512} height={512} className="h-11 w-11 rounded-full border border-[#f1dfb1] bg-white object-cover p-0.5" />
            <span><span className="block text-sm font-bold">ADJ Education</span><span className="block text-[10px] uppercase tracking-[0.16em] text-white/75">Content workspace</span></span>
          </div>
          <div className="relative z-10 max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f1dfb1]">Many threads. One clear path.</p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.12] lg:text-5xl">Every detail helps a student move forward.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/80">A considered place to shape the information, stories, and guidance families rely on.</p>
          </div>
          <div className="relative z-10 flex items-center gap-3 text-xs text-white/75"><span className="h-px w-12 bg-[#f1dfb1]" />Indigo Adire · Aso Oke · Kente</div>
        </section>
        <section className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="admin-kente-rule absolute inset-x-0 top-0 sm:hidden" aria-hidden="true" />
          <div className="rise w-full max-w-sm">
            <div className="flex items-center gap-3 sm:hidden">
              <Image src="/adj-logo.png" alt="ADJ logo" width={512} height={512} className="h-10 w-10 rounded-full border border-line object-cover" />
              <span><span className="block text-sm font-bold text-navy-deep">ADJ Education</span><span className="block text-xs text-faint">Content workspace</span></span>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-pine sm:mt-0">Operations desk</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy-deep">Welcome back.</h2>
            <p className="mt-2 text-sm text-muted">Sign in to continue to the ADJ workspace.</p>
            <form action={act} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-muted">Email</label>
                <input id="email" name="email" type="email" required autoComplete="username" placeholder="you@company.com" className="w-full rounded-sm border border-line bg-[#fffefa] px-3.5 py-3 text-sm text-foreground placeholder:text-faint/70 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/15" />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-muted">Password</label>
                <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-sm border border-line bg-[#fffefa] px-3.5 py-3 text-sm text-foreground placeholder:text-faint/70 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/15" />
              </div>
              {err && <p role="alert" className="text-[13px] font-semibold text-danger">{err}</p>}
              <button disabled={busy} className="w-full rounded-sm bg-[#bd851d] py-3 text-sm font-bold text-[#10213b] transition-colors hover:bg-[#d5a948] disabled:opacity-60">
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <div className="admin-kente-rule mt-8" aria-hidden="true" />
          </div>
        </section>
      </div>
    </main>
  );
}
