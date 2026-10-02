"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminRegistrationActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "approve" | "reject") {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/admin/registrations", {
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
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => act("approve")}
        disabled={busy !== null}
        className="h-8 rounded bg-ok px-3 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {busy === "approve" ? "Approving…" : "Approve"}
      </button>
      <button
        type="button"
        onClick={() => act("reject")}
        disabled={busy !== null}
        className="h-8 rounded border border-alert/50 bg-alert-tint px-3 text-xs font-semibold text-alert hover:bg-alert hover:text-white disabled:opacity-60"
      >
        {busy === "reject" ? "Rejecting…" : "Reject"}
      </button>
      {error && <span className="text-xs text-alert">{error}</span>}
    </div>
  );
}
