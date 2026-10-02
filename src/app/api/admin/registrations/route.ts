import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { adminDb } from "@/lib/supabase-server";
import {
  setRegistrationStatus,
  listStoreOrganisations,
  addOrganisation,
} from "@/lib/store";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const bodySchema = z.object({
  id: z.string().min(1),
  action: z.enum(["approve", "reject"]),
});

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`admin-verify:${ip}`, 30, 60_000);
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

  const { id, action } = parsed.data;
  const status = action === "approve" ? "approved" : "rejected";

  // Service-role client: admin reads/writes bypass RLS (route is behind
  // requireAdmin above, so the key never reaches the browser).
  const supabase = adminDb();
  if (supabase) {
    // Look up details first so approval can create the directory entry.
    const { data: reg } = await supabase
      .from("org_registrations")
      .select("*")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("org_registrations")
      .update({ status })
      .eq("id", id);

    if (!error && reg && action === "approve") {
      await supabase.from("organisations").upsert(
        {
          name: reg.org_name,
          kind: reg.kind,
          reg_number: reg.reg_number,
          focus: reg.focus,
          region: reg.region,
          verified: true,
          responders: 0,
          funds_raised: 0,
        },
        { onConflict: "reg_number" }
      );
    }

    if (!error) return NextResponse.json({ ok: true, backend: "supabase" });
    // Table missing → fall through to the local store.
  }

  const updated = await setRegistrationStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  if (action === "approve") {
    const existing = await listStoreOrganisations();
    const duplicate = existing.some((o) => o.name === updated.orgName);
    if (!duplicate) {
      await addOrganisation({
        id: randomUUID(),
        name: updated.orgName,
        kind: updated.kind as
          | "NGO"
          | "PWD Company"
          | "Government Body"
          | "Volunteer Group",
        focus: updated.focus,
        region: updated.region,
        verified: true,
        responders: 0,
        fundsRaised: 0,
      });
    }
  }

  return NextResponse.json({ ok: true, backend: "local" });
}
