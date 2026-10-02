"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const field =
  "h-10 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink focus:border-teal-brand";

export function TenderCreateForm({
  disasters,
}: {
  disasters: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const skills = String(fd.get("skills") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setBusy(true);
    setError(null);
    setOk(null);
    try {
      const res = await fetch("/api/admin/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          title: String(fd.get("title") ?? ""),
          disasterId: String(fd.get("disasterId") ?? ""),
          region: String(fd.get("region") ?? ""),
          budget: Number(String(fd.get("budget") ?? "0").replace(/[^0-9]/g, "")),
          closesAt: String(fd.get("closesAt") ?? ""),
          skills,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Create failed");
      setOk(`Tender ${json.ref} opened.`);
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="t-title" className="mb-1 block text-sm font-medium text-slate-ink">
          Tender title *
        </label>
        <input id="t-title" name="title" required minLength={6} className={field} placeholder="5,000 tarpaulin kits — Puri shelters" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="t-disaster" className="mb-1 block text-sm font-medium text-slate-ink">
            Linked emergency *
          </label>
          <select id="t-disaster" name="disasterId" required className={field} defaultValue="">
            <option value="" disabled>Select emergency…</option>
            {disasters.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="t-region" className="mb-1 block text-sm font-medium text-slate-ink">
            Region *
          </label>
          <input id="t-region" name="region" required className={field} placeholder="Puri, Odisha" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="t-budget" className="mb-1 block text-sm font-medium text-slate-ink">
            Budget (₹) *
          </label>
          <input id="t-budget" name="budget" type="number" min={1000} required className={field} placeholder="850000" />
        </div>
        <div>
          <label htmlFor="t-closes" className="mb-1 block text-sm font-medium text-slate-ink">
            Closes on *
          </label>
          <input id="t-closes" name="closesAt" type="date" required className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="t-skills" className="mb-1 block text-sm font-medium text-slate-ink">
          Skills (comma separated)
        </label>
        <input id="t-skills" name="skills" className={field} placeholder="Logistics, Procurement" />
      </div>
      {error && <p className="text-sm text-alert">{error}</p>}
      {ok && <p className="border border-ok/40 bg-ok-tint px-3 py-2 text-sm text-slate-ink">{ok}</p>}
      <button type="submit" disabled={busy} className="inline-flex h-10 items-center rounded bg-teal-brand px-5 text-sm font-semibold text-white hover:bg-teal-brand-hover disabled:opacity-60">
        {busy ? "Opening…" : "Open tender"}
      </button>
    </form>
  );
}

export function DisasterStatusActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(next: "active" | "contained" | "resolved") {
    setBusy(next);
    setError(null);
    try {
      const res = await fetch("/api/admin/disasters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Update failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {status === "active" && (
        <button type="button" onClick={() => act("contained")} disabled={busy !== null} className="h-7 rounded bg-slate-ink px-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
          {busy === "contained" ? "…" : "Contain"}
        </button>
      )}
      {status !== "resolved" && (
        <button type="button" onClick={() => act("resolved")} disabled={busy !== null} className="h-7 rounded bg-ok px-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
          {busy === "resolved" ? "…" : "Resolve"}
        </button>
      )}
      {status !== "active" && (
        <button type="button" onClick={() => act("active")} disabled={busy !== null} className="h-7 rounded border border-line-strong px-2.5 text-xs text-slate-ink hover:bg-canvas disabled:opacity-60">
          {busy === "active" ? "…" : "Reopen"}
        </button>
      )}
      {error && <span className="text-[11px] text-alert">{error}</span>}
    </span>
  );
}
