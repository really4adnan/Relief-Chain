import type { Metadata } from "next";
import Link from "next/link";
import { Clock, IndianRupee, ShieldCheck, ScrollText, HeartHandshake, FileCheck2, Lock } from "lucide-react";
import { DonateForm } from "@/components/donate-form";
import { RequireAuth } from "@/components/require-auth";
import { LowBandwidthNote } from "@/components/ui";
import { getAllDisasters } from "@/lib/repo";

export const metadata: Metadata = {
  title: "Donate to disaster relief",
  description:
    "Fund verified disaster response in India — 100% of your donation reaches the emergency you choose, escrowed, milestone-released and publicly audited.",
};

const reasons = [
  {
    icon: Clock,
    title: "The first 72 hours decide everything",
    body: "Survival rates after floods, earthquakes and cyclones hinge on food, water and shelter reaching people immediately — not weeks later. Your pledge goes into a fund the moment an alert is broadcast.",
  },
  {
    icon: ShieldCheck,
    title: "Zero leakage by design",
    body: "Money sits in escrow, releases only against proven milestones, and withdrawals above ₹5L need dual approval. Every rupee is written to an immutable public ledger you can audit.",
  },
  {
    icon: IndianRupee,
    title: "0% platform commission",
    body: "ReliefChain takes nothing from your donation. Other platforms skim 3–15%; here the full amount lands in the disaster fund (payment gateway fees are on us).",
  },
  {
    icon: ScrollText,
    title: "You choose exactly where it goes",
    body: "Pick the specific emergency you care about — Assam floods, an Odisha cyclone, Wayanad rehabilitation — and track how that fund was spent in the public ledger.",
  },
  {
    icon: HeartHandshake,
    title: "Only verified bodies do the work",
    body: "Every organisation claiming a tender has submitted registration certificates and been checked by a human. No fly-by-night contractors, no ghost beneficiaries.",
  },
  {
    icon: FileCheck2,
    title: "Tax-exempt receipts",
    body: "Eligible donations receive an 80G reference with the pledge receipt, confirmed the moment your pledge is captured. Keep your audited donation trail in one place.",
  },
];

const examples = [
  { amount: "₹500", impact: "food packets for a family of four for a day" },
  { amount: "₹2,500", impact: "tarpaulin + bedding kit for a shelter unit" },
  { amount: "₹10,000", impact: "drinking water and ORS for ~100 people for a week" },
];

export default async function DonatePage() {
  const disasters = await getAllDisasters();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-line pb-4">
        <p className="font-ui text-xs font-semibold uppercase tracking-widest text-teal-brand">
          Funds
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-ink">
          Why donate through ReliefChain?
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6">
          Disaster relief fails most often not from lack of money, but from lack
          of trust and speed. ReliefChain fixes both: verified responders,
          escrowed funds and a ledger nobody can quietly edit.
        </p>
      </div>

      {/* Why donate — reasons */}
      <section className="mt-8">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <li key={r.title} className="bg-surface p-5">
              <r.icon size={18} className="text-teal-brand" aria-hidden="true" />
              <h2 className="mt-3 text-base font-semibold text-slate-ink">
                {r.title}
              </h2>
              <p className="mt-1.5 text-sm leading-6">{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* What your money buys */}
      <section className="mt-6 border border-line bg-canvas p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-ink">
          What your money actually buys
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {examples.map((e) => (
            <li key={e.amount} className="border border-line bg-surface px-4 py-3">
              <p className="font-mono text-lg font-semibold text-teal-brand">
                {e.amount}
              </p>
              <p className="text-xs leading-5">≈ {e.impact}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 font-mono text-[11px] text-slate-body">
          Illustrative costs — actual tender pricing is published per event.
        </p>
      </section>

      {/* Donation form + guarantees */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="mb-4 flex items-center gap-2 border-b border-line pb-2 text-base font-semibold text-slate-ink">
            Make a pledge
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-ink px-2 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-widest text-white">
              <Lock size={11} /> Sign-in required
            </span>
          </h2>
          <RequireAuth next="/donate" action="donate and pay">
            <DonateForm disasters={disasters} />
          </RequireAuth>
          <LowBandwidthNote />
        </section>

        <aside className="space-y-4">
          <div className="border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold text-slate-ink">
              Where the money goes
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6">
              <li>1. Escrowed against the disaster fund you pick</li>
              <li>2. Released only when a tender milestone is proven</li>
              <li>3. Logged to a public ledger with NGO + district sign-off</li>
              <li>4. Unspent balance refunded after event closure</li>
            </ul>
          </div>
          <div className="border border-line bg-canvas p-5 font-mono text-xs leading-6 text-slate-body">
            Anti-corruption controls:
            <br />
            • dual approval for withdrawals &gt; ₹5L
            <br />
            • immutable dispatch + payout log
            <br />
            • third-party audit export (CSV)
          </div>
          <p className="text-sm text-slate-body">
            Prefer to help another way?{" "}
            <Link href="/register" className="font-semibold text-teal-brand underline">
              Register your organisation
            </Link>{" "}
            to receive dispatch alerts and claim tenders.
          </p>
        </aside>
      </div>
    </div>
  );
}
