"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell, authField, authLabel } from "@/components/auth-shell";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { PasskeyButton } from "@/components/passkey-button";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "link" | "reset">("signin");
  const [nextPath, setNextPath] = useState("/start");
  const router = useRouter();

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n && n.startsWith("/") && !n.startsWith("//")) setNextPath(n);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const next = nextPath;

    const supabase = getSupabase();
    if (!supabase) {
      // Demo mode (no Supabase keys): keep a local demo session so gated
      // flows — donate, register, claim tender — can still be tried.
      try {
        window.localStorage.setItem("reliefchain-demo-user", email || "demo@reliefchain.org");
      } catch {
        /* private mode — still continue */
      }
      router.push(next);
      router.refresh();
      return;
    }

    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === "reset") {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      setBusy(false);
      if (err) {
        setError(err.message);
        return;
      }
      setNotice("Reset link sent — check your inbox, then sign in.");
      return;
    }

    if (mode === "link") {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      setBusy(false);
      if (err) {
        setError(err.message);
        return;
      }
      setNotice("Magic link sent — tap it in your inbox to sign in.");
      return;
    }

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      title={
        mode === "reset"
          ? "Reset your password."
          : mode === "link"
            ? "Check your inbox."
            : "Sign in to see."
      }
      desc="You asked what nature can do — step inside. One login opens live disasters, relief work and Know Nature lessons for your whole team."
      points={[
        "Google redirect, passkey, or magic link — no waiting rooms",
        "Role-based access for NGO, PWD & gov bodies",
        "Real-time alerts across all 36 states & UTs",
      ]}
      alt={{
        href: "/signup",
        label: "Create an account",
        text: "New to ReliefChain?",
      }}
    >
      <GoogleAuthButton mode="signin" next={nextPath} />

      <div className="my-5">
        <PasskeyButton next={nextPath} />
      </div>

      <div className="my-5 flex items-center gap-3 font-ui text-[10px] uppercase tracking-widest text-slate-body/70">
        <span className="h-px flex-1 bg-line" />
        or with email
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className={authLabel}>
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="contact@yourorg.in"
            className={authField}
          />
        </div>
        {mode === "signin" && (
          <div>
            <label htmlFor="password" className={authLabel}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={authField}
            />
          </div>
        )}

        {error && (
          <p className="border border-alert/40 bg-alert-tint px-3 py-2 text-sm text-alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="border border-ok/40 bg-ok-tint px-3 py-2 text-sm text-slate-ink">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 w-full items-center justify-center bg-teal-brand px-6 font-ui text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-teal-brand-hover disabled:opacity-60"
        >
          {busy
            ? mode === "reset" || mode === "link"
              ? "Sending…"
              : "Signing in…"
            : mode === "reset"
              ? "Send reset link"
              : mode === "link"
                ? "Send magic link"
                : "Sign in"}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "link" ? "signin" : "link");
              setError(null);
              setNotice(null);
            }}
            className="text-center font-ui text-[11px] uppercase tracking-widest text-slate-body hover:text-slate-ink"
          >
            {mode === "link" ? "← Use password instead" : "Email me a magic link"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "reset" ? "signin" : "reset");
              setError(null);
              setNotice(null);
            }}
            className="text-center font-ui text-[11px] uppercase tracking-widest text-slate-body hover:text-slate-ink"
          >
            {mode === "reset" ? "← Back to sign in" : "Forgot password?"}
          </button>
        </div>

        {mode === "signin" && (
          <div>
            <button
              type="button"
              onClick={() => router.push("/start")}
              className="inline-flex h-11 w-full items-center justify-center border border-line-strong bg-surface px-6 font-ui text-xs font-medium uppercase tracking-widest text-slate-ink transition-colors hover:bg-canvas"
            >
              Explore without signing in
            </button>
            <p className="mt-2 text-center text-xs leading-5 text-slate-body">
              Skipping keeps Know Nature, live tracking, NDMA drills and impact
              reports open — donating, registering and claiming need sign-in.
            </p>
          </div>
        )}
      </form>

      <p className="mt-5 font-ui text-[10px] uppercase tracking-widest text-slate-body">
        Prefer onboarding first?{" "}
        <Link
          href="/register"
          className="text-slate-ink underline underline-offset-4"
        >
          Register an organisation
        </Link>
      </p>
    </AuthShell>
  );
}
