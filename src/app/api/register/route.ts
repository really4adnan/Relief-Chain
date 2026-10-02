import { NextResponse } from "next/server";
import { orgRegistrationSchema } from "@/lib/validation";
import { rateLimit, tooFast } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";
import { addRegistration } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`register:${ip}`, 5, 60_000);
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

  const parsed = orgRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed." },
      { status: 400 }
    );
  }

  // Bot-timing check: forms submitted almost instantly are automated.
  if (
    typeof parsed.data.submittedAt === "number" &&
    tooFast(parsed.data.submittedAt)
  ) {
    return NextResponse.json(
      { error: "Submission was too fast. Please try again." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  const ref = `RC-REG-${Date.now().toString(36).toUpperCase()}`;
  const d = parsed.data;

  if (supabase) {
    // Try with document columns first (new schema); fall back to the core
    // columns for databases created before the docs migration.
    const withDocs = {
      ref,
      org_name: d.orgName,
      kind: d.kind,
      contact_name: d.contactName,
      email: d.email,
      phone: d.phone,
      region: d.region,
      reg_number: d.regNumber,
      focus: d.focus,
      status: "pending",
      cert_url: d.certUrl || null,
      pan: d.pan || null,
      id_proof: d.idProof || null,
    };
    const first = await supabase.from("org_registrations").insert(withDocs);
    if (!first.error)
      return NextResponse.json({ ok: true, ref, backend: "supabase" });
    const second = await supabase.from("org_registrations").insert({
      ref,
      org_name: d.orgName,
      kind: d.kind,
      contact_name: d.contactName,
      email: d.email,
      phone: d.phone,
      region: d.region,
      reg_number: d.regNumber,
      focus: d.focus,
      status: "pending",
    });
    // Table missing / auth error → keep working with the local store.
    if (!second.error)
      return NextResponse.json({ ok: true, ref, backend: "supabase" });
  }

  await addRegistration({
    ref,
    orgName: d.orgName,
    kind: d.kind,
    contactName: d.contactName,
    email: d.email,
    phone: d.phone,
    region: d.region,
    regNumber: d.regNumber,
    focus: d.focus,
    certUrl: d.certUrl || undefined,
    pan: d.pan || undefined,
    idProof: d.idProof || undefined,
  });

  return NextResponse.json({ ok: true, ref, backend: "local" });
}
