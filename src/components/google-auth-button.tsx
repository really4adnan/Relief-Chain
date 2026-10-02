"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.3h6.5c0 1-.7 2.6-2.6 3.7l-.1.4 3.7 2.9.3.1c2.3-2.1 3.7-5.2 3.7-9.1z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.4.1-3 2.3-.1.4C3.7 21.3 7.5 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4l-.1-.4-3-2.3-.4.2C.6 9.3 0 10.6 0 12s.6 2.7 1.7 3.9l3.5-1.5z"
      />
      <path
        fill="#EA4335"
        d="M12 4.6c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.7 2.7 1.7 7.1l3.5 2.9c1-2.9 3.7-5.4 6.8-5.4z"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  mode = "signin",
  next = "/start",
}: {
  mode?: "signin" | "signup";
  next?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle() {
    const sb = getSupabase();
    if (!sb) {
      setError("Connect Supabase in .env.local first, then Google login will work.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
            : undefined,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (err) {
      setBusy(false);
      setError(err.message);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handle}
        disabled={busy}
        className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-line-strong bg-surface px-6 font-ui text-xs font-semibold uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5 hover:border-slate-ink hover:shadow-[0_10px_28px_rgba(27,11,7,0.15)] disabled:opacity-60"
      >
        <GoogleG />
        {busy
          ? "Opening Google…"
          : mode === "signup"
            ? "Continue with Google"
            : "Sign in with Google"}
      </button>
      {error && (
        <p className="mt-2 border border-alert/40 bg-alert-tint px-3 py-2 text-xs text-alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-center font-ui text-[10px] uppercase tracking-widest text-slate-body/70">
        One tap · no password needed
      </p>
    </div>
  );
}
