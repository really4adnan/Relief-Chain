import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Landmark,
  LogIn,
  MapPin,
  UserPlus,
} from "lucide-react";
import { AlertTicker } from "@/components/alert-ticker";
import { DisasterArt } from "@/components/disaster-art";
import {
  IntentGrid,
  StormField,
  Typewriter,
} from "@/components/journey";
import { CountUp, Marquee, Reveal } from "@/components/motion";
import { Badge, Kicker, PrimaryCTA, SectionHead } from "@/components/ui";
import { stats, type Disaster } from "@/lib/data";
import { getAllDisasters, getAllTenders } from "@/lib/repo";

const typeArt: Record<Disaster["type"], string> = {
  Flood: "linear-gradient(135deg,#0c4a6e 0%,#155e75 55%,#0e7490 100%)",
  Earthquake: "linear-gradient(135deg,#451a03 0%,#92400e 60%,#b45309 100%)",
  Cyclone: "linear-gradient(135deg,#1e3a5f 0%,#0369a1 60%,#0ea5e9 100%)",
  Wildfire: "linear-gradient(135deg,#431407 0%,#9a3412 55%,#ea580c 100%)",
  Landslide: "linear-gradient(135deg,#292524 0%,#57534e 60%,#857262 100%)",
  Heatwave: "linear-gradient(135deg,#5c1a02 0%,#c2410c 60%,#f59e0b 100%)",
};

function urgencyTone(severity: Disaster["severity"]) {
  return severity === "critical" ? "alert" : severity === "high" ? "warn" : "neutral";
}

export default async function Home() {
  const [disasters, tenders] = await Promise.all([
    getAllDisasters(),
    getAllTenders(),
  ]);
  const active = disasters.filter((d) => d.status === "active");
  const affectedNow = active.reduce((sum, d) => sum + d.affected, 0);
  const openTenders = tenders.filter((t) => t.status === "Open");
  const heroStory = active[0];
  const marqueeTerms = [
    ...new Set(disasters.slice(0, 10).map((d) => d.state)),
    "Flood response",
    "Mass kitchens",
    "Boat rescue",
    "Verified network",
  ];

  return (
    <>
      <AlertTicker />

      {/* ============ STEP 01 — THE GATE: do you wanna know what nature can cause? ============ */}
      <section className="bg-canvas px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-espresso text-bone">
          <StormField />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="ember-breathe absolute -left-24 -top-24 size-96 rounded-full bg-teal-brand/40 blur-[110px]" />
            <div className="float-y-slow absolute -bottom-32 right-[-6rem] size-[28rem] rounded-full bg-umber/50 blur-[130px]" />
            <div className="float-y absolute right-[18%] top-[-4rem] size-56 rounded-full bg-warn/25 blur-[90px]" />
          </div>
          <p
            aria-hidden
            className="ghost-type pointer-events-none absolute -bottom-8 left-0 z-[1] select-none whitespace-nowrap font-display text-[22vw] font-bold leading-none text-bone lg:text-[19rem]"
          >
            NATURE
          </p>

          <div className="relative z-[2] px-6 pb-8 pt-12 sm:px-10 sm:pt-16 lg:px-14">
            <div className="hero-in hero-in-1 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-3.5 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-widest text-white">
                <span className="live-dot inline-block size-1.5 rounded-full bg-white" />
                {active.length} active emergencies
              </span>
              <span className="font-ui text-[11px] uppercase tracking-widest text-bone/60">
                Relief network · India
              </span>
            </div>

            <h1 className="hero-in hero-in-2 mt-6 max-w-4xl font-display text-[2.6rem] font-semibold leading-[1.0] tracking-tight sm:text-6xl lg:text-7xl">
              Do you know what{" "}
              <em className="gradient-text not-italic">nature can do</em>{" "}
              to us?
            </h1>

            <p className="hero-in hero-in-3 mt-5 max-w-xl text-base leading-7 text-bone/75 sm:text-lg sm:leading-8">
              <Typewriter
                phrases={[
                  "Tsunamis that redraw coastlines…",
                  "Quakes that flatten cities in 2 minutes…",
                  "Floods that swallow whole districts…",
                  "…and the chain that fights back in 38s.",
                ]}
              />
            </p>
            <p className="hero-in hero-in-3 mt-3 max-w-xl text-sm leading-6 text-bone/60">
              ReliefChain is a verified network of NGOs, PWD companies and
              government bodies. Sign in once — then pick why you&apos;re here
              and see the full story.
            </p>

            <div className="hero-in hero-in-4 mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="cta-ring inline-flex h-13 items-center rounded-full bg-bone px-8 py-3.5 font-ui text-xs font-semibold uppercase tracking-widest text-espresso transition-all hover:-translate-y-0.5"
              >
                <LogIn size={15} className="mr-2" />
                Let&apos;s sign in to see
              </Link>
              <a
                href="#why"
                className="inline-flex h-13 items-center rounded-full border border-bone/30 px-8 py-3.5 font-ui text-xs font-semibold uppercase tracking-widest text-bone transition-all hover:-translate-y-0.5 hover:bg-bone/10"
              >
                Yes, show me
                <ArrowDown size={15} className="scroll-hint ml-2" />
              </a>
            </div>

            <div className="hero-in hero-in-5 mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="flex flex-wrap gap-x-8 gap-y-3 font-ui text-[11px] uppercase tracking-widest text-bone/55">
                <span>Google one-tap login</span>
                <span>Free for verified orgs</span>
                <span>₹0 commission on donations</span>
              </div>
              {heroStory && (
                <Link
                  href="/impact"
                  className="story-zoom lift group block overflow-hidden rounded-2xl border border-bone/15 bg-bone/[0.06] backdrop-blur-sm"
                >
                  <div
                    className="story-art relative flex h-32 items-end overflow-hidden p-4"
                    style={{ background: typeArt[heroStory.type] }}
                  >
                    <span className="absolute right-4 top-3 font-display text-6xl font-bold text-white/25">
                      {heroStory.type[0]}
                    </span>
                    <Badge tone={urgencyTone(heroStory.severity)}>
                      {heroStory.severity}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <p className="flex items-center gap-1.5 font-ui text-[11px] uppercase tracking-widest text-bone/60">
                      <MapPin size={12} />
                      {heroStory.region}, {heroStory.state}
                    </p>
                    <p className="mt-2 font-display text-xl font-semibold leading-snug text-bone">
                      {heroStory.title}
                    </p>
                    <p className="mt-2 flex items-center justify-between text-sm text-bone/70">
                      <span className="font-mono font-semibold text-bone">
                        <CountUp to={heroStory.affected} /> affected
                      </span>
                      <span className="inline-flex items-center gap-1 font-ui text-[11px] uppercase tracking-widest text-warn transition-transform group-hover:translate-x-1">
                        What caused this <ArrowUpRight size={13} />
                      </span>
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* hero stat band */}
          <div className="relative z-[2] grid grid-cols-2 gap-px border-t border-bone/15 bg-bone/10 lg:grid-cols-4">
            {[
              { v: stats.verifiedOrgs, l: "Verified bodies" },
              { v: openTenders.length, l: "Open tenders" },
              { v: affectedNow, l: "Affected right now" },
              { v: stats.dispatched, l: "Alerts dispatched" },
            ].map((s) => (
              <div key={s.l} className="bg-espresso/60 px-6 py-5 backdrop-blur-sm">
                <p className="font-mono text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
                  <CountUp to={s.v} />
                </p>
                <p className="mt-1 font-ui text-[10px] uppercase tracking-widest text-bone/55">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* marquee */}
      <div className="mt-3 bg-canvas px-3 sm:px-5">
        <Marquee className="mx-auto max-w-7xl rounded-full border border-line bg-surface py-3">
          {marqueeTerms.map((t) => (
            <span
              key={t}
              className="mx-5 inline-flex items-center gap-5 whitespace-nowrap font-ui text-xs uppercase tracking-widest text-slate-body"
            >
              {t}
              <span className="text-teal-brand">•</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ============ STEP 03 — WHY ARE YOU HERE? ============ */}
      <section id="why" className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Why are you here?"
              title="Choose your path"
              desc="After signing in, everyone lands here. Seven paths, one chain — select one to continue directly."
              action={{ href: "/start", label: "Open full picker" }}
            />
          </Reveal>
          <IntentGrid compact />
        </div>
      </section>

      {/* ============ STEP 04 — WHAT NATURE CAN CAUSE ============ */}
      <section id="impact" className="border-y border-line bg-bone">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <SectionHead
              eyebrow="What nature can cause us"
              title="Reports from the past, emergencies of today"
              desc="Tsunami, quakes, floods — what already happened, plus what's unfolding live. Then how ReliefChain answers."
              action={{ href: "/impact", label: "Full impact story" }}
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {active.slice(0, 3).map((d, i) => (
              <Reveal key={d.id} delay={(i % 3) * 100}>
                <Link
                  href="/impact"
                  className="story-zoom lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface"
                >
                  <div
                    className="story-art relative flex h-44 items-end justify-between overflow-hidden p-4"
                    style={{ background: typeArt[d.type] }}
                  >
                    <DisasterArt
                      type={d.type}
                      className="absolute inset-0 h-full w-full"
                    />
                    <span className="relative">
                      <Badge tone={urgencyTone(d.severity)}>{d.severity}</Badge>
                    </span>
                    <span className="relative rounded-full bg-black/35 px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                      {d.type}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="flex items-center gap-1.5 font-ui text-[11px] uppercase tracking-widest text-slate-body">
                      <MapPin size={12} className="text-teal-brand" />
                      {d.region}, {d.state}
                    </p>
                    <h3 className="mt-2.5 font-display text-[1.35rem] font-semibold leading-snug tracking-tight text-slate-ink">
                      {d.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-body">
                      {d.summary}
                    </p>
                    <p className="mt-4 flex items-center justify-between border-t border-line pt-4">
                      <span className="font-mono text-sm font-semibold text-slate-ink">
                        {d.affected.toLocaleString("en-IN")} affected
                      </span>
                      <span className="inline-flex items-center gap-1 font-ui text-[11px] font-semibold uppercase tracking-widest text-teal-brand transition-transform group-hover:translate-x-1">
                        Why this happened <ArrowUpRight size={13} />
                      </span>
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={100}>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryCTA href="/impact">
                See past reports + how we help
                <ArrowRight size={15} className="ml-2" />
              </PrimaryCTA>
              <Link
                href="/disasters"
                className="inline-flex h-12 items-center rounded-full border border-line-strong bg-surface px-7 font-ui text-xs font-semibold uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5"
              >
                Open live register →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ KNOW NATURE TEASER ============ */}
      <section id="study" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHead
            eyebrow="Know nature"
            title="Why disasters happen & how to resist"
            desc="Floods, quakes, cyclones, heatwaves — kid-friendly lessons, flip cards, drills and a 60-second quiz."
            action={{ href: "/learn", label: "Open Know nature" }}
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Floods", type: "Flood", d: "Why rivers overflow — and the ankle-rule that saves lives.", art: typeArt.Flood },
            { t: "Earthquakes", type: "Earthquake", d: "Why plates slip — and Drop-Cover-Hold in 10 seconds.", art: typeArt.Earthquake },
            { t: "Cyclones", type: "Cyclone", d: "Why oceans spin storms — and sheltering before landfall.", art: typeArt.Cyclone },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 100}>
              <Link
                href="/learn"
                className="quake-hover lift group block overflow-hidden rounded-2xl border border-line bg-surface"
              >
                <div className="relative flex h-32 items-end overflow-hidden p-5" style={{ background: c.art }}>
                  <DisasterArt
                    type={c.type as Disaster["type"]}
                    className="absolute inset-0 h-full w-full"
                  />
                  <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm">
                    <GraduationCap size={17} />
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-slate-ink">{c.t}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-body">{c.d}</p>
                  <span className="mt-3 inline-flex items-center gap-1 font-ui text-[11px] font-semibold uppercase tracking-widest text-teal-brand">
                    Start lesson <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ ENTRY ============ */}
      <section id="enter" className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Sign in to see everything"
              title="Your chain is one tap away"
              desc="Google one-tap or email — then tell us why you're here and explore impact, tenders and lessons."
            />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <Link
                href="/login"
                className="lift group flex h-full flex-col rounded-2xl border border-line bg-surface p-7 sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <Kicker>Entry · Google + email</Kicker>
                  <span className="grid size-10 place-items-center rounded-full bg-canvas text-slate-ink transition-all duration-300 group-hover:bg-slate-ink group-hover:text-bone">
                    <LogIn size={17} />
                  </span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-ink">
                  Sign in
                </h2>
                <p className="mt-2 max-w-md text-[15px] leading-7">
                  Includes Google one-tap. Opens your path picker, live map,
                  tenders and the funds ledger.
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-ui text-[11px] font-semibold uppercase tracking-widest text-teal-brand">
                  Open sign in
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
            <Reveal delay={110}>
              <Link
                href="/signup"
                className="lift group flex h-full flex-col rounded-2xl border border-espresso bg-espresso p-7 text-bone sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest text-bone/60">
                    <span className="inline-block size-1.5 rounded-full bg-warn" />
                    Entry · new here
                  </p>
                  <span className="grid size-10 place-items-center rounded-full bg-bone/10 text-bone transition-all duration-300 group-hover:bg-teal-brand group-hover:text-white">
                    <UserPlus size={17} />
                  </span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
                  Create an account
                </h2>
                <p className="mt-2 max-w-md text-[15px] leading-7 text-bone/70">
                  Under a minute with Google or email, then register your
                  organisation for verification.
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-ui text-[11px] font-semibold uppercase tracking-widest text-warn">
                  Start signup
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FOR GOVERNMENTS ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Reveal>
          <Link
            href="/government"
            className="lift group flex flex-col gap-4 overflow-hidden rounded-2xl border border-espresso bg-espresso p-7 text-bone sm:flex-row sm:items-center sm:p-8"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-bone/10 text-warn">
              <Landmark size={21} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-ui text-[11px] font-semibold uppercase tracking-widest text-bone/60">
                For districts, states & institutions
              </span>
              <span className="mt-1 block font-display text-2xl font-bold tracking-tight">
                Deploy ReliefChain as public infrastructure.
              </span>
              <span className="mt-1 block text-sm text-bone/70">
                Verified network · auditable funds · 30-day pilot with an evidence pack.
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-bone px-6 py-3 font-ui text-[11px] font-semibold uppercase tracking-widest text-espresso transition-transform group-hover:translate-x-1">
              Buyer page <ArrowRight size={14} />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="bg-canvas px-3 pb-3 sm:px-5 sm:pb-5">
        <Reveal scale>
          <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-teal-brand text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 120% at 85% 10%,rgba(255,190,120,0.35),transparent 60%),radial-gradient(50% 100% at 0% 100%,rgba(0,0,0,0.4),transparent 60%)",
              }}
            />
            <p
              aria-hidden
              className="ghost-type pointer-events-none absolute -top-6 right-0 z-[1] select-none whitespace-nowrap font-display text-[18vw] font-bold leading-none text-white lg:text-[13rem]"
            >
              JOIN
            </p>
            <div className="relative z-[2] flex flex-col items-start gap-7 px-6 py-14 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-16">
              <div>
                <p className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest text-white/70">
                  <span className="inline-block size-1.5 rounded-full bg-white" />
                  Registration
                </p>
                <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                  Your organisation belongs on the chain.
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/80">
                  Registration takes 4 minutes. Verification is manual,
                  document-backed and usually clears within 48 hours.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center rounded-full bg-white px-7 font-ui text-xs font-semibold uppercase tracking-widest text-espresso shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(0,0,0,0.35)]"
                >
                  Register your organisation
                  <ArrowRight size={15} className="ml-2" />
                </Link>
                <Link
                  href="/donate"
                  className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 font-ui text-xs font-semibold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Donate →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
