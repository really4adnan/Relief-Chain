"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

/** Desktop auth cluster: session-aware sign-in vs dashboard + sign out. */
export function HeaderAuth() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  // Unconfigured auth resolves immediately without an effect round-trip.
  const [ready, setReady] = useState(() => getSupabase() === null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let live = true;
    sb.auth.getSession().then(({ data }) => {
      if (!live) return;
      setEmail(data.session?.user.email ?? null);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_ev, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!ready) return <span className="hidden w-24 md:inline" />;

  if (!email) {
    return (
      <>
        <Link
          href="/login"
          className="hidden font-ui text-[11px] uppercase tracking-widest text-slate-body transition-colors hover:text-slate-ink md:inline"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="ml-3 inline-flex h-9 items-center bg-teal-brand px-4 font-ui text-[11px] font-medium uppercase tracking-widest text-white transition-colors hover:bg-teal-brand-hover"
        >
          Create account
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/account"
        title={email}
        className="hidden max-w-40 truncate font-ui text-[11px] text-slate-body transition-colors hover:text-slate-ink md:inline"
      >
        {email}
      </Link>
      <Link
        href="/dashboard"
        className="ml-1 hidden font-ui text-[11px] uppercase tracking-widest text-slate-body transition-colors hover:text-slate-ink md:inline"
      >
        Dashboard
      </Link>
      <button
        type="button"
        onClick={signOut}
        className="ml-3 inline-flex h-9 items-center border border-line-strong px-4 font-ui text-[11px] font-medium uppercase tracking-widest text-slate-ink transition-colors hover:bg-canvas"
      >
        Sign out
      </button>
    </>
  );
}
