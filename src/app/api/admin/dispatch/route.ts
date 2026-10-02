import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { adminDb } from "@/lib/supabase-server";
import { addDisaster, addDispatch, listStoreDisasters } from "@/lib/store";
import { getAllOrganisations } from "@/lib/repo";
import { sendAlerts } from "@/lib/notify";
import type { Disaster } from "@/lib/data";

export const runtime = "nodejs";

const dispatchSchema = z.object({
  title: z.string().min(6, "Title is too short").max(140),
  type: z.enum(["Flood", "Earthquake", "Cyclone", "Wildfire", "Landslide", "Heatwave"]),
  severity: z.enum(["critical", "high", "moderate"]),
  region: z.string().min(2).max(120),
  state: z.string().min(2).max(120),
  affected: z.coerce.number().int().min(0).max(100_000_000),
  summary: z.string().min(20, "Summary must be at least 20 characters").max(600),
});

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`admin-dispatch:${ip}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limited." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = dispatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const disaster: Disaster = {
    id: `d-${randomUUID().slice(0, 8)}`,
    title: d.title,
    type: d.type,
    severity: d.severity,
    status: "active",
    region: d.region,
    state: d.state,
    affected: d.affected,
    reportedAt: new Date().toISOString(),
    summary: d.summary,
  };

  // 1. Persist the disaster — Supabase (service role) first, local fallback.
  let persistedTo = "local";
  let supabaseDisasterId: string | null = null;
  const supabase = adminDb();
  if (supabase) {
    const { data, error } = await supabase
      .from("disasters")
      .insert({
        title: disaster.title,
        type: disaster.type,
        severity: disaster.severity,
        status: disaster.status,
        region: disaster.region,
        state: disaster.state,
        affected: disaster.affected,
        summary: disaster.summary,
        reported_at: disaster.reportedAt,
      })
      .select("id")
      .single();
    if (!error) {
      persistedTo = "supabase";
      supabaseDisasterId = (data as { id?: string } | null)?.id ?? null;
    }
  }
  if (persistedTo === "local") {
    const existing = await listStoreDisasters();
    if (!existing.some((x) => x.title === disaster.title)) {
      await addDisaster(disaster);
    }
  }

  // 2. Notify every verified body through the provider layer.
  //    dashboard = delivered in-app; sms/email/voice queue until keys exist.
  const orgs = (await getAllOrganisations()).filter((o) => o.verified);
  const results = await sendAlerts(disaster, orgs);
  await addDispatch(results);

  // 3. Best-effort Supabase mirror of the dispatch log so history survives
  //    restarts. Only "sent" rows with resolvable uuid orgs are mirrored
  //    (seed ids like "o1" and queued provider rows stay local-only).
  if (supabase && supabaseDisasterId) {
    try {
      const { data: dbOrgs } = await supabase
        .from("organisations")
        .select("id, name")
        .eq("verified", true)
        .limit(200);
      const idByName = new Map(
        ((dbOrgs ?? []) as { id: string; name: string }[]).map((o) => [
          o.name,
          o.id,
        ])
      );
      const rows = results
        .filter((r) => r.status === "sent")
        .map((r) => ({
          disaster_id: supabaseDisasterId as string,
          org_id: idByName.get(r.orgName),
          channel: r.channel,
        }))
        .filter((r) => Boolean(r.org_id))
        .map((r) => ({
          disaster_id: r.disaster_id,
          org_id: r.org_id as string,
          channel: r.channel,
        }));
      if (rows.length > 0) {
        await supabase.from("alert_dispatch_log").insert(rows);
      }
    } catch {
      /* local log above is the source of truth */
    }
  }

  return NextResponse.json({
    ok: true,
    disasterId: supabaseDisasterId ?? disaster.id,
    notified: orgs.length,
    backend: persistedTo,
  });
}
