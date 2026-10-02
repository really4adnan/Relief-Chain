import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import {
  adminSessionCookie,
  passcodeIsValid,
  ADMIN_COOKIE,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`admin-login:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Retry in ${limit.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  let body: { passcode?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const passcode = typeof body.passcode === "string" ? body.passcode : "";
  if (!passcode || !passcodeIsValid(passcode)) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }

  const session = adminSessionCookie(passcode);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(session.name, session.value, session.options);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
