"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "./logo";

export function AdminLogin({ hint }: { hint?: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const passcode = new FormData(e.currentTarget).get("passcode");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Login failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="border border-line bg-surface p-6">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-teal-brand" />
          <span className="font-semibold text-slate-ink">ReliefChain Admin</span>
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-ink">
          Administrator sign-in
        </h1>
        <p className="mt-1 text-sm">
          Enter the admin passcode to open the control panel.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="passcode"
              className="mb-1 block text-sm font-medium text-slate-ink"
            >
              Admin passcode
            </label>
            <input
              id="passcode"
              name="passcode"
              type="password"
              required
              autoFocus
              className="h-11 w-full rounded border border-line bg-surface px-3 font-mono text-sm text-slate-ink focus:border-teal-brand"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-alert">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 w-full items-center justify-center rounded bg-teal-brand px-6 text-sm font-semibold text-white hover:bg-teal-brand-hover disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {hint && (
          <p className="mt-4 border border-warn/40 bg-warn-tint px-3 py-2 text-xs leading-5 text-slate-ink">
            Development mode: no <span className="font-mono">ADMIN_PASSCODE</span>{" "}
            set in <span className="font-mono">.env.local</span> — the default
            passcode is <span className="font-mono font-semibold">{hint}</span>.
            Set your own before going live.
          </p>
        )}
        {!hint && (
          <p className="mt-4 text-xs leading-5 text-slate-body">
            Set <span className="font-mono">ADMIN_PASSCODE</span> in{" "}
            <span className="font-mono">.env.local</span> to enable the panel.
          </p>
        )}
      </div>
    </div>
  );
}
