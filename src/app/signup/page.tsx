"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, authField, authLabel } from "@/components/auth-shell";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { getSupabase } from "@/lib/supabase";
import { signupSchema } from "@/lib/validation";

export default function SignupPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "busy" | "confirm">("idle");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = signupSchema.safeParse(
      Object.fromEntries(new FormData(form).entries()),
    );

    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) map[issue.path.join(".")] = issue.message;
      setErrors(map);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setErrors({
        form: "Auth not configured yet — connect Supabase in .env.local first.",
      });
      return;
    }

    setErrors({});
    setStatus("busy");
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.fullName, phone: parsed.data.phone },
      },
    });

    if (error) {
      setStatus("idle");
      setErrors({ form: error.message });
      return;
    }

    if (data.session) {
      router.push("/start");
      router.refresh();
      return;
    }
    setStatus("confirm");
    form.reset();
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Create your account."
      desc="Takes under a minute. Google one-tap works too — after signup we ask why you're here, then show what nature can do and how ReliefChain helps."
      points={[
        "Continue with Google in one tap",
        "Free forever for verified organisations",
        "One account, many responders on your team",
      ]}
      alt={{
        href: "/login",
        label: "Sign in instead",
        text: "Already have an account?",
      }}
    >
      {status === "confirm" ? (
        <div className="border border-ok/40 bg-ok-tint p-5">
          <p className="font-ui text-[10px] uppercase tracking-widest text-ok">
            Confirmation sent
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-ink">
            Check your inbox and confirm your email, then sign in. If it hasn&apos;t
            arrived in 2 minutes, look in spam or{" "}
            <Link href="/login" className="underline">
              try signing in
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <GoogleAuthButton mode="signup" next="/start" />
          <div className="my-5 flex items-center gap-3 font-ui text-[10px] uppercase tracking-widest text-slate-body/70">
            <span className="h-px flex-1 bg-line" />
            or with email
            <span className="h-px flex-1 bg-line" />
          </div>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="fullName" className={authLabel}>
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              autoComplete="name"
              placeholder="Ananya Sharma"
              className={authField}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-alert">{errors.fullName}</p>
            )}
          </div>

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
            {errors.email && <p className="mt-1 text-xs text-alert">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className={authLabel}>
              Indian mobile number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              className={authField}
            />
            {errors.phone && <p className="mt-1 text-xs text-alert">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="password" className={authLabel}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={authField}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-alert">{errors.password}</p>
            )}
          </div>

          {errors.form && (
            <p className="border border-alert/40 bg-alert-tint px-3 py-2 text-sm text-alert">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "busy"}
            className="inline-flex h-11 w-full items-center justify-center bg-teal-brand px-6 font-ui text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-teal-brand-hover disabled:opacity-60"
          >
            {status === "busy" ? "Creating account…" : "Create account"}
          </button>

          <p className="font-ui text-[10px] leading-4 uppercase tracking-widest text-slate-body">
            By continuing you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-4">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              privacy policy
            </Link>
            .
          </p>
          </form>
        </>
      )}
    </AuthShell>
  );
}
