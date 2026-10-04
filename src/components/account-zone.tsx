"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { Reveal } from "@/components/motion";
import { Kicker } from "@/components/ui";
import { getSupabase } from "@/lib/supabase";

const quickLinks = [
  {
    href: "/register",
    icon: Building2,
    title: "Register organisation",
    desc: "Get verified in ~48 hours.",
    tint: "bg-warn-tint text-warn",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    desc: "Dispatch queue + live map.",
    tint: "bg-teal-tint text-teal-brand",
  },
  {
    href: "/tenders",
    icon: HandCoins,
    title: "Relief tenders",
    desc: "Claim open relief work.",
    tint: "bg-ok-tint text-ok",
  },
  {
    href: "/donate",
    icon: HeartHandshake,
    title: "Donate",
    desc: "Public ledger, ₹0 commission.",
    tint: "bg-teal-tint text-teal-brand",
  },
  {
    href: "/learn",
    icon: GraduationCap,
    title: "Know nature",
    desc: "Know why disasters happen.",
    tint: "bg-warn-tint text-warn",
  },
  {
    href: "/start",
    icon: UserRound,
    title: "What do you want to do?",
    desc: "Pick your path again.",
    tint: "bg-canvas text-slate-ink",
  },
];

export function AccountZone() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setReady(true);
      return;
    }
    let live = true;
    sb.auth.getSession().then(({ data }) => {
      if (!live) return;
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_ev, session) => {
      if (!live) return;
      setUser(session?.user ?? null);
      setReady(true);
    });
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const sb = getSupabase();
    setSigningOut(true);
    if (sb) await sb.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const name =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Relief member";
  const phone = user?.user_metadata?.phone as string | undefined;
  const provider = user?.app_metadata?.provider === "google" ? "Google" : "Email";
  const since = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      {/* Profile header */}
      <section className="bg-canvas px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-espresso text-bone">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="ember-breathe absolute -left-20 -top-20 size-80 rounded-full bg-teal-brand/40 blur-[100px]" />
            <div className="float-y-slow absolute -bottom-24 right-[-4rem] size-96 rounded-full bg-umber/50 blur-[120px]" />
          </div>
          <p
            aria-hidden
            className="ghost-type pointer-events-none absolute -bottom-6 left-0 z-[1] select-none whitespace-nowrap font-display text-[20vw] font-bold leading-none text-bone lg:text-[15rem]"
          >
            YOU
          </p>
          <div className="relative z-[2] flex flex-col gap-6 px-6 pb-10 pt-12 sm:px-10 lg:flex-row lg:items-center lg:px-14">
            {!ready ? (
              <div className="shimmer h-24 w-full max-w-md rounded-2xl" />
            ) : user ? (
              <>
                <span className="grid size-20 shrink-0 place-items-center rounded-full bg-bone font-display text-4xl font-bold text-espresso">
                  {name[0]?.toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-bone/60">
                    <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
                    Signed in · {provider}
                  </p>
                  <h1 className="mt-2 truncate font-display text-3xl font-bold tracking-tight text-bone sm:text-5xl">
                    {name}
                  </h1>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-bone/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={14} /> {user.email}
                    </span>
                    {phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={14} /> {phone}
                      </span>
                    )}
                    {since && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} /> Member since {since}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="inline-flex h-12 shrink-0 items-center rounded-full border border-bone/30 px-7 font-ui text-xs font-semibold uppercase tracking-widest text-bone transition-all hover:-translate-y-0.5 hover:bg-bone/10 disabled:opacity-60 lg:ml-auto"
                >
                  <LogOut size={15} className="mr-2" />
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </>
            ) : (
              <div className="w-full">
                <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-bone/60">
                  <UserRound size={13} className="text-warn" /> Your account
                </p>
                <h1 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight text-bone sm:text-5xl">
                  You&apos;re browsing as a guest.
                </h1>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-bone/70">
                  Sign in to keep your place on the chain — your tenders,
                  donations and organisation live here. No account? Know
                  Nature, live tracking, NDMA drills and impact reports stay
                  open for everyone.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {ready && !user ? (
        <section className="bg-canvas">
          <div className="mx-auto grid max-w-3xl gap-4 px-4 py-10 sm:px-6">
            <Reveal>
              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <GoogleAuthButton mode="signin" next="/account" />
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-teal-brand px-7 font-ui text-xs font-semibold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5"
                  >
                    <LogIn size={15} className="mr-2" /> Sign in with email
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-line-strong bg-surface px-7 font-ui text-xs font-semibold uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5"
                  >
                    Create account →
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="bg-canvas">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <Reveal>
              <div className="mb-6">
                <Kicker>Your chain · everything in one place</Kicker>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-ink">
                  What do you want to do next?
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((l, i) => (
                <Reveal key={l.href + l.title} delay={(i % 3) * 90}>
                  <Link
                    href={l.href}
                    className="lift group flex h-full items-center gap-4 rounded-2xl border border-line bg-surface p-5"
                  >
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-full ${l.tint} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <l.icon size={21} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-bold tracking-tight text-slate-ink">
                        {l.title}
                      </span>
                      <span className="block truncate text-sm text-slate-body">
                        {l.desc}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      className="ml-auto shrink-0 text-teal-brand transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-ok/40 bg-ok-tint px-5 py-4 text-sm text-slate-ink">
                <ShieldCheck size={17} className="shrink-0 text-ok" />
                Only verified organisations get dispatch alerts and can claim
                tenders — registration is free and takes 4 minutes.
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
