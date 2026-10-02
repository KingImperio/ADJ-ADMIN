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

/* Tell the live site to purge its cache right after every save, so an edit
   is visible in seconds instead of after the ISR window. */
async function purge() {
  const url = process.env.SITE_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    await fetch(url, { method: "POST", headers: { "x-revalidate-secret": secret } });
  } catch {
    /* site keeps its 5-minute ISR fallback; don't fail the save */
  }
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
    if (f.kind === "lines")
      row[f.name] = form
        .getAll(f.name)
        .flatMap((v) => String(v).split("\n").map((s) => s.trim()).filter(Boolean));
    else if (f.kind === "json") {
      const text = String(form.get(f.name) ?? "").trim();
      row[f.name] = text ? JSON.parse(text) : f.name === "stats" ? { numbers: [], labels: [] } : [];
    } else row[f.name] = String(form.get(f.name) ?? "");
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
  await purge();
  revalidatePath(`/admin/${name}`);
  redirect(`/admin/${name}`);
}

export async function removeRow(name: string, id: string): Promise<void> {
  await guard();
  const cfg = table(name)!;
  const sb = adminClient();
  const { error } = await sb.from(name).delete().eq(cfg.pk, isNaN(Number(id)) ? id : Number(id));
  if (error) throw new Error(error.message);
  await purge();
  revalidatePath(`/admin/${name}`);
  redirect(`/admin/${name}`);
}
