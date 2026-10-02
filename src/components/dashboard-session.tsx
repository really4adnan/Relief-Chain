"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

/**
 * Dashboard identity strip: shows the real signed-in user when Supabase auth
 * is configured, otherwise the demo notice. Includes sign out.
 */
export function DashboardSession({ demo }: { demo: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_ev, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (email) {
    return (
      <div className="rise mb-6 flex flex-wrap items-center gap-3 border border-teal-brand/30 bg-teal-tint px-4 py-3 text-sm text-slate-ink">
        <span>
          Signed in as <span className="font-mono font-semibold">{email}</span>
        </span>
        <button
          type="button"
          onClick={signOut}
          className="ml-auto border border-line-strong bg-surface px-3 py-1.5 font-ui text-[10px] uppercase tracking-widest hover:bg-canvas"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (demo) {
    return (
      <div className="mb-6 border border-warn/40 bg-warn-tint px-4 py-3 text-sm text-slate-ink">
        Demo data shown — connect Supabase (see{" "}
        <span className="font-mono">.env.example</span>) to enable real
        accounts, verification and dispatch logs.{" "}
        <Link href="/login" className="font-semibold text-teal-brand underline">
          Sign in
        </Link>{" "}
        once configured.
      </div>
    );
  }

  return null;
}
