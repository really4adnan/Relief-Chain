"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { loginHref, signupHref, gateCopy } from "@/lib/access";

type SessionState = { loading: boolean; email: string | null };

/** Shared session hook: Supabase session when configured, demo fallback otherwise. */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>(() => ({
    loading: getSupabase() !== null,
    email: null,
  }));

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      // Demo mode (no Supabase keys): honour a local demo session so the
      // gated flows can still be tried end-to-end without real auth.
      try {
        const demo = window.localStorage.getItem("reliefchain-demo-user");
        setState({ loading: false, email: demo });
      } catch {
        setState({ loading: false, email: null });
      }
      return;
    }
    let live = true;
    sb.auth.getSession().then(({ data }) => {
      if (!live) return;
      setState({ loading: false, email: data.session?.user.email ?? null });
    });
    const { data: sub } = sb.auth.onAuthStateChange((_ev, session) => {
      if (!live) return;
      setState({ loading: false, email: session?.user.email ?? null });
    });
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

/**
 * Gate for actions that need verification: donate, register, claim tender.
 * Public content (Know Nature, live map, NDMA drills, impact reports)
 * stays outside this component. When signed out, children are replaced
 * with a sign-in card that preserves `next` so users land back here.
 */
export function RequireAuth({
  children,
  next,
  action,
  compact = false,
}: {
  children: React.ReactNode;
  /** Where to return after sign-in. Defaults to the current path. */
  next?: string;
  /** Human-readable action, e.g. "donate and pay". Defaults from path. */
  action?: string;
  /** Smaller padding for inline use (e.g. inside a tender card). */
  compact?: boolean;
}) {
  const pathname = usePathname();
  const target = next ?? pathname ?? "/donate";
  const { loading, email } = useSession();

  if (loading) {
    return (
      <div
        aria-busy="true"
        className={`shimmer rounded-2xl border border-line ${compact ? "h-24" : "h-48"}`}
      />
    );
  }

  if (email) return <>{children}</>;

  const verb = action ?? gateCopy(target);

  return (
    <div
      className={`rounded-2xl border border-slate-ink/20 bg-slate-ink text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
        compact ? "p-4" : "p-6 sm:p-8"
      }`}
    >
      <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-white/60">
        <Lock size={13} className="text-warn" />
        Sign in required
      </p>
      <h2
        className={`mt-2 font-display font-bold tracking-tight ${
          compact ? "text-lg" : "text-2xl sm:text-3xl"
        }`}
      >
        Sign in to {verb}.
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
        Donations, registrations and tender claims need a verified identity —
        that&apos;s what keeps money and work leak-proof. Learning pages, live
        tracking, NDMA drills and impact reports stay open for everyone, no
        account needed.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={loginHref(target)}
          className="inline-flex h-11 items-center rounded-full bg-white px-6 font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5"
        >
          Sign in
        </Link>
        <Link
          href={signupHref(target)}
          className="inline-flex h-11 items-center rounded-full border border-white/30 px-6 font-ui text-[11px] font-semibold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
        >
          Create account
        </Link>
      </div>
      {!compact && (
        <p className="mt-4 text-sm text-white/60">
          Just looking?{" "}
          <Link href="/learn" className="underline underline-offset-4 text-white">
            Know Nature
          </Link>{" "}
          ·{" "}
          <Link href="/live" className="underline underline-offset-4 text-white">
            Live tracking
          </Link>{" "}
          ·{" "}
          <Link href="/learn#ndma-drills" className="underline underline-offset-4 text-white">
            NDMA drills
          </Link>
        </p>
      )}
    </div>
  );
}
