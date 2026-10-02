import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { adminDb } from "@/lib/supabase-server";
import {
  setDonationStatus,
  approveDonation,
  addDonationApproval,
  clearDonationApprovals,
  addLedgerEntry,
  DUAL_APPROVAL_THRESHOLD,
  type StoredDonation,
} from "@/lib/store";

export const runtime = "nodejs";

const bodySchema = z.object({
  id: z.string().min(1),
  action: z.enum(["capture", "refund"]),
  // Human approver handle (e.g. "adnan", "ops-desk-2"). The shared-passcode
  // cookie can't distinguish two admins, so each action must be signed with
  // a distinct handle — two different handles are required for large sums.
  approver: z.string().trim().min(2, "Enter your approver handle").max(60),
});

/**
 * Donation lifecycle with dual approval.
 * - capture: pledged → captured (money in, ledger credit)
 * - refund:  captured → refunded (money out, ledger reversal)
 * Amounts above DUAL_APPROVAL_THRESHOLD (₹5L) need two distinct approver
 * handles; the first call records approval and reports it still needs one
 * more, the second finalizes. Handles are case-insensitive.
 */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`admin-donations:${ip}`, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limited." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { id, action, approver: rawApprover } = parsed.data;
  const approver = rawApprover.trim().toLowerCase();

  // Resolve the donation: Supabase (service role) first, then local store.
  let donation: StoredDonation | null = null;
  let backend: "supabase" | "local" = "local";
  const sb = adminDb();
  if (sb) {
    const { data } = await sb
      .from("donations")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      backend = "supabase";
      donation = {
        id: data.id,
        receiptId: data.receipt_id,
        disasterId: data.disaster_id ?? "",
        name: data.name ?? "",
        email: data.email,
        amount: Number(data.amount),
        status: data.status,
        approvals: [],
        createdAt: data.created_at,
      };
    }
  }
  if (!donation) {
    const { listDonations } = await import("@/lib/store");
    donation = (await listDonations()).find((d) => d.id === id) ?? null;
  }
  if (!donation) {
    return NextResponse.json({ error: "Donation not found." }, { status: 404 });
  }

  const expected = action === "capture" ? "pledged" : "captured";
  const next = action === "capture" ? "captured" : "refunded";
  if (donation.status !== expected) {
    return NextResponse.json(
      { error: `Only ${expected} donations can be ${action}d.` },
      { status: 409 }
    );
  }

  // Dual approval for large amounts.
  if (donation.amount > DUAL_APPROVAL_THRESHOLD) {
    const approvers = await addDonationApproval(id, approver);
    if (backend === "local") await approveDonation(id, approver);
    if (approvers.length < 2) {
      return NextResponse.json({
        ok: true,
        pending: true,
        approvals: approvers.length,
        needed: 2,
        approvers,
        message: `Approval by "${rawApprover.trim()}" recorded — a different approver must confirm.`,
      });
    }
  }

  // Finalize.
  if (backend === "supabase" && sb) {
    const { error } = await sb
      .from("donations")
      .update({ status: next })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Database update failed." }, { status: 500 });
    }
    // Mirror the ledger movement locally + in funds_ledger (best effort).
    await sb.from("funds_ledger").insert({
      txn_ref: `${action === "capture" ? "CR" : "RF"}-${donation.receiptId}`,
      disaster_id: /^[0-9a-f-]{36}$/i.test(donation.disasterId)
        ? donation.disasterId
        : null,
      note:
        action === "capture"
          ? `Donation captured — ${donation.receiptId}`
          : `Donation refunded — ${donation.receiptId}`,
      amount: action === "capture" ? donation.amount : -donation.amount,
    });
  } else {
    await setDonationStatus(id, next);
  }
  await clearDonationApprovals(id);
  await addLedgerEntry({
    txnRef: `${action === "capture" ? "CR" : "RF"}-${donation.receiptId}`,
    disasterId: donation.disasterId,
    note:
      action === "capture"
        ? `Donation captured — ${donation.receiptId}`
        : `Donation refunded — ${donation.receiptId}`,
    amount: action === "capture" ? donation.amount : -donation.amount,
  });

  return NextResponse.json({ ok: true, status: next, backend });
}
