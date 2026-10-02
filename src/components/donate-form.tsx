"use client";

import { useState } from "react";
import { donationSchema } from "@/lib/validation";
import { inr, type Disaster } from "@/lib/data";

const amounts = [500, 1000, 2500, 10000];

export function DonateForm({ disasters }: { disasters: Disaster[] }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [receipt, setReceipt] = useState<{
    receiptId: string;
    eightyGId: string;
    name: string;
    amount: number;
  } | null>(null);
  const [custom, setCustom] = useState("");
  const [mountedAt] = useState(() => Date.now());

  const openFunds = disasters.filter((d) => d.status !== "resolved");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Custom amount overrides the preset radio when filled.
    if (custom.trim() !== "") fd.set("amount", custom.trim());
    fd.set("submittedAt", String(mountedAt));

    const payload = Object.fromEntries(fd.entries());

    const parsed = donationSchema.safeParse(payload);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[issue.path.join(".")] = issue.message;
      }
      setErrors(map);
      return;
    }

    setErrors({});
    setStatus("busy");
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Donation failed");
      setReceipt({
        receiptId: json.receiptId,
        eightyGId: json.eightyGId ?? `80G-${json.receiptId}`,
        name: parsed.data.name,
        amount: parsed.data.amount,
      });
      setStatus("done");
      form.reset();
      setCustom("");
    } catch (err) {
      setStatus("error");
      setErrors({ form: err instanceof Error ? err.message : "Donation failed" });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* honeypot + bot-timing */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="disasterId" className="mb-1 block text-sm font-medium text-slate-ink">
          Support which emergency?
        </label>
        <select
          id="disasterId"
          name="disasterId"
          defaultValue=""
          className="h-11 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink focus:border-teal-brand"
        >
          <option value="" disabled>
            Select an emergency fund…
          </option>
          {openFunds.map((d) => (
            <option key={d.id} value={d.id}>
              {d.state} — {d.title}
            </option>
          ))}
        </select>
        {errors.disasterId && (
          <p className="mt-1 text-sm text-alert">{errors.disasterId}</p>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-slate-ink">
          Amount (₹)
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {amounts.map((a) => (
            <label
              key={a}
              className="cursor-pointer border border-line bg-surface px-3 py-2.5 text-center text-sm font-semibold text-slate-ink has-[:checked]:border-teal-brand has-[:checked]:bg-teal-tint has-[:checked]:text-teal-brand"
            >
              <input
                type="radio"
                name="amount"
                value={a}
                className="sr-only"
                defaultChecked={a === 1000}
              />
              {inr(a)}
            </label>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor="customAmount" className="shrink-0 text-sm text-slate-body">
            Or custom:
          </label>
          <input
            id="customAmount"
            type="number"
            min={100}
            max={10000000}
            inputMode="numeric"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g. 7500"
            className="h-11 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink placeholder:text-slate-body/70 focus:border-teal-brand"
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-alert">{errors.amount}</p>}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="donorName" className="mb-1 block text-sm font-medium text-slate-ink">
            Full name
          </label>
          <input
            id="donorName"
            name="name"
            autoComplete="name"
            placeholder="Ananya Sharma"
            className="h-11 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink placeholder:text-slate-body/70 focus:border-teal-brand"
          />
          {errors.name && <p className="mt-1 text-sm text-alert">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-ink">
            Email for receipt
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="h-11 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink placeholder:text-slate-body/70 focus:border-teal-brand"
          />
          {errors.email && <p className="mt-1 text-sm text-alert">{errors.email}</p>}
        </div>
      </div>

      {errors.form && <p className="text-sm text-alert">{errors.form}</p>}

      <button
        type="submit"
        disabled={status === "busy"}
        className="inline-flex h-11 items-center rounded bg-teal-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-brand-hover disabled:opacity-60"
      >
        {status === "busy" ? "Processing…" : "Donate"}
      </button>

      {status === "done" && receipt && (
        <div className="rise border border-ok/40 bg-ok-tint px-4 py-4 text-sm text-slate-ink">
          <p className="font-ui text-[11px] uppercase tracking-widest text-ok">
            Pledge recorded
          </p>
          <p className="mt-2">
            Thank you, {receipt.name}. Receipt ID{" "}
            <span className="font-mono font-semibold">{receipt.receiptId}</span>{" "}
            for <span className="font-semibold">{inr(receipt.amount)}</span>.
          </p>
          <p className="mt-1">
            80G reference{" "}
            <span className="font-mono font-semibold">{receipt.eightyGId}</span>{" "}
            — quote it in your tax filing once the pledge is captured.
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-3 inline-flex h-9 items-center rounded border border-line-strong bg-surface px-4 text-xs font-semibold text-slate-ink hover:bg-canvas"
          >
            Print receipt
          </button>
        </div>
      )}
    </form>
  );
}
