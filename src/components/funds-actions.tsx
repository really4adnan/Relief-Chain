"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DonationActions({
  id,
  status,
  amount,
}: {
  id: string;
  status: string;
  amount: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"capture" | "refund" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [approver, setApprover] = useState("");
  const needsDual = amount > 500000;

  async function act(action: "capture" | "refund") {
    const handle = approver.trim();
    if (handle.length < 2) {
      setError("Enter your approver handle (min 2 chars) before confirming.");
      return;
    }
    setBusy(action);
    setMsg(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, approver: handle }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Action failed");
      if (json.pending) {
        const who = Array.isArray(json.approvers) && json.approvers.length > 0
          ? ` (${json.approvers.join(", ")})`
          : "";
        setMsg(
          `Approval ${json.approvals}/2 recorded${who} — a different approver must confirm${needsDual ? " (dual approval > ₹5L)" : ""}.`
        );
      } else {
        router.refresh();
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  if (status !== "pledged" && status !== "captured") return null;

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <input
        value={approver}
        onChange={(e) => setApprover(e.target.value)}
        placeholder="approver handle"
        aria-label="Approver handle"
        className="h-7 w-28 rounded border border-line bg-surface px-2 font-mono text-[11px] text-slate-ink placeholder:text-slate-body/60 focus:border-teal-brand"
      />
      {status === "pledged" && (
        <button
          type="button"
          onClick={() => act("capture")}
          disabled={busy !== null}
          className="h-7 rounded bg-ok px-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy === "capture" ? "…" : "Capture"}
        </button>
      )}
      {status === "captured" && (
        <button
          type="button"
          onClick={() => act("refund")}
          disabled={busy !== null}
          className="h-7 rounded border border-alert/50 bg-alert-tint px-2.5 text-xs font-semibold text-alert hover:bg-alert hover:text-white disabled:opacity-60"
        >
          {busy === "refund" ? "…" : "Refund"}
        </button>
      )}
      {msg && <span className="text-[11px] text-warn">{msg}</span>}
      {error && <span className="text-[11px] text-alert">{error}</span>}
    </span>
  );
}
