import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { SectionHead, StatBlock } from "@/components/ui";
import { stats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why ReliefChain exists: a transparent, verified chain connecting NGOs, PWD companies and authorities during disasters.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHead
        eyebrow="About"
        title="Built because response shouldn't wait"
      />

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <article className="space-y-4 text-sm leading-7">
          <p>
            During a disaster, the first hours decide outcomes. Today those hours
            are lost to phone trees, unverified WhatsApp forwards and money that
            disappears into accounts nobody can audit. ReliefChain exists to fix
            all three.
          </p>
          <p>
            <strong className="text-slate-ink">One verified chain.</strong> NGOs,
            PWD companies, volunteer groups and district authorities register once
            with real documents. Everyone on the chain has been checked by a human.
          </p>
          <p>
            <strong className="text-slate-ink">Fastest possible dispatch.</strong>{" "}
            When an authorised reporter logs an emergency, nearby verified bodies
            are contacted simultaneously — median dispatch time is under a minute.
          </p>
          <p>
            <strong className="text-slate-ink">Tenders, not favours.</strong> Relief
            jobs are posted as scoped tenders with escrowed budgets. Claims are
            public, milestones are proven, and withdrawals above ₹5L need dual
            approval.
          </p>
          <p>
            <strong className="text-slate-ink">Corruption-resistant by design.</strong>{" "}
            Every dispatch, claim and payout is written to an immutable log that can
            be exported for audits — a prerequisite for eventual government
            integration.
          </p>
        </article>

        <aside className="grid grid-cols-2 gap-x-2 gap-y-4 self-start border border-line bg-canvas p-5">
          <StatBlock value={stats.verifiedOrgs.toString()} label="Verified bodies" />
          <StatBlock value={stats.dispatched.toLocaleString("en-IN")} label="Alerts dispatched" />
          <StatBlock
            value={`${stats.avgDispatchTimeSec}s`}
            label="Median dispatch time"
          />
          <StatBlock value="0%" label="Commission on donations" />
        </aside>
      </div>

      {/* Creator */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-espresso bg-espresso p-6 text-bone sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-bone font-display text-2xl font-bold text-espresso">
            A
          </span>
          <div className="min-w-0">
            <p className="font-ui text-[11px] font-semibold uppercase tracking-widest text-bone/60">
              Behind ReliefChain
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-bone">
              Adnan A. Laskar
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-bone/70">
              Designer & builder of this platform — connecting verified
              responders, transparent funds and public disaster knowledge
              across India.
            </p>
          </div>
          <a
            href="https://www.linkedin.com/in/adnan-a-laskar-510661426/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center rounded-full bg-bone px-7 font-ui text-xs font-semibold uppercase tracking-widest text-espresso transition-all hover:-translate-y-0.5 sm:ml-auto"
          >
            <ExternalLink size={15} className="mr-2" />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
