"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const field =
  "h-10 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink focus:border-teal-brand";

export function DispatchForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Dispatch failed");
      setResult(
        `Alert ${json.disasterId} created — ${json.notified} verified bodies notified (${json.backend}).`
      );
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dispatch failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-ink">
          Alert title *
        </label>
        <input
          id="title"
          name="title"
          required
          className={field}
          placeholder="Brahmaputra breaches embankment — Dibrugarh"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-ink">
            Type *
          </label>
          <select id="type" name="type" defaultValue="Flood" className={field}>
            {["Flood", "Earthquake", "Cyclone", "Wildfire", "Landslide", "Heatwave"].map(
              (t) => (
                <option key={t}>{t}</option>
              )
            )}
          </select>
        </div>
        <div>
          <label htmlFor="severity" className="mb-1 block text-sm font-medium text-slate-ink">
            Severity *
          </label>
          <select id="severity" name="severity" defaultValue="critical" className={field}>
            <option value="critical">critical</option>
            <option value="high">high</option>
            <option value="moderate">moderate</option>
          </select>
        </div>
        <div>
          <label htmlFor="affected" className="mb-1 block text-sm font-medium text-slate-ink">
            People affected *
          </label>
          <input
            id="affected"
            name="affected"
            type="number"
            min={0}
            defaultValue={1000}
            required
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="region" className="mb-1 block text-sm font-medium text-slate-ink">
            District / region *
          </label>
          <input id="region" name="region" required className={field} placeholder="Dibrugarh" />
        </div>
        <div>
          <label htmlFor="state" className="mb-1 block text-sm font-medium text-slate-ink">
            State *
          </label>
          <input id="state" name="state" required className={field} placeholder="Assam" />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="mb-1 block text-sm font-medium text-slate-ink">
          Situation summary * (min 20 characters)
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          required
          className="w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-slate-ink focus:border-teal-brand"
          placeholder="What happened, what's needed, which areas are cut off…"
        />
      </div>

      {error && <p className="text-sm text-alert">{error}</p>}
      {result && (
        <p className="border border-ok/40 bg-ok-tint px-3 py-2 text-sm text-slate-ink">
          {result}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-10 items-center rounded bg-alert px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Broadcasting…" : "Broadcast alert"}
      </button>
      <p className="text-xs text-slate-body">
        Creates the disaster record and fans out per-channel dispatch entries
        (dashboard, SMS, email, voice) to every verified organisation.
        Dashboard delivery is instant; SMS/email/voice send live once provider
        keys are set (see <span className="font-mono">SMS_PROVIDER_KEY</span>,{" "}
        <span className="font-mono">EMAIL_PROVIDER_KEY</span>,{" "}
        <span className="font-mono">VOICE_PROVIDER_KEY</span>).
      </p>
    </form>
  );
}
