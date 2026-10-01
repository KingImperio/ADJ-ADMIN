"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminClient, adminUser, sessionClient } from "@/lib/supabase";
import { table } from "@/lib/tables";

async function guard() {
  const user = await adminUser();
  if (!user) redirect("/");
  return user;
}

/* Login / logout (email + password; the admin user is created once via the
   Supabase dashboard or API). */
export async function login(_prev: string, form: FormData): Promise<string> {
  const sb = await sessionClient();
  const { error } = await sb.auth.signInWithPassword({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
  });
  if (error) return error.message;
  redirect("/admin");
}

export async function logout() {
  const sb = await sessionClient();
  await sb.auth.signOut();
  redirect("/");
}

/* Parse posted fields per the table registry. */
function parse(name: string, form: FormData) {
  const cfg = table(name)!;
  const row: Record<string, string | string[] | object> = {};
  for (const f of cfg.fields) {
    const raw = String(form.get(f.name) ?? "");
    if (f.kind === "lines") row[f.name] = raw.split("\n").map((s) => s.trim()).filter(Boolean);
    else if (f.kind === "json") row[f.name] = raw.trim() ? JSON.parse(raw) : f.name === "stats" ? { numbers: [], labels: [] } : [];
    else row[f.name] = raw;
  }
  return row;
}

export async function saveRow(name: string, id: string | null, form: FormData): Promise<string> {
  await guard();
  const cfg = table(name)!;
  let row: Record<string, string | string[] | object>;
  try {
    row = parse(name, form);
  } catch {
    return "A JSON field is not valid JSON — nothing was saved.";
  }
  const sb = adminClient();
  const { error } = id
    ? await sb.from(name).update(row).eq(cfg.pk, isNaN(Number(id)) ? id : Number(id))
    : await sb.from(name).insert(row);
  if (error) return error.message;
  revalidatePath(`/admin/${name}`);
  redirect(`/admin/${name}`);
}

export async function removeRow(name: string, id: string): Promise<void> {
  await guard();
  const cfg = table(name)!;
  const sb = adminClient();
  const { error } = await sb.from(name).delete().eq(cfg.pk, isNaN(Number(id)) ? id : Number(id));
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${name}`);
  redirect(`/admin/${name}`);
}
