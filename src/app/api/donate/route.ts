import { NextResponse } from "next/server";
import { donationSchema } from "@/lib/validation";
import { rateLimit, tooFast } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";
import { addDonation } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`donate:${ip}`, 10, 60_000);
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

  const parsed = donationSchema.safeParse(body);
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

  const receiptId = `RC-DON-${Date.now().toString(36).toUpperCase()}`;
  const eightyGId = `80G-${receiptId}`;
  const supabase = getSupabase();

  if (supabase) {
    // disaster_id is a uuid FK in Supabase while the public directory also
    // lists seed ids ("d1"…). Only send uuids; otherwise use the local store
    // so the pledge is never lost to an FK violation.
    const uuidish =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        parsed.data.disasterId
      );
    const withName = {
      receipt_id: receiptId,
      disaster_id: uuidish ? parsed.data.disasterId : null,
      name: parsed.data.name,
      email: parsed.data.email,
      amount: parsed.data.amount,
      status: "pledged",
    };
    const first = await supabase.from("donations").insert(withName);
    if (!first.error)
      return NextResponse.json({
        ok: true,
        receiptId,
        eightyGId,
        backend: "supabase",
      });
    // Older databases without the name column: retry core-only.
    if (uuidish) {
      const second = await supabase.from("donations").insert({
        receipt_id: receiptId,
        disaster_id: withName.disaster_id,
        email: parsed.data.email,
        amount: parsed.data.amount,
        status: "pledged",
      });
      if (!second.error)
        return NextResponse.json({
          ok: true,
          receiptId,
          eightyGId,
          backend: "supabase",
        });
    }
  }

  await addDonation({
    receiptId,
    disasterId: parsed.data.disasterId,
    name: parsed.data.name,
    email: parsed.data.email,
    amount: parsed.data.amount,
  });

  return NextResponse.json({ ok: true, receiptId, eightyGId, backend: "local" });
}
