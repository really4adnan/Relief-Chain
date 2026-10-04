/**
 * Central access rules for ReliefChain.
 *
 * PUBLIC (no sign-in): everything that teaches or informs —
 * Know Nature lessons, NDMA drills, live tracking, disaster
 * register, impact reports, government/buyer info, static pages.
 *
 * GATED (sign-in required): everything that moves money, identity
 * or work — donate + payments, organisation registration,
 * tender claims, dashboard and account. These need a verified
 * identity before they can run.
 */

export const PUBLIC_ROUTES = [
  "/",
  "/start",
  "/learn",
  "/live",
  "/disasters",
  "/impact",
  "/government",
  "/directory",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
] as const;

export const GATED_ROUTES = [
  "/donate",
  "/register",
  "/tenders",
  "/dashboard",
  "/account",
] as const;

export const GATED_ACTIONS: Record<string, string> = {
  "/donate": "donate and pay",
  "/register": "register your organisation",
  "/tenders": "claim a tender",
  "/dashboard": "open the operations dashboard",
  "/account": "open your account",
};

export function gateCopy(path: string): string {
  for (const [prefix, action] of Object.entries(GATED_ACTIONS)) {
    if (path === prefix || path.startsWith(prefix + "/")) return action;
  }
  return "continue";
}

export function loginHref(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export function signupHref(next: string): string {
  return `/signup?next=${encodeURIComponent(next)}`;
}
