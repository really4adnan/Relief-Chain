import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { adminDb } from "@/lib/supabase-server";
import { getStoreTender, upsertTender, type TenderStatus } from "@/lib/store";
import { tenders as seedTenders } from "@/lib/data";

export const runtime = "nodejs";

const bodySchema = z.union([
  z.object({
    id: z.string().min(1),
    action: z.enum(["advance", "complete", "reopen"]),
  }),
  z.object({
    action: z.literal("create"),
    title: z.string().min(6, "Title is too short").max(160),
    disasterId: z.string().min(1, "Choose a disaster"),
    region: z.string().min(2).max(120),
    budget: z.coerce.number().int().min(1000).max(100_000_000),
    closesAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
    skills: z.array(z.string().min(1).max(40)).max(8).default([]),
  }),
]);

/**
 * Admin tender lifecycle: Claimed → In Progress → Completed (or reopen).
 * Service-role client; route is behind requireAdmin.
 */
const NEXT: Record<string, "In Progress" | "Completed"> = {
  Claimed: "In Progress",
  "In Progress": "Completed",
};

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`admin-tenders:${ip}`, 30, 60_000);
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

  // ---- Create a new tender (admin) ----
  if (parsed.data.action === "create") {
    const c = parsed.data;
    const ref = `RC-${new Date().getFullYear()}-${randomUUID().slice(0, 4).toUpperCase()}${Date.now().toString(36).slice(-2).toUpperCase()}`;
    const tender = {
      id: randomUUID(),
      ref,
      title: c.title,
      disasterId: c.disasterId,
      region: c.region,
      budget: c.budget,
      status: "Open" as TenderStatus,
      skills: c.skills,
      closesAt: c.closesAt,
      updatedAt: new Date().toISOString(),
    };
    await upsertTender(tender);

    // Best-effort Supabase mirror (uuid disaster ids only).
    const sb = adminDb();
    if (sb && /^[0-9a-f-]{36}$/i.test(c.disasterId)) {
      await sb.from("tenders").insert({
        ref,
        disaster_id: c.disasterId,
        title: c.title,
        region: c.region,
        budget: c.budget,
        status: "Open",
        skills: c.skills,
        closes_at: c.closesAt,
      });
    }
    return NextResponse.json({ ok: true, status: "Open", ref });
  }

  const { id, action } = parsed.data;
  let base = await getStoreTender(id);
  if (!base) {
    const seed = seedTenders.find((t) => t.id === id);
    if (!seed) {
      return NextResponse.json({ error: "Tender not found." }, { status: 404 });
    }
    base = {
      id: seed.id,
      ref: seed.ref,
      title: seed.title,
      disasterId: seed.disasterId,
      region: seed.region,
      budget: seed.budget,
      status: seed.status,
      skills: seed.skills,
      closesAt: seed.closesAt,
      updatedAt: new Date().toISOString(),
    };
  }

  const status: TenderStatus =
    action === "reopen"
      ? "Open"
      : action === "complete"
        ? "Completed"
        : (NEXT[base.status] ?? base.status);

  const updated = { ...base, status, updatedAt: new Date().toISOString() };
  await upsertTender(updated);

  const sb = adminDb();
  if (sb && /^[0-9a-f-]{36}$/i.test(id)) {
    await sb.from("tenders").update({ status }).eq("id", id);
  }

  return NextResponse.json({ ok: true, status });
}
