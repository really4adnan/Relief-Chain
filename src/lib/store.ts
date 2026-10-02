import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Disaster, Organisation } from "./data";

/**
 * Local JSON store. Used when Supabase is not configured (or a write fails),
 * so the whole flow — register → verify → dispatch — works out of the box.
 * On serverless hosts where the filesystem is read-only, every call degrades
 * to empty/default data instead of crashing.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "store.json");

export interface StoredRegistration {
  id: string;
  ref: string;
  orgName: string;
  kind: string;
  contactName: string;
  email: string;
  phone: string;
  region: string;
  regNumber: string;
  focus: string;
  /** Verification documents (links / ids supplied at onboarding). */
  certUrl?: string;
  pan?: string;
  idProof?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface StoredContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export type DispatchChannel = "sms" | "email" | "dashboard" | "voice";

export type DispatchStatus = "sent" | "queued";

export interface StoredDonation {
  id: string;
  receiptId: string;
  disasterId: string;
  name: string;
  email: string;
  amount: number;
  status: "pledged" | "captured" | "refunded";
  /** Distinct approver ids for dual approval on large captures/refunds. */
  approvals: string[];
  createdAt: string;
}

export interface DispatchEntry {
  id: string;
  disasterId: string;
  disasterTitle: string;
  orgName: string;
  channel: DispatchChannel;
  status: DispatchStatus;
  sentAt: string;
  note?: string;
}

export type TenderStatus = "Open" | "Claimed" | "In Progress" | "Completed";

export interface StoredTender {
  id: string;
  ref: string;
  title: string;
  disasterId: string;
  region: string;
  budget: number;
  status: TenderStatus;
  skills: string[];
  closesAt: string;
  claimedByName?: string;
  claimedByEmail?: string;
  updatedAt: string;
}

export interface StoredLedgerEntry {
  id: string;
  txnRef: string;
  disasterId: string;
  note: string;
  amount: number; // positive = credit, negative = debit
  createdAt: string;
}

export interface DonationApproval {
  donationId: string;
  approvers: string[];
}

interface Store {
  registrations: StoredRegistration[];
  contacts: StoredContact[];
  donations: StoredDonation[];
  disasters: Disaster[];
  organisations: Organisation[];
  dispatch: DispatchEntry[];
  tenders: StoredTender[];
  ledger: StoredLedgerEntry[];
  donationApprovals: DonationApproval[];
}

const EMPTY: Store = {
  registrations: [],
  contacts: [],
  donations: [],
  disasters: [],
  organisations: [],
  dispatch: [],
  tenders: [],
  ledger: [],
  donationApprovals: [],
};

async function read(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Store>) };
  } catch {
    return { ...EMPTY };
  }
}

async function write(store: Store): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

async function mutate<T>(
  fn: (store: Store) => T
): Promise<{ ok: boolean; value: T }> {
  const store = await read();
  const value = fn(store);
  const ok = await write(store);
  return { ok, value };
}

// ---- Registrations ----

export async function addRegistration(
  r: Omit<StoredRegistration, "id" | "status" | "createdAt">
): Promise<StoredRegistration> {
  const entry: StoredRegistration = {
    ...r,
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await mutate((s) => s.registrations.unshift(entry));
  return entry;
}

export async function listRegistrations(): Promise<StoredRegistration[]> {
  return (await read()).registrations;
}

export async function setRegistrationStatus(
  id: string,
  status: StoredRegistration["status"]
): Promise<StoredRegistration | null> {
  const { value } = await mutate((s) => {
    const reg = s.registrations.find((r) => r.id === id);
    if (reg) reg.status = status;
    return reg ?? null;
  });
  return value;
}

// ---- Contacts ----

export async function addContact(
  c: Omit<StoredContact, "id" | "createdAt">
): Promise<StoredContact> {
  const entry: StoredContact = {
    ...c,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await mutate((s) => s.contacts.unshift(entry));
  return entry;
}

export async function listContacts(): Promise<StoredContact[]> {
  return (await read()).contacts;
}

// ---- Donations ----

export async function addDonation(
  d: Omit<StoredDonation, "id" | "status" | "approvals" | "createdAt">
): Promise<StoredDonation> {
  const entry: StoredDonation = {
    ...d,
    id: randomUUID(),
    status: "pledged",
    approvals: [],
    createdAt: new Date().toISOString(),
  };
  await mutate((s) => s.donations.unshift(entry));
  return entry;
}

export async function listDonations(): Promise<StoredDonation[]> {
  return (await read()).donations;
}

/** Record an approver id; returns the updated donation (or null). */
export async function approveDonation(
  id: string,
  approver: string
): Promise<StoredDonation | null> {
  const { value } = await mutate((s) => {
    const d = s.donations.find((x) => x.id === id);
    if (d && !d.approvals.includes(approver)) d.approvals.push(approver);
    return d ?? null;
  });
  return value;
}

export async function setDonationStatus(
  id: string,
  status: StoredDonation["status"]
): Promise<StoredDonation | null> {
  const { value } = await mutate((s) => {
    const d = s.donations.find((x) => x.id === id);
    if (d) {
      d.status = status;
      d.approvals = [];
    }
    s.donationApprovals = s.donationApprovals.filter(
      (a) => a.donationId !== id
    );
    return d ?? null;
  });
  return value;
}

/**
 * Dual-approval tracker shared by both backends (local + Supabase).
 * Amounts above DUAL_APPROVAL_THRESHOLD need two distinct approvers.
 */
export const DUAL_APPROVAL_THRESHOLD = 500000;

export async function getDonationApprovals(id: string): Promise<string[]> {
  const all = (await read()).donationApprovals;
  return all.find((a) => a.donationId === id)?.approvers ?? [];
}

export async function addDonationApproval(
  id: string,
  approver: string
): Promise<string[]> {
  const { value } = await mutate((s) => {
    let rec = s.donationApprovals.find((a) => a.donationId === id);
    if (!rec) {
      rec = { donationId: id, approvers: [] };
      s.donationApprovals.push(rec);
    }
    if (!rec.approvers.includes(approver)) rec.approvers.push(approver);
    return [...rec.approvers];
  });
  return value;
}

export async function clearDonationApprovals(id: string): Promise<void> {
  await mutate((s) => {
    s.donationApprovals = s.donationApprovals.filter(
      (a) => a.donationId !== id
    );
  });
}

// ---- Admin-created disasters ----

export async function addDisaster(d: Disaster): Promise<void> {
  await mutate((s) => s.disasters.unshift(d));
}

export async function listStoreDisasters(): Promise<Disaster[]> {
  return (await read()).disasters;
}

/** Insert or replace a disaster by id (newest first). */
export async function upsertDisaster(d: Disaster): Promise<void> {
  await mutate((s) => {
    const i = s.disasters.findIndex((x) => x.id === d.id);
    if (i >= 0) s.disasters[i] = d;
    else s.disasters.unshift(d);
  });
}

// ---- Organisations approved via admin ----

export async function addOrganisation(o: Organisation): Promise<void> {
  await mutate((s) => s.organisations.unshift(o));
}

export async function listStoreOrganisations(): Promise<Organisation[]> {
  return (await read()).organisations;
}

// ---- Dispatch log ----

export async function addDispatch(entries: DispatchEntry[]): Promise<void> {
  await mutate((s) => s.dispatch.unshift(...entries));
}

export async function listDispatch(): Promise<DispatchEntry[]> {
  return (await read()).dispatch;
}

// ---- Tenders (dynamic overrides over seed data) ----

export async function listStoreTenders(): Promise<StoredTender[]> {
  return (await read()).tenders;
}

export async function upsertTender(t: StoredTender): Promise<void> {
  await mutate((s) => {
    const i = s.tenders.findIndex((x) => x.id === t.id);
    if (i >= 0) s.tenders[i] = t;
    else s.tenders.unshift(t);
  });
}

export async function getStoreTender(id: string): Promise<StoredTender | null> {
  return ((await read()).tenders.find((t) => t.id === id) ?? null);
}

// ---- Funds ledger (local entries; seed rows live in lib/data) ----

export async function addLedgerEntry(
  e: Omit<StoredLedgerEntry, "id" | "createdAt">
): Promise<StoredLedgerEntry> {
  const entry: StoredLedgerEntry = {
    ...e,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await mutate((s) => s.ledger.unshift(entry));
  return entry;
}

export async function listLedgerEntries(): Promise<StoredLedgerEntry[]> {
  return (await read()).ledger;
}
