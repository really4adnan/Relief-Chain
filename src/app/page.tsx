import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  TriangleAlert,
} from "lucide-react";
import { AlertTicker } from "@/components/alert-ticker";
import { BentoPaths } from "@/components/bento-paths";
import { NdmaLevelBadge } from "@/components/ndma-badge";
import { Reveal } from "@/components/motion";
import { Kicker, PrimaryCTA, SecondaryCTA } from "@/components/ui";
import { NDMA_DRILLS } from "@/lib/ndma";
import { getAllDisasters, getAllTenders } from "@/lib/repo";

export default async function Home() {
  const [disasters, tenders] = await Promise.all([
    getAllDisasters(),
    getAllTenders(),
  ]);
  const active = disasters.filter((d) => d.status === "active");
  const openTenders = tenders.filter((t) => t.status === "Open");

  // Featured live emergency — Assam Brahmaputra Floods first, else newest active.
  const featured =
    disasters.find((d) => d.id === "d1") ??
    disasters.find(
      (d) => d.state === "Assam" && d.status === "active",
    ) ??
    active[0];

  const liveStates = [
    ...new Set(active.slice(0, 6).map((d) => d.state)),
  ].slice(0, 3);

  // Per-state live counts for the bento location toggle — always computed,
  // never hardcoded, sorted busiest first.
  const stateCounts = [...active
    .reduce((m, d) => m.set(d.state, (m.get(d.state) ?? 0) + 1), new Map<string, number>())
    .entries()]
    .map(([state, count]) => ({ state, active: count }))
    .sort((a, b) => b.active - a.active)
    .slice(0, 8);

  return (
    <>
      <AlertTicker />

      {/* ============ HERO — editorial serif, two doors ============ */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
          <Reveal>
            <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-wide text-slate-ink shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <span className="live-dot inline-block size-1.5 rounded-full bg-teal-brand" />
              NDMA feed: live
              <span aria-hidden className="text-slate-body/40">|</span>
              Active regional nodes: {liveStates.length > 0 ? active.length : 0}
              {liveStates.length > 0 ? ` (${liveStates.join(", ")})` : ""}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-slate-ink sm:text-6xl">
              When disasters strike, emergency response shouldn&rsquo;t wait.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-body sm:text-lg sm:leading-8">
              A decentralized, real-time coordination bridge connecting
              affected citizens, field NGOs, and NDMA disaster response teams.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryCTA href="/live">
                Request emergency aid
              </PrimaryCTA>
              <SecondaryCTA href="/disasters">
                View live disaster map
              </SecondaryCTA>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs tracking-wide text-slate-body">
              <span className="inline-flex items-center gap-1.5">
                <Phone size={12} className="text-alert" />
                Emergency? Dial{" "}
                <a href="tel:112" className="font-semibold text-slate-ink underline underline-offset-4">
                  112
                </a>
                <span className="text-slate-body/50">·</span> NDMA{" "}
                <a href="tel:1078" className="font-semibold text-slate-ink underline underline-offset-4">
                  1078
                </a>
              </span>
              <span className="hidden h-3 w-px bg-line-strong sm:block" />
              <span>
                {active.length} active {active.length === 1 ? "register" : "registers"} · {openTenders.length} open{" "}
                {openTenders.length === 1 ? "tender" : "tenders"} · NDMA feed status: live
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ BENTO PATH SELECTION — featured + three rails ============ */}
      <section id="paths" className="border-y border-line bg-surface">
        <BentoPaths
          states={stateCounts}
          openTenders={openTenders.length}
          drillCount={NDMA_DRILLS.length}
        />
      </section>

      {/* ============ FEATURED LIVE EMERGENCY — one story, full context ============ */}
      {featured && (
        <section id="featured" className="bg-canvas">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
            <Reveal>
              <Kicker>Live right now · Featured emergency</Kicker>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight text-slate-ink sm:text-4xl">
                What nature can cause — and where help is needed today.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <article className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="grid md:grid-cols-2">
                  <div className="border-b border-line bg-slate-ink p-7 text-white sm:p-9 md:border-b-0 md:border-r">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-alert px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-widest text-white">
                        <span className="live-dot inline-block size-1.5 rounded-full bg-white" />
                        {featured.severity}
                      </span>
                      <span className="rounded-full border border-white/25 px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-widest text-white/80">
                        {featured.type}
                      </span>
                      <NdmaLevelBadge
                        severity={featured.severity}
                        affected={featured.affected}
                        dark
                      />
                    </p>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-white/60">
                      {featured.region}, {featured.state}
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
                      {featured.title}
                    </h3>
                    <p className="mt-4 max-w-md text-[15px] leading-7 text-white/75">
                      {featured.summary}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5">
                      <p>
                        <span className="block font-mono text-2xl font-semibold tracking-tight text-white">
                          {featured.affected.toLocaleString("en-IN")}
                        </span>
                        <span className="mt-1 block font-ui text-[10px] uppercase tracking-widest text-white/60">
                          People affected
                        </span>
                      </p>
                      <p>
                        <span className="block font-mono text-2xl font-semibold tracking-tight text-white">
                          {new Date(featured.reportedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        <span className="mt-1 block font-ui text-[10px] uppercase tracking-widest text-white/60">
                          Reported · IST
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-9">
                    <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-body">
                      <TriangleAlert size={14} className="text-alert" />
                      What&rsquo;s needed
                    </p>
                    <ul className="mt-3 space-y-2.5 text-[15px] leading-7 text-slate-ink">
                      <li className="flex gap-2.5">
                        <span className="text-teal-brand">—</span>
                        Rescue boats with trained crews on the water now
                      </li>
                      <li className="flex gap-2.5">
                        <span className="text-teal-brand">—</span>
                        Daily food packets for {featured.affected.toLocaleString("en-IN")} people in relief camps
                      </li>
                      <li className="flex gap-2.5">
                        <span className="text-teal-brand">—</span>
                        Drinking water, ORS kits & medical triage at camp sites
                      </li>
                    </ul>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <PrimaryCTA href="/impact">
                        View All Active Disaster Registers ({active.length})
                        <ArrowUpRight size={15} className="ml-2" />
                      </PrimaryCTA>
                    </div>
                    <p className="mt-4 font-mono text-[11px] tracking-wide text-slate-body">
                      Helpline for this region: 112 · NDMA 1078
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ SIGN IN — with maintenance notice ============ */}
      <section id="signin" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <Reveal>
            <Kicker>Sign in to see everything</Kicker>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight text-slate-ink sm:text-4xl">
              Your chain is one sign-in away.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-body">
              One account opens your path picker, the live map, tenders and
              the public funds ledger.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-8">
                <p className="rounded-xl border border-warn/30 bg-warn-tint px-4 py-3 text-sm leading-6 text-slate-ink">
                  <span className="font-ui text-[11px] font-semibold uppercase tracking-widest text-warn">
                    Notice&nbsp;·&nbsp;
                  </span>
                  Google One-Tap Login is under routine maintenance.
                  Please use Email / Magic Link to log in.
                </p>
                <h3 className="mt-5 font-display text-2xl font-medium tracking-tight text-slate-ink">
                  Sign in with email
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-body">
                  Password or magic link — then pick your path and explore
                  impact, tenders and lessons.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <PrimaryCTA href="/login">Open sign in</PrimaryCTA>
                  <Link
                    href="/start"
                    className="inline-flex h-12 items-center rounded-full border border-line-strong bg-white px-7 font-ui text-xs font-semibold uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5 hover:border-slate-ink active:scale-[0.98]"
                  >
                    Explore without signing in
                  </Link>
                </div>
                <p className="mt-5 font-mono text-[11px] tracking-wide text-slate-body">
                  Prefer onboarding first?{" "}
                  <Link href="/register" className="text-slate-ink underline underline-offset-4">
                    Register an organisation
                  </Link>
                </p>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <Link
                href="/government"
                className="group flex h-full flex-col justify-between rounded-2xl border border-slate-ink bg-slate-ink p-7 text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 active:scale-[0.98] sm:p-8"
              >
                <span>
                  <span className="block font-ui text-[11px] font-semibold uppercase tracking-widest text-white/60">
                    For districts, states & institutions
                  </span>
                  <span className="mt-3 block font-display text-3xl font-medium leading-tight tracking-tight">
                    Deploy ReliefChain as public infrastructure.
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-white/70">
                    Verified network · auditable funds · 30-day pilot with
                    an evidence pack.
                  </span>
                </span>
                <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-6 py-3 font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-ink transition-transform group-hover:translate-x-1">
                  Buyer page <ArrowRight size={14} />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
