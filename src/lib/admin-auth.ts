import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "rc_admin";

const DEV_PASSCODE = "reliefchain-dev";

function secret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSCODE ??
    "reliefchain-local-secret"
  );
}

/** The passcode the admin must know right now. */
export function currentPasscode(): string | null {
  if (process.env.ADMIN_PASSCODE) return process.env.ADMIN_PASSCODE;
  // Convenience default for local development only.
  return process.env.NODE_ENV !== "production" ? DEV_PASSCODE : null;
}

/** Cookie value = HMAC of the passcode — a forged value can't be guessed. */
export function signSession(passcode: string): string {
  return createHmac("sha256", secret()).update(`rc-admin:${passcode}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function passcodeIsValid(input: string): boolean {
  const expected = currentPasscode();
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function sessionCookieIsValid(value: string | undefined): boolean {
  const expected = currentPasscode();
  if (!expected || !value) return false;
  return safeEqual(value, signSession(expected));
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return sessionCookieIsValid(store.get(ADMIN_COOKIE)?.value);
}

/** For API routes: returns a 401 response when the caller isn't an admin. */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json(
    { error: "Admin authentication required." },
    { status: 401 }
  );
}

export function adminSessionCookie(passcode: string) {
  return {
    name: ADMIN_COOKIE,
    value: signSession(passcode),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    },
  };
}
