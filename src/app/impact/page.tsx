import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  HandCoins,
  Radio,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { AlertTicker } from "@/components/alert-ticker";
import { DisasterArt } from "@/components/disaster-art";
import { NdmaLevelBadge } from "@/components/ndma-badge";
import { StormField } from "@/components/journey";
import { CountUp, Reveal } from "@/components/motion";
import { Badge, Kicker, PrimaryCTA, SectionHead } from "@/components/ui";
import { getAllDisasters, getAllTenders } from "@/lib/repo";

export const metadata: Metadata = {
  title: "What nature can cause",
  description:
    "Past disaster reports from India — tsunami, earthquakes, floods — and how ReliefChain turns reports into relief in seconds.",
};

const history = [
  {
    year: "2004",
    emoji: "🌊",
    title: "Indian Ocean Tsunami",
    place: "Tamil Nadu · Andaman & Nicobar",
    loss: "230,000+ lives across 14 countries",
    lesson: "No warning chain existed. Today ReliefChain dispatches in ~38 seconds.",
    art: "linear-gradient(135deg,#0c4a6e,#0e7490)",
  },
  {
    year: "2001",
    emoji: "🏚",
    title: "Bhuj Earthquake M7.7",
    place: "Kutch, Gujarat",
    loss: "20,000+ lives · 400,000 homes gone",
    lesson: "Unverified aid flooded in. ReliefChain verifies every body first.",
    art: "linear-gradient(135deg,#451a03,#b45309)",
  },
  {
    year: "2013",
    emoji: "⛰",
    title: "Kedarnath Flash Floods",
    place: "Uttarakhand",
    loss: "5,000+ missing · entire towns washed out",
    lesson: "Pilgrims with no alert net. Now SMS + voice alerts fire together.",
    art: "linear-gradient(135deg,#292524,#857262)",
  },
  {
    year: "2015",
    emoji: "🌧",
    title: "Chennai Urban Floods",
    place: "Tamil Nadu",
    loss: "400+ lives · city underwater for weeks",
    lesson: "Pumps + drinking water tenders now open in one tap.",
    art: "linear-gradient(135deg,#1e3a5f,#0ea5e9)",
  },
  {
    year: "2018",
    emoji: "🌊",
    title: "Kerala Floods",
    place: "Kerala",
    loss: "483 lives · ₹40,000 Cr damage",
    lesson: "Fishermen became rescuers. ReliefChain maps such heroes live.",
    art: "linear-gradient(135deg,#0c4a6e,#155e75)",
  },
  {
    year: "2023",
    emoji: "🧊",
    title: "Sikkim GLOF — Teesta",
    place: "Sikkim",
    loss: "Glacial lake burst · bridges + dams gone",
    lesson: "Climate risks are rising. Know Nature teaches why.",
    art: "linear-gradient(135deg,#1e3a5f,#0369a1)",
  },
];

const helpSteps = [
  {
    icon: Radio,
    n: "01",
    title: "Disaster reported & verified",
    body: "Authorised reporter logs the event. Severity set in under a minute — no paperwork queues.",
  },
  {
    icon: ShieldCheck,
    n: "02",
    title: "Nearest verified bodies alerted",
    body: "Dashboard, SMS, email and voice dispatch fire simultaneously to NGOs, PWD companies and authorities nearby.",
  },
  {
    icon: HandCoins,
    n: "03",
    title: "Tenders claimed, funds tracked",
    body: "Bodies claim open tenders. Every rupee moves through a public ledger — auditable, refundable, uncorruptable.",
  },
];

export default async function ImpactPage() {
  const [disasters, tenders] = await Promise.all([getAllDisasters(), getAllTenders()]);
  const active = disasters.filter((d) => d.status === "active");
  const affectedNow = active.reduce((s, d) => s + d.affected, 0);

  return (
    <>
      <AlertTicker />
      {/* Gate */}
      <section className="bg-canvas px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-espresso text-bone">
          <StormField />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="ember-breathe absolute -left-20 -top-20 size-80 rounded-full bg-teal-brand/40 blur-[100px]" />
            <div className="float-y-slow absolute -bottom-24 right-[-4rem] size-96 rounded-full bg-umber/50 blur-[120px]" />
          </div>
          <p
            aria-hidden
            className="ghost-type pointer-events-none absolute -bottom-6 left-0 z-[1] select-none whitespace-nowrap font-display text-[20vw] font-bold leading-none text-bone lg:text-[15rem]"
          >
            NATURE
          </p>
          <div className="relative z-[2] px-6 pb-10 pt-12 sm:px-10 lg:px-14">
            <p className="hero-in hero-in-1 flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest text-bone/60">
              <TriangleAlert size={13} className="text-warn" />
              Past reports · live emergencies
            </p>
            <h1 className="hero-in hero-in-3 mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
              Nature is beautiful. <br />
              <em className="gradient-text not-italic">And brutally powerful.</em>
            </h1>
            <p className="hero-in hero-in-4 mt-4 max-w-xl text-base leading-7 text-bone/75 sm:text-lg">
              Six reports every Indian student should know — then see how
              ReliefChain turns the next one into rescue in{" "}
              <CountUp to={38} />s.
            </p>
            <div className="hero-in hero-in-5 mt-6 flex flex-wrap gap-3">
              <PrimaryCTA href="#reports">Read the reports</PrimaryCTA>
              <Link
                href="#how"
                className="inline-flex h-12 items-center justify-center rounded-full border border-bone/30 px-7 font-ui text-xs font-semibold uppercase tracking-widest text-bone transition-all hover:-translate-y-0.5 hover:bg-bone/10"
              >
                How ReliefChain helps
              </Link>
            </div>
          </div>
          <div className="relative z-[2] grid grid-cols-2 gap-px border-t border-bone/15 bg-bone/10 lg:grid-cols-4">
            {[
              { v: 6, l: "Historic reports below" },
              { v: active.length, l: "Active right now" },
              { v: affectedNow, l: "Affected today" },
              { v: tenders.filter((t) => t.status === "Open").length, l: "Open tenders" },
            ].map((s) => (
              <div key={s.l} className="bg-espresso/60 px-6 py-5 backdrop-blur-sm">
                <p className="font-mono text-2xl font-semibold text-bone sm:text-3xl">
                  <CountUp to={s.v} />
                </p>
                <p className="mt-1 font-ui text-[10px] uppercase tracking-widest text-bone/55">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline reports */}
      <section id="reports" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal>
          <SectionHead
            eyebrow="Reports from the past"
            title="What nature has already done to us"
            desc="Real Indian disasters. Read the loss — then the lesson ReliefChain was built on."
          />
        </Reveal>
        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {history.map((h, i) => (
            <Reveal key={h.year + h.title} delay={(i % 3) * 100}>
              <article className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="relative flex h-36 items-end justify-between gap-2 overflow-hidden p-4" style={{ background: h.art }}>
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-8 select-none font-alert text-[6.5rem] font-black leading-none text-white/25"
                  >
                    {h.year}
                  </span>
                  <span className="rounded-full bg-black/40 px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                    {h.year}
                  </span>
                  <span className="rounded-full bg-black/35 px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                    {h.place}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-slate-ink">{h.title}</h3>
                  <p className="mt-1 font-ui text-xs font-semibold uppercase tracking-widest text-alert">{h.loss}</p>
                  <p className="mt-3 flex-1 border-t border-line pt-3 text-sm leading-6 text-slate-body">{h.lesson}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Featured: Assam floods — picture story */}
        <Reveal delay={60}>
          <article className="grain relative mt-10 overflow-hidden rounded-3xl bg-espresso text-bone">
            <div className="grid lg:grid-cols-2">
              <div
                className="relative min-h-64 overflow-hidden"
                style={{ background: "linear-gradient(135deg,#0c4a6e,#0e7490)" }}
              >
                <DisasterArt type="Flood" className="absolute inset-0 h-full w-full" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-teal-brand px-3.5 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-widest text-white">
                  <span className="live-dot inline-block size-1.5 rounded-full bg-white" />
                  Live now · Assam
                </span>
              </div>
              <div className="relative z-[2] p-6 sm:p-10">
                <p className="font-ui text-[11px] font-semibold uppercase tracking-widest text-warn">
                  Featured story · Brahmaputra floods
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl">
                  Dibrugarh is underwater. 62 villages cut off.
                </h3>
                <p className="mt-3 max-w-lg text-[15px] leading-7 text-bone/75">
                  The Brahmaputra breached 3 embankments. 14 relief camps are
                  running, boat rescue teams are on the water — and food,
                  tarpaulin and water-purifier tenders are open right now for
                  verified bodies to claim.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { v: 41200, l: "Affected" },
                    { v: 62, l: "Villages cut off" },
                    { v: 14, l: "Relief camps" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-xl border border-bone/15 bg-bone/[0.06] px-3 py-3"
                    >
                      <p className="font-mono text-xl font-semibold text-bone sm:text-2xl">
                        <CountUp to={s.v} />
                      </p>
                      <p className="mt-0.5 font-ui text-[9px] font-semibold uppercase tracking-widest text-bone/55">
                        {s.l}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/tenders?disaster=d1"
                    className="inline-flex h-12 items-center rounded-full bg-bone px-7 font-ui text-xs font-semibold uppercase tracking-widest text-espresso transition-all hover:-translate-y-0.5"
                  >
                    Claim Assam relief work
                    <ArrowRight size={15} className="ml-2" />
                  </Link>
                  <Link
                    href="/donate"
                    className="inline-flex h-12 items-center rounded-full border border-bone/30 px-7 font-ui text-xs font-semibold uppercase tracking-widest text-bone transition-all hover:-translate-y-0.5 hover:bg-bone/10"
                  >
                    Donate to Assam →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Live now */}
        <Reveal delay={100}>
          <div className="mt-10 rounded-2xl border border-espresso bg-espresso p-6 text-bone sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Kicker className="text-bone/60">Happening right now</Kicker>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  <CountUp to={active.length} /> active emergencies · <CountUp to={affectedNow} /> affected
                </h3>
              </div>
              <Link
                href="/disasters"
                className="inline-flex h-11 items-center rounded-full bg-bone px-6 font-ui text-[11px] font-semibold uppercase tracking-widest text-espresso transition-all hover:-translate-y-0.5"
              >
                Open live register <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {active.slice(0, 4).map((d) => (
                <li key={d.id} className="flex items-center gap-3 rounded-xl border border-bone/15 bg-bone/[0.06] px-4 py-3">
                  <Badge tone={d.severity === "critical" ? "alert" : "warn"}>{d.severity}</Badge>
                  <NdmaLevelBadge severity={d.severity} affected={d.affected} dark />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-bone">{d.title}</p>
                    <p className="truncate font-mono text-[11px] text-bone/60">
                      {d.region}, {d.state} · {d.affected.toLocaleString("en-IN")} affected
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* How ReliefChain helps */}
      <section id="how" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Reveal>
            <SectionHead eyebrow="How ReliefChain helps" title="From report to relief in three moves" />
          </Reveal>
          <ol className="grid gap-5 md:grid-cols-3">
            {helpSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 110}>
                <li className="lift relative h-full overflow-hidden rounded-2xl border border-line bg-canvas p-7">
                  <span aria-hidden className="ghost-type pointer-events-none absolute -right-2 -top-5 font-display text-8xl font-bold text-slate-ink">
                    {s.n}
                  </span>
                  <span className="relative grid size-12 place-items-center rounded-full bg-slate-ink text-bone">
                    <s.icon size={20} />
                  </span>
                  <p className="relative mt-5 font-ui text-[11px] font-semibold uppercase tracking-widest text-teal-brand">Step {s.n}</p>
                  <h3 className="relative mt-2 font-display text-xl font-semibold tracking-tight text-slate-ink">{s.title}</h3>
                  <p className="relative mt-2 text-sm leading-6 text-slate-body">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryCTA href="/learn">
                Students — learn how to resist <ArrowRight size={15} className="ml-2" />
              </PrimaryCTA>
              <Link
                href="/donate"
                className="inline-flex h-12 items-center rounded-full border border-line-strong bg-surface px-7 font-ui text-xs font-semibold uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5"
              >
                Donate to live relief →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
