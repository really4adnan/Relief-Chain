import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { rateLimit, tooFast } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";
import { addContact } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
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

  const parsed = contactSchema.safeParse(body);
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

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    if (!error) return NextResponse.json({ ok: true, backend: "supabase" });
  }

  await addContact({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  return NextResponse.json({ ok: true, backend: "local" });
}
