"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [msg, setMsg] = useState("Confirming your Google sign-in…");

  useEffect(() => {
    const next = params.get("next") || "/start";
    const sb = getSupabase();
    if (!sb) {
      setMsg("Auth not configured — returning home…");
      const t = setTimeout(() => router.replace("/"), 1600);
      return () => clearTimeout(t);
    }
    let live = true;
    let tries = 0;
    const tick = async () => {
      const { data } = await sb.auth.getSession();
      if (!live) return;
      if (data.session) {
        router.replace(next);
        router.refresh();
        return;
      }
      tries += 1;
      if (tries > 20) {
        setMsg("Still waiting on Google… you can head home and try again.");
        return;
      }
      setTimeout(tick, 400);
    };
    tick();
    const { data: sub } = sb.auth.onAuthStateChange((_ev, session) => {
      if (session) {
        router.replace(next);
        router.refresh();
      }
    });
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, [router, params]);

  return (
    <div className="mx-auto grid max-w-md place-items-center px-4 py-24 text-center">
      <div className="w-full rounded-3xl border border-line bg-surface p-10">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-teal-brand text-white">
          <span className="live-dot inline-block size-2 rounded-full bg-white" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-slate-ink">
          Signing you in…
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-body">{msg}</p>
        <div className="shimmer mx-auto mt-6 h-2 w-40 rounded-full" />
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-md place-items-center px-4 py-24 text-center">
          <div className="w-full rounded-3xl border border-line bg-surface p-10">
            <p className="font-ui text-xs uppercase tracking-widest text-slate-body">
              Signing you in…
            </p>
          </div>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
