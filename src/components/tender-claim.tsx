"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useSession } from "@/components/require-auth";
import { loginHref, signupHref } from "@/lib/access";

export function TenderClaim({ tenderId }: { tenderId: string }) {
  const router = useRouter();
  const { loading, email } = useSession();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mountedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("tenderId", tenderId);
    fd.set("submittedAt", String(mountedAt));
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/tenders/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Claim failed");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Claim failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={loading}
        className="inline-flex h-9 items-center gap-1.5 rounded bg-teal-brand px-4 text-sm font-semibold text-white transition-all hover:bg-teal-brand-hover active:translate-y-px disabled:opacity-60"
      >
        <Lock size={13} aria-hidden="true" />
        {loading ? "Checking sign-in…" : "Claim tender"}
      </button>
    );
  }

  // Gated: claiming moves work + money, so it needs a verified identity.
  // The tender list itself stays public for transparency.
  if (!loading && !email) {
    return (
      <div className="rise mt-3 w-full rounded-xl border border-slate-ink/20 bg-slate-ink p-4 text-white">
        <p className="flex items-center gap-1.5 font-ui text-[11px] font-semibold uppercase tracking-widest text-white/60">
          <Lock size={12} className="text-warn" /> Sign in required
        </p>
        <p className="mt-1.5 text-sm leading-6 text-white/80">
          Only signed-in, verified organisations can claim tenders. Sign in,
          then come back to claim this job.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={loginHref("/tenders")}
            className="inline-flex h-9 items-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-widest text-slate-ink"
          >
            Sign in
          </Link>
          <Link
            href={signupHref("/tenders")}
            className="inline-flex h-9 items-center rounded-full border border-white/30 px-4 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Create account
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 items-center rounded-full px-3 text-xs text-white/60 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rise mt-3 w-full border border-line bg-canvas p-4"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`org-${tenderId}`} className="mb-1 block text-xs font-medium text-slate-ink">
            Organisation name *
          </label>
          <input
            id={`org-${tenderId}`}
            name="orgName"
            required
            placeholder="Aarohan Relief Trust"
            className="h-10 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink focus:border-teal-brand"
          />
        </div>
        <div>
          <label htmlFor={`email-${tenderId}`} className="mb-1 block text-xs font-medium text-slate-ink">
            Work email *
          </label>
          <input
            id={`email-${tenderId}`}
            name="email"
            type="email"
            required
            placeholder="contact@org.org"
            className="h-10 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink focus:border-teal-brand"
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-alert">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-9 items-center rounded bg-teal-brand px-4 text-sm font-semibold text-white hover:bg-teal-brand-hover disabled:opacity-60"
        >
          {busy ? "Claiming…" : "Confirm claim"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-9 items-center rounded border border-line bg-surface px-4 text-sm text-slate-ink hover:bg-canvas"
        >
          Cancel
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-body">
        Claims are verified against the directory before work is assigned.
      </p>
    </form>
  );
}

export function TenderAdminActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "advance" | "complete" | "reopen") {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/admin/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Action failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {(status === "Claimed" || status === "In Progress") && (
        <button
          type="button"
          onClick={() => act("advance")}
          disabled={busy !== null}
          className="h-7 rounded bg-slate-ink px-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy === "advance" ? "…" : status === "Claimed" ? "Start work" : "Mark complete"}
        </button>
      )}
      {status !== "Open" && status !== "Completed" && (
        <button
          type="button"
          onClick={() => act("reopen")}
          disabled={busy !== null}
          className="h-7 rounded border border-line-strong px-2.5 text-xs text-slate-ink hover:bg-canvas disabled:opacity-60"
        >
          {busy === "reopen" ? "…" : "Reopen"}
        </button>
      )}
      {status === "Open" && (
        <span className="font-ui text-[10px] uppercase tracking-widest text-slate-body">
          awaiting claim
        </span>
      )}
      {error && <span className="text-[11px] text-alert">{error}</span>}
    </span>
  );
}
