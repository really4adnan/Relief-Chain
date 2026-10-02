import type { SupabaseClient } from "@supabase/supabase-js";
import {
  disasters as seedDisasters,
  organisations as seedOrgs,
  tenders as seedTenders,
  fundsLedger as seedLedger,
  type Disaster,
  type LedgerRow,
  type Organisation,
  type Tender,
} from "./data";
import {
  listStoreDisasters,
  listStoreOrganisations,
  listStoreTenders,
  listLedgerEntries,
  listRegistrations,
  listContacts,
  listDonations,
  listDispatch,
  getDonationApprovals,
  type StoredRegistration,
  type StoredContact,
  type StoredDonation,
  type DispatchEntry,
} from "./store";
import { adminDb } from "./supabase-server";

/**
 * When true (default in dev), seed demo rows are merged with real data so
 * the site works out of the box. Set NEXT_PUBLIC_DEMO_SEED=false in
 * production to hide demo content once real data exists.
 */
export function includeSeeds(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_SEED !== "false";
}

/**
 * Server-side data aggregation.
 * Preference order: Supabase (service role) → local file store → seed data.
 * Every path is fault-tolerant: a missing table or missing env simply falls
 * through to the next source, so the site never breaks.
 */

function adminClient(): SupabaseClient | null {
  // Service-role client (server only, bypasses RLS). Kept behind the
  // supabase-server module so client components can't import it.
  try {
    return adminDb();
  } catch {
    return null;
  }
}

export type Backend = "supabase" | "local";

export function backendInfo(): {
  backend: Backend;
  configured: boolean;
  label: string;
} {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  return {
    backend: configured ? "supabase" : "local",
    configured,
    label: configured ? "Supabase (service role)" : "Local file store (.data/)",
  };
}

// ---- Disasters ----

export async function getAllDisasters(): Promise<Disaster[]> {
  const local = await listStoreDisasters();
  let remote: Disaster[] = [];

  const sb = adminClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("disasters")
        .select("*")
        .order("reported_at", { ascending: false })
        .limit(100);
      if (!error && data) {
        remote = data.map((row) => ({
          id: row.id,
          title: row.title,
          type: row.type,
          severity: row.severity,
          status: row.status,
          region: row.region,
          state: row.state,
          affected: row.affected ?? 0,
          reportedAt: row.reported_at,
          summary: row.summary,
        }));
      }
    } catch {
      /* fall through to local */
    }
  }

  const seeds = includeSeeds() ? seedDisasters : [];
  // Local overrides win: a status-updated local copy replaces the
  // seed/remote row with the same id instead of duplicating it.
  const seen = new Set(local.map((d) => d.id));
  const dedupedRemote = remote.filter((d) => !seen.has(d.id));
  for (const d of dedupedRemote) seen.add(d.id);
  const dedupedSeeds = seeds.filter((d) => !seen.has(d.id));
  return [...local, ...dedupedRemote, ...dedupedSeeds].sort(
    (a, b) => +new Date(b.reportedAt) - +new Date(a.reportedAt)
  );
}

// ---- Organisations ----

export async function getAllOrganisations(): Promise<Organisation[]> {
  const local = await listStoreOrganisations();
  let remote: Organisation[] = [];

  const sb = adminClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("organisations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (!error && data) {
        remote = data.map((row) => ({
          id: row.id,
          name: row.name,
          kind: row.kind,
          focus: row.focus,
          region: row.region,
          verified: Boolean(row.verified),
          responders: row.responders ?? 0,
          fundsRaised: Number(row.funds_raised ?? 0),
        }));
      }
    } catch {
      /* fall through */
    }
  }

  const seeds = includeSeeds() ? seedOrgs : [];
  return [...seeds, ...remote, ...local];
}

// ---- Registrations ----

export async function getAllRegistrations(): Promise<{
  items: StoredRegistration[];
  backend: Backend;
}> {
  const sb = adminClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("org_registrations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (!error && data) {
        const items: StoredRegistration[] = data.map((row) => ({
          id: row.id,
          ref: row.ref,
          orgName: row.org_name,
          kind: row.kind,
          contactName: row.contact_name,
          email: row.email,
          phone: row.phone,
          region: row.region,
          regNumber: row.reg_number,
          focus: row.focus,
          certUrl: row.cert_url ?? undefined,
          pan: row.pan ?? undefined,
          idProof: row.id_proof ?? undefined,
          status: row.status,
          createdAt: row.created_at,
        }));
        return { items, backend: "supabase" };
      }
    } catch {
      /* fall through */
    }
  }
  return { items: await listRegistrations(), backend: "local" };
}

// ---- Contacts ----

export async function getAllContacts(): Promise<{
  items: StoredContact[];
  backend: Backend;
}> {
  const sb = adminClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (!error && data) {
        const items: StoredContact[] = data.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          subject: row.subject,
          message: row.message,
          createdAt: row.created_at,
        }));
        return { items, backend: "supabase" };
      }
    } catch {
      /* fall through */
    }
  }
  return { items: await listContacts(), backend: "local" };
}

// ---- Donations ----

export async function getAllDonations(): Promise<{
  items: StoredDonation[];
  backend: Backend;
}> {
  const sb = adminClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (!error && data) {
        const items: StoredDonation[] = [];
        for (const row of data) {
          // Dual-approval tracker lives in the local store for both
          // backends (Supabase has no approvals column), so hydrate it
          // here or the funds UI can never show "1/2 approvals".
          let approvals: string[] = [];
          try {
            approvals = await getDonationApprovals(row.id);
          } catch {
            approvals = [];
          }
          items.push({
            id: row.id,
            receiptId: row.receipt_id,
            disasterId: row.disaster_id ?? "",
            name: row.name ?? "",
            email: row.email,
            amount: Number(row.amount),
            status: row.status,
            approvals,
            createdAt: row.created_at,
          });
        }
        return { items, backend: "supabase" };
      }
    } catch {
      /* fall through */
    }
  }
  return { items: await listDonations(), backend: "local" };
}

// ---- Tenders (dynamic: seed + Supabase + local overrides win) ----

export async function getAllTenders(): Promise<Tender[]> {
  const overrides = await listStoreTenders();
  const overrideById = new Map(overrides.map((t) => [t.id, t]));

  let remote: Tender[] = [];
  const sb = adminClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("tenders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (!error && data) {
        remote = data.map((row) => ({
          id: row.id,
          ref: row.ref,
          title: row.title,
          disasterId: row.disaster_id,
          region: row.region,
          budget: Number(row.budget ?? 0),
          status: row.status,
          closesAt:
            typeof row.closes_at === "string"
              ? row.closes_at.slice(0, 10)
              : row.closes_at,
          skills: Array.isArray(row.skills) ? row.skills : [],
          claimedByName: undefined,
          claimedByEmail: undefined,
        }));
      }
    } catch {
      /* fall through */
    }
  }

  const merged = [...remote, ...(includeSeeds() ? seedTenders : [])].map((t) => {
    const o = overrideById.get(t.id);
    if (!o) return t;
    return {
      ...t,
      title: o.title,
      region: o.region,
      budget: o.budget,
      status: o.status,
      closesAt: o.closesAt,
      skills: o.skills,
      claimedByName: o.claimedByName,
      claimedByEmail: o.claimedByEmail,
    };
  });

  // Local-only tenders (ids not in seed/remote) are appended.
  const known = new Set(merged.map((t) => t.id));
  for (const o of overrides) {
    if (!known.has(o.id)) {
      merged.push({
        id: o.id,
        ref: o.ref,
        title: o.title,
        disasterId: o.disasterId,
        region: o.region,
        budget: o.budget,
        status: o.status,
        closesAt: o.closesAt,
        skills: o.skills,
        claimedByName: o.claimedByName,
        claimedByEmail: o.claimedByEmail,
      });
    }
  }
  return merged;
}

// ---- Funds ledger (Supabase + local entries + seed rows) ----

export async function getLedgerRows(): Promise<LedgerRow[]> {
  const local = await listLedgerEntries();
  const mapped: LedgerRow[] = local.map((e) => ({
    date: e.createdAt.slice(0, 10),
    ref: e.txnRef,
    note: e.note,
    amount: e.amount,
    kind: e.amount >= 0 ? ("in" as const) : ("out" as const),
  }));

  // Supabase funds_ledger (written by the donations API on finalize).
  // Best-effort: a missing table/column simply yields no remote rows.
  let remote: LedgerRow[] = [];
  const sb = adminClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("funds_ledger")
        .select("txn_ref, note, amount, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (!error && data) {
        remote = data.map((row) => ({
          date: String(row.created_at ?? "").slice(0, 10),
          ref: String(row.txn_ref ?? ""),
          note: String(row.note ?? ""),
          amount: Number(row.amount ?? 0),
          kind: Number(row.amount ?? 0) >= 0 ? ("in" as const) : ("out" as const),
        }));
      }
    } catch {
      /* fall through to local */
    }
  }

  const seeds = includeSeeds() ? seedLedger : [];
  const seen = new Set<string>();
  return [...remote, ...mapped, ...seeds]
    .filter((r) => {
      if (!r.ref || seen.has(r.ref)) return false;
      seen.add(r.ref);
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---- Dispatch log ----
// Supabase alert_dispatch_log first, then the local store. The table only
// stores ids + channel, so titles/names are resolved via FK embeds with a
// graceful fallback when the embed or newer columns are absent.

export async function getAllDispatch(): Promise<DispatchEntry[]> {
  const local = await listDispatch();

  let remote: DispatchEntry[] = [];
  const sb = adminClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("alert_dispatch_log")
        .select(
          "id, disaster_id, org_id, channel, delivered_at, disasters(title), organisations(name)"
        )
        .order("delivered_at", { ascending: false })
        .limit(200);
      if (!error && data) {
        remote = (data as unknown as Array<{
          id: string;
          disaster_id: string;
          channel: string;
          delivered_at: string;
          disasters?: { title?: string } | { title?: string }[] | null;
          organisations?: { name?: string } | { name?: string }[] | null;
        }>).map((row) => {
          const dTitle = Array.isArray(row.disasters)
            ? row.disasters[0]?.title
            : row.disasters?.title;
          const oName = Array.isArray(row.organisations)
            ? row.organisations[0]?.name
            : row.organisations?.name;
          const channel =
            row.channel === "sms" ||
            row.channel === "email" ||
            row.channel === "dashboard" ||
            row.channel === "voice"
              ? row.channel
              : ("dashboard" as const);
          return {
            id: String(row.id),
            disasterId: String(row.disaster_id ?? ""),
            disasterTitle: dTitle ?? "Emergency alert",
            orgName: oName ?? "Verified organisation",
            channel,
            status: "sent" as const,
            sentAt: String(row.delivered_at ?? new Date().toISOString()),
          };
        });
      }
    } catch {
      /* fall through to local */
    }
    // Older schemas without FK embeds: retry with flat columns only.
    if (remote.length === 0) {
      try {
        const { data, error } = await sb
          .from("alert_dispatch_log")
          .select("id, disaster_id, channel, delivered_at")
          .order("delivered_at", { ascending: false })
          .limit(200);
        if (!error && data) {
          remote = data.map((row) => ({
            id: String(row.id),
            disasterId: String(row.disaster_id ?? ""),
            disasterTitle: "Emergency alert",
            orgName: "Verified organisation",
            channel: (row.channel ?? "dashboard") as DispatchEntry["channel"],
            status: "sent" as const,
            sentAt: String(row.delivered_at ?? new Date().toISOString()),
          }));
        }
      } catch {
        /* local only */
      }
    }
  }

  const seen = new Set(remote.map((d) => d.id));
  const onlyLocal = local.filter((d) => !seen.has(d.id));
  return [...onlyLocal, ...remote].sort(
    (a, b) => +new Date(b.sentAt) - +new Date(a.sentAt)
  );
}
