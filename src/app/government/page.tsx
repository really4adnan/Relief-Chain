import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileCheck2,
  Landmark,
  Lock,
  Radio,
  ScrollText,
  ShieldCheck,
  Timer,
  Users,
  Wallet,
} from "lucide-react";
import { AlertTicker } from "@/components/alert-ticker";
import { CountUp, Reveal } from "@/components/motion";
import { Kicker, PrimaryCTA, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "For governments & institutions",
  description:
    "Procurement-grade disaster response infrastructure for districts and states — verified responders, auditable funds, live operations, 30-day pilot.",
};

const capabilities = [
  {
    icon: Users,
    title: "A verified responder network",
    body: "Every NGO, PWD unit and volunteer body onboards with registration documents checked by a human. Your district stops discovering capacity during the crisis — it starts with a live directory.",
  },
  {
    icon: Radio,
    title: "Sub-minute dispatch",
    body: "One verified report fans out simultaneously to dashboard, SMS, email and voice. Median dispatch runs under a minute — with every broadcast logged for review.",
  },
  {
    icon: Wallet,
    title: "Leakage-proof fund pipeline",
    body: "Donations and relief budgets sit in escrow, release against proven milestones, and need dual approval above ₹5L. The full trail is a public, exportable ledger.",
  },
];

const controls = [
  {
    icon: BadgeCheck,
    title: "Human-verified onboarding",
    body: "Registration certificate, PAN and signatory ID checked before any body can receive alerts or claim work.",
  },
  {
    icon: Lock,
    title: "Role-based access",
    body: "NGO, PWD, authority and admin views are separated. Service-role data access never reaches the browser.",
  },
  {
    icon: ScrollText,
    title: "Immutable audit log",
    body: "Every dispatch, claim, approval and payout is written to an exportable log — CAG-style audit packs on demand.",
  },
  {
    icon: FileCheck2,
    title: "Tender discipline",
    body: "Relief work is scoped, budgeted and claimed in public. No favours, no ghost contractors, no missing files.",
  },
  {
    icon: ShieldCheck,
    title: "Data protection by design",
    body: "Row-level security on every table, least-privilege keys, and India-hosted data residency options for state deployments.",
  },
  {
    icon: Timer,
    title: "Low-connectivity first",
    body: "Lightweight pages, SMS + voice fallbacks, and readable-under-stress typography for field conditions and 2G networks.",
  },
];

const pilot = [
  {
    n: "01",
    title: "Scope one district",
    body: "Pick a flood-, cyclone- or landslide-prone district. We configure its map, responders and escalation matrix in week one.",
  },
  {
    n: "02",
    title: "Onboard local bodies",
    body: "District administration invites its NGOs, PWD divisions and volunteers. Verification completes within days, not months.",
  },
  {
    n: "03",
    title: "Run a live drill",
    body: "A simulated emergency tests the full chain — report, dispatch, tender claim, fund release — timed end to end.",
  },
  {
    n: "04",
    title: "Review the audit pack",
    body: "You receive dispatch times, claim records and the funds ledger as a single exportable file. Procurement decides on evidence.",
  },
];

const faqs = [
  {
    q: "Who owns the data?",
    a: "You do. District and state deployments run on isolated data with full export at any time — including the complete audit log. No lock-in, no hostage data.",
  },
  {
    q: "Does it replace NDMA / SDMA systems?",
    a: "No — it sits alongside them. ReliefChain handles the last-mile coordination layer: verified responders, dispatch, tenders and fund trails, integrated with your existing control rooms.",
  },
  {
    q: "What about areas with no internet?",
    a: "Dispatch fires over SMS and voice in parallel with the dashboard, and pages are built light for 2G. Field teams stay reachable when data networks fail.",
  },
  {
    q: "How is this different from a dashboard?",
    a: "Dashboards show information. ReliefChain moves money and people: escrowed funds, claimed tenders, dual approvals and a public ledger — the paperwork of relief, enforced by software.",
  },
  {
    q: "What does it cost?",
    a: "Verified responder organisations are always free. District pilots run on a fixed 30-day fee; state deployments are annual. Request a proposal — pricing is public and line-itemed.",
  },
];

export default function GovernmentPage() {
  return (
    <>
      <AlertTicker />

      {/* Hero */}
      <section className="bg-canvas px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-espresso text-bone">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="ember-breathe absolute -left-20 -top-20 size-80 rounded-full bg-teal-brand/40 blur-[100px]" />
            <div className="float-y-slow absolute -bottom-24 right-[-4rem] size-96 rounded-full bg-umber/50 blur-[120px]" />
          </div>
          <p
            aria-hidden
            className="ghost-type pointer-events-none absolute -bottom-6 left-0 z-[1] select-none whitespace-nowrap font-display text-[18vw] font-bold leading-none text-bone lg:text-[13rem]"
          >
            GOVT
          </p>
          <div className="relative z-[2] px-6 pb-10 pt-12 sm:px-10 lg:px-14">
            <p className="hero-in hero-in-1 flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-bone/60">
              <Landmark size={13} className="text-warn" />
              For governments & institutions
            </p>
            <h1 className="hero-in hero-in-2 mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-bone sm:text-6xl">
              Procurement-grade disaster response{" "}
              <em className="gradient-text not-italic">infrastructure.</em>
            </h1>
            <p className="hero-in hero-in-3 mt-4 max-w-xl text-base leading-7 text-bone/75 sm:text-lg">
              Verified responders, sub-minute dispatch, escrowed funds and an
              exportable audit trail — ready for a 30-day district pilot.
            </p>
            <div className="hero-in hero-in-4 mt-7 flex flex-wrap gap-3">
              <PrimaryCTA href="/contact">
                Request a pilot
                <ArrowRight size={15} className="ml-2" />
              </PrimaryCTA>
              <Link
                href="/live"
                className="inline-flex h-12 items-center justify-center rounded-full border border-bone/30 px-7 font-ui text-xs font-semibold uppercase tracking-widest text-bone transition-all hover:-translate-y-0.5 hover:bg-bone/10"
              >
                See live operations
              </Link>
            </div>
          </div>
          <div className="relative z-[2] grid grid-cols-2 gap-px border-t border-bone/15 bg-bone/10 lg:grid-cols-4">
            {[
              { v: 38, s: "s", l: "Median dispatch time" },
              { v: 1462, s: "", l: "Alerts dispatched" },
              { v: 100, s: "%", l: "Funds on public ledger" },
              { v: 0, s: "%", l: "Commission on donations" },
            ].map((stat) => (
              <div key={stat.l} className="bg-espresso/60 px-6 py-5 backdrop-blur-sm">
                <p className="font-mono text-2xl font-semibold text-bone sm:text-3xl">
                  <CountUp to={stat.v} />
                  {stat.s}
                </p>
                <p className="mt-1 font-ui text-[10px] font-semibold uppercase tracking-widest text-bone/55">
                  {stat.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal>
          <SectionHead
            eyebrow="What you deploy"
            title="Three systems, one chain of accountability"
          />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <div className="lift h-full rounded-2xl border border-line bg-surface p-7">
                <span className="grid size-12 place-items-center rounded-full bg-slate-ink text-bone">
                  <c.icon size={20} />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-slate-ink">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-body">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Controls */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Compliance & controls"
              title="Built for audit rooms, not just demos"
              desc="The controls procurement officers and auditors ask about — enforced in software, evidenced in exports."
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {controls.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 90}>
                <div className="h-full rounded-2xl border border-line bg-canvas p-6">
                  <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-teal-brand">
                    <c.icon size={15} /> Control
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-slate-ink">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-body">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            eyebrow="30-day district pilot"
            title="Evidence before procurement"
            desc="A fixed-scope, fixed-fee pilot that ends with an audit pack your finance team can actually review."
          />
        </Reveal>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pilot.map((p, i) => (
            <Reveal key={p.n} delay={i * 90}>
              <li className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-6">
                <span
                  aria-hidden
                  className="ghost-type pointer-events-none absolute -right-1 -top-4 font-display text-7xl font-bold text-slate-ink"
                >
                  {p.n}
                </span>
                <p className="relative font-mono text-xs font-semibold text-teal-brand">
                  Week {p.n === "01" ? "1" : p.n === "02" ? "1–2" : p.n === "03" ? "3" : "4"}
                </p>
                <h3 className="relative mt-2 font-display text-lg font-bold tracking-tight text-slate-ink">
                  {p.title}
                </h3>
                <p className="relative mt-1.5 text-sm leading-6 text-slate-body">{p.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-bone">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Procurement FAQ"
              title="Asked in every tender meeting"
            />
          </Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group rounded-2xl border border-line bg-surface px-6 py-5">
                  <summary className="cursor-pointer font-display text-lg font-bold tracking-tight text-slate-ink marker:text-teal-brand">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-slate-body">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-canvas px-3 pb-3 sm:px-5 sm:pb-5">
        <Reveal scale>
          <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-teal-brand text-white">
            <div className="relative z-[2] flex flex-col items-start gap-7 px-6 py-14 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:px-16">
              <div>
                <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  <Building2 size={13} />
                  District & state deployments
                </p>
                <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                  Bring the chain to your district.
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/80">
                  Tell us your district and hazard profile — we respond with a
                  scoped pilot proposal within 5 working days.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center rounded-full bg-white px-7 font-ui text-xs font-semibold uppercase tracking-widest text-espresso shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5"
                >
                  Request a proposal
                  <ArrowRight size={15} className="ml-2" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 font-ui text-xs font-semibold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Why ReliefChain →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Sign-off */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <Kicker>ReliefChain for public institutions</Kicker>
        </div>
      </section>
    </>
  );
}
