"use client";

import { useState } from "react";
import { donationSchema, type PaymentMethod } from "@/lib/validation";
import { PAYMENT_METHODS, demoStepsFor } from "@/lib/payments";
import { inr, type Disaster } from "@/lib/data";

const amounts = [500, 1000, 2500, 10000];

const input =
  "h-11 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink placeholder:text-slate-body/70 focus:border-teal-brand";

export function DonateForm({ disasters }: { disasters: Disaster[] }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [step, setStep] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [receipt, setReceipt] = useState<{
    receiptId: string;
    eightyGId: string;
    txnId: string;
    paymentMethod: PaymentMethod;
    name: string;
    amount: number;
  } | null>(null);
  const [custom, setCustom] = useState("");
  const [mountedAt] = useState(() => Date.now());

  const openFunds = disasters.filter((d) => d.status !== "resolved");
  const meta = PAYMENT_METHODS.find((p) => p.id === method)!;

  function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (custom.trim() !== "") fd.set("amount", custom.trim());
    fd.set("paymentMethod", method);
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
      // Demo gateway simulation — no real money moves.
      for (const s of demoStepsFor(method)) {
        setStep(s);
        await sleep(650);
      }
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
        txnId: json.txnId ?? `TXN-${method.toUpperCase()}-DEMO`,
        paymentMethod: method,
        name: parsed.data.name,
        amount: parsed.data.amount,
      });
      setStatus("done");
      setStep(null);
      form.reset();
      setCustom("");
    } catch (err) {
      setStatus("error");
      setStep(null);
      setErrors({ form: err instanceof Error ? err.message : "Donation failed" });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <p className="rounded-xl border border-warn/30 bg-warn-tint px-4 py-3 text-sm leading-6 text-slate-ink">
        <span className="font-ui text-[11px] font-semibold uppercase tracking-widest text-warn">
          Demo checkout&nbsp;·&nbsp;
        </span>
        No real money moves here. Pick any rail — UPI, card, Razorpay, PayPal
        or crypto — and the pledge is recorded to escrow as a demo transaction.
      </p>

      <div>
        <label htmlFor="disasterId" className="mb-1 block text-sm font-medium text-slate-ink">
          Support which emergency?
        </label>
        <select id="disasterId" name="disasterId" defaultValue="" className={input}>
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
            className={input}
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-alert">{errors.amount}</p>}
      </fieldset>

      {/* Payment method picker */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-slate-ink">
          Pay with
        </legend>
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
          {PAYMENT_METHODS.map((p) => (
            <label
              key={p.id}
              className={`cursor-pointer rounded-xl border px-4 py-3 transition-all has-[:checked]:-translate-y-0.5 has-[:checked]:shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                method === p.id
                  ? "border-teal-brand bg-teal-tint"
                  : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pay-rail"
                  checked={method === p.id}
                  onChange={() => setMethod(p.id)}
                  className="accent-teal-700"
                />
                <span className="text-sm font-semibold text-slate-ink">{p.label}</span>
                {p.demo && (
                  <span className="rounded-full bg-warn-tint px-2 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-widest text-warn">
                    demo
                  </span>
                )}
              </span>
              <span className="mt-0.5 block pl-6 text-xs text-slate-body">{p.hint}</span>
            </label>
          ))}
        </div>
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-alert">{errors.paymentMethod}</p>
        )}
        <div className="mt-3">
          <label htmlFor="paymentRef" className="mb-1 block text-sm font-medium text-slate-ink">
            {meta.refLabel}
          </label>
          <input
            id="paymentRef"
            name="paymentRef"
            placeholder={meta.refPlaceholder}
            className={input}
          />
          <p className="mt-1 text-xs text-slate-body">
            {method === "crypto"
              ? "Demo only — never send real funds. A testnet address is enough."
              : method === "card"
                ? "Demo only — enter last 4 digits, never a full card number."
                : "Demo only — nothing is charged or verified with a real provider."}
          </p>
        </div>
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
            className={input}
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
            className={input}
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
        {status === "busy" ? (step ?? "Processing…") : `Donate with ${meta.label} (demo)`}
      </button>
      {status === "busy" && (
        <p className="flex items-center gap-2 text-xs text-slate-body">
          <span className="live-dot inline-block size-1.5 rounded-full bg-teal-brand" />
          {step} No real money moves.
        </p>
      )}

      {status === "done" && receipt && (
        <div className="rise border border-ok/40 bg-ok-tint px-4 py-4 text-sm text-slate-ink">
          <p className="font-ui text-[11px] uppercase tracking-widest text-ok">
            Pledge recorded · {receipt.paymentMethod} demo
          </p>
          <p className="mt-2">
            Thank you, {receipt.name}. Receipt ID{" "}
            <span className="font-mono font-semibold">{receipt.receiptId}</span>{" "}
            for <span className="font-semibold">{inr(receipt.amount)}</span>.
          </p>
          <p className="mt-1 font-mono text-xs">
            txn {receipt.txnId} · 80G {receipt.eightyGId}
          </p>
          <p className="mt-1 text-xs text-slate-body">
            Demo transaction — no real money moved. Funds show as escrowed in
            the public ledger.
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
