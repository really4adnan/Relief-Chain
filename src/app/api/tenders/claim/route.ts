import { NextResponse } from "next/server";
import { tenderClaimSchema } from "@/lib/validation";
import { rateLimit, tooFast } from "@/lib/rate-limit";
import { adminDb } from "@/lib/supabase-server";
import {
  getStoreTender,
  upsertTender,
  type StoredTender,
} from "@/lib/store";
import { tenders as seedTenders } from "@/lib/data";

export const runtime = "nodejs";

/**
 * Public tender claim flow: a verified-pending organisation claims an Open
 * tender. Validated + rate-limited; writes go through the service-role
 * client (server only) so RLS can stay locked down, with the local store
 * as the source of truth for claim state.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`claim:${ip}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${limit.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = tenderClaimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed." },
      { status: 400 }
    );
  }

  if (
    typeof parsed.data.submittedAt === "number" &&
    tooFast(parsed.data.submittedAt)
  ) {
    return NextResponse.json(
      { error: "Submission was too fast. Please try again." },
      { status: 400 }
    );
  }

  const { tenderId, orgName, email } = parsed.data;

  // Resolve current state: local override first, then seed, then Supabase.
  let base: StoredTender | null = await getStoreTender(tenderId);
  if (!base) {
    const seed = seedTenders.find((t) => t.id === tenderId);
    if (seed) {
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
  }
  if (!base) {
    const sb = adminDb();
    if (sb) {
      const { data } = await sb
        .from("tenders")
        .select("*")
        .eq("id", tenderId)
        .single();
      if (data) {
        base = {
          id: data.id,
          ref: data.ref,
          title: data.title,
          disasterId: data.disaster_id,
          region: data.region,
          budget: Number(data.budget ?? 0),
          status: data.status,
          skills: Array.isArray(data.skills) ? data.skills : [],
          closesAt:
            typeof data.closes_at === "string"
              ? data.closes_at.slice(0, 10)
              : data.closes_at,
          updatedAt: new Date().toISOString(),
        };
      }
    }
  }

  if (!base) {
    return NextResponse.json({ error: "Tender not found." }, { status: 404 });
  }
  if (base.status !== "Open") {
    return NextResponse.json(
      { error: `This tender is already ${base.status.toLowerCase()}.` },
      { status: 409 }
    );
  }

  const claimed: StoredTender = {
    ...base,
    status: "Claimed",
    claimedByName: orgName,
    claimedByEmail: email,
    updatedAt: new Date().toISOString(),
  };
  await upsertTender(claimed);

  // Best-effort Supabase mirror (uuid ids only; seed ids stay local).
  const sb = adminDb();
  if (sb && /^[0-9a-f-]{36}$/i.test(tenderId)) {
    await sb.from("tenders").update({ status: "Claimed" }).eq("id", tenderId);
  }

  return NextResponse.json({ ok: true, ref: claimed.ref, status: "Claimed" });
}
