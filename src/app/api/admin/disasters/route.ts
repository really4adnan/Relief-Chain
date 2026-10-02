import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { adminDb } from "@/lib/supabase-server";
import { upsertDisaster } from "@/lib/store";
import { getAllDisasters } from "@/lib/repo";

export const runtime = "nodejs";

const bodySchema = z.object({
  // Accepts either a Supabase uuid or a local/seed id ("d-…", "d1"…).
  id: z.string().min(1),
  status: z.enum(["active", "contained", "resolved"]),
});

/**
 * Admin disaster lifecycle: active → contained → resolved (or reopen).
 * Supabase rows update by uuid; local/seed rows are stored as an
 * override in the file store (repo prefers local entries by id).
 */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`admin-disasters:${ip}`, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limited." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { id, status } = parsed.data;
  const sb = adminDb();

  if (sb && /^[0-9a-f-]{36}$/i.test(id)) {
    const { error } = await sb
      .from("disasters")
      .update({ status })
      .eq("id", id);
    if (!error) return NextResponse.json({ ok: true, status, backend: "supabase" });
    // Row missing in Supabase → fall through to local override.
  }

  const all = await getAllDisasters();
  const found = all.find((d) => d.id === id);
  if (!found) {
    return NextResponse.json({ error: "Disaster not found." }, { status: 404 });
  }
  await upsertDisaster({ ...found, status });
  return NextResponse.json({ ok: true, status, backend: "local" });
}
