import { adminUser } from "@/lib/supabase";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return;
  if (!(await adminUser())) return Response.redirect(new URL("/", req.url));
}

export const config = { matcher: ["/admin/:path*"] };
