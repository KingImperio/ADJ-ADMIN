import { createServerClient } from "@supabase/ssr";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/* Per-request client carrying the admin's session (for auth checks). */
export async function sessionClient() {
  const jar = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (all: { name: string; value: string }[]) => all.forEach((c) => jar.set(c)),
    },
  });
}

/* Privileged client for content CRUD. Service key never leaves the server. */
export function adminClient() {
  return createJsClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function adminUser() {
  const sb = await sessionClient();
  const { data } = await sb.auth.getUser();
  return data.user;
}
