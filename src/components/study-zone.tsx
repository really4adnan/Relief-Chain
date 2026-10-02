"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Backpack,
  BellRing,
  CircleCheck,
  CircleX,
  FlaskConical,
} from "lucide-react";
import { StormField, Tilt } from "@/components/journey";
import { DisasterArt } from "@/components/disaster-art";
import { Reveal } from "@/components/motion";
import { Kicker, PrimaryCTA } from "@/components/ui";

type Lesson = {
  type: string;
  emoji: string;
  why: string;
  signs: string[];
  doList: string[];
  dontList: string[];
  drill: string;
  art: string;
  fun: string;
};

const lessons: Lesson[] = [
  {
    type: "Flood",
    emoji: "🌊",
    why: "Too much rain + rivers full + drains blocked = water takes over streets and homes.",
    signs: ["Continuous heavy rain for 2+ days", "River water turning muddy & rising fast", "Government SMS / siren alerts"],
    doList: ["Move to high ground early, carry documents in a polybag", "Turn off gas + electricity before leaving", "Drink only boiled / bottled water"],
    dontList: ["Don't walk through flowing water above ankles", "Don't touch hanging electric wires", "Don't eat food touched by floodwater"],
    drill: "School drill: practice a 5-minute 'grab-bag + staircase' evacuation every monsoon.",
    art: "linear-gradient(135deg,#0c4a6e,#0e7490)",
    fun: "One bucket of floodwater can hide a live wire. Water + electricity = danger!",
  },
  {
    type: "Earthquake",
    emoji: "🏚",
    why: "Earth's plates suddenly slip underground. The shake travels like ripples in water.",
    signs: ["No real warning — that's why drills matter", "Animals behaving strangely (not reliable!)", "Phone alert: 'DROP-COVER-HOLD'"],
    doList: ["DROP under a table, COVER head, HOLD ON", "If outside, move away from buildings & wires", "After shaking, check gas leak before lighting anything"],
    dontList: ["Don't run during shaking — most injuries happen on stairs", "Don't use lifts", "Don't stand near glass windows"],
    drill: "School drill: monthly Drop-Cover-Hold under desks, then line-up on the playground.",
    art: "linear-gradient(135deg,#451a03,#b45309)",
    fun: "The 2001 Bhuj quake lasted ~2 minutes but changed building rules across India.",
  },
  {
    type: "Cyclone",
    emoji: "🌀",
    why: "Hot ocean water spins into a giant rotating storm that slams the coast with wind + waves.",
    signs: ["IMD red / orange warnings + wind picking up", "Sea becoming rough, fishers returning early", "Dark rotating clouds + falling pressure"],
    doList: ["Tape windows in X shape, stay in the strongest room", "Keep torch + battery radio ready", "Evacuate early if police / volunteers say so"],
    dontList: ["Don't go to the beach to 'watch' the storm", "Don't stay in tin / thatch shelters", "Don't spread rumours — follow IMD only"],
    drill: "School drill: map your nearest cyclone shelter and practise the route.",
    art: "linear-gradient(135deg,#1e3a5f,#0ea5e9)",
    fun: "Cyclone eyes are calm! The most dangerous winds spin around the quiet centre.",
  },
  {
    type: "Heatwave",
    emoji: "🌡",
    why: "Hot dry air stays trapped for days. Cities with concrete + no trees get hottest.",
    signs: ["IMD heat alert 44°C+", "Headache, dizziness, no sweating = danger", "Birds panting, taps running hot"],
    doList: ["Drink water every hour, wear light cotton + cap", "Stay indoors 12–4 pm, ORS if sweating a lot", "Check on grandparents + pets twice a day"],
    dontList: ["Don't play in direct sun at noon", "Don't drink cola / energy drinks for thirst", "Don't leave kids or pets in parked cars"],
    drill: "School drill: 'water-bell' every period + shaded assembly in May–June.",
    art: "linear-gradient(135deg,#5c1a02,#f59e0b)",
    fun: "Wet your scarf + sit under a fan — desi cooler science that actually saves lives.",
  },
  {
    type: "Landslide",
    emoji: "⛰",
    why: "Heavy rain + loose hill soil + cut trees = whole slopes slide down in seconds.",
    signs: ["Cracks in walls / roads on slopes", "Muddy gushing springs after rain", "Rumbling sound from the hill"],
    doList: ["Move away from the slope path, alert neighbours loudly", "Call 112 / district control room fast", "Stay in relief camp till engineers clear the slope"],
    dontList: ["Don't build or camp near steep cuts", "Don't cross a fresh debris flow", "Don't cut trees on slopes"],
    drill: "School drill (hill schools): mark danger slopes on a hand map with teachers.",
    art: "linear-gradient(135deg,#292524,#857262)",
    fun: "Tree roots hold hills like fingers hold soil. More trees = fewer slides.",
  },
  {
    type: "Wildfire",
    emoji: "🔥",
    why: "Dry leaves + heat + one spark (or lightning) = forest fire that runs with the wind.",
    signs: ["Smoke smell + orange sky", "Ash falling like snow", "Forest department alerts"],
    doList: ["Call 101 / forest dept, give exact location", "Cover nose with wet cloth, move upwind", "Wet the roof / surroundings if safe"],
    dontList: ["Don't throw glass or bidis in forests", "Don't run uphill into the fire path", "Don't try to fight big fires yourself"],
    drill: "School drill: fire-exit walk + 'stop-drop-roll' practice every term.",
    art: "linear-gradient(135deg,#431407,#ea580c)",
    fun: "A single glass bottle in dry grass can start a fire like a magnifying lens!",
  },
];

const quiz = [
  { q: "Flood water is above your ankles and flowing fast. You…", a: ["Wade through quickly", "Wait / take a higher route", "Swim across"], correct: 1 },
  { q: "Earthquake starts in class. First move?", a: ["Run to stairs", "Drop-Cover-Hold under desk", "Stand near window"], correct: 1 },
  { q: "IMD issues a cyclone red warning. You…", a: ["Go beach-watching", "Evacuate / shelter as told", "Ignore it"], correct: 1 },
];

function QuizBox() {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const score = quiz.filter((q, i) => picked[i] === q.correct).length;
  return (
    <div className="rounded-2xl border border-line bg-canvas p-6 sm:p-8">
      <p className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest text-slate-body">
        <FlaskConical size={14} className="text-teal-brand" /> 60-second quiz · tap an answer
      </p>
      <div className="mt-4 space-y-5">
        {quiz.map((q, i) => (
          <div key={q.q} className="rounded-xl border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-slate-ink">{i + 1}. {q.q}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {q.a.map((opt, oi) => {
                const chosen = picked[i] === oi;
                const revealed = picked[i] !== undefined;
                const isRight = oi === q.correct;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPicked((p) => ({ ...p, [i]: oi }))}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5 ${
                      chosen
                        ? isRight
                          ? "border-ok bg-ok-tint text-ok"
                          : "border-alert bg-alert-tint text-alert"
                        : revealed && isRight
                          ? "border-ok/50 text-ok"
                          : "border-line-strong bg-surface text-slate-body"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 font-ui text-xs uppercase tracking-widest text-slate-ink">
        Score: {score} / {quiz.length} {score === 3 ? "— Disaster-ready." : score === 2 ? "— Almost there." : "— Review the lessons above."}
      </p>
    </div>
  );
}

export function StudyZone() {
  const [active, setActive] = useState(lessons[0]);

  return (
    <>
      <section className="bg-canvas px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-espresso text-bone">
          <StormField />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="ember-breathe absolute -left-20 -top-20 size-80 rounded-full bg-teal-brand/40 blur-[100px]" />
            <div className="float-y-slow absolute -bottom-24 right-[-4rem] size-96 rounded-full bg-umber/50 blur-[120px]" />
          </div>
          <p aria-hidden className="ghost-type pointer-events-none absolute -bottom-6 left-0 z-[1] select-none whitespace-nowrap font-display text-[20vw] font-bold leading-none text-bone lg:text-[15rem]">
            NATURE
          </p>
          <div className="relative z-[2] px-6 pb-10 pt-12 sm:px-10 lg:px-14">
            <p className="hero-in hero-in-1 flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest text-bone/60">
              <Backpack size={13} className="text-warn" /> Know nature · student edition
            </p>
            <h1 className="hero-in hero-in-3 mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
              Why disasters happen. <br /><em className="gradient-text not-italic">How to resist them.</em>
            </h1>
            <p className="hero-in hero-in-4 mt-4 max-w-xl text-base leading-7 text-bone/75 sm:text-lg">
              Pick a disaster, flip the cards, learn the drill — then prove it in the 60-second quiz.
            </p>
            <div className="hero-in hero-in-5 mt-6 flex flex-wrap gap-2">
              {lessons.map((l) => (
                <button
                  key={l.type}
                  type="button"
                  onClick={() => setActive(l)}
                  className={`rounded-full px-4 py-2 font-ui text-[11px] font-semibold uppercase tracking-widest transition-all hover:-translate-y-0.5 ${
                    active.type === l.type
                      ? "bg-bone text-espresso shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                      : "border border-bone/30 text-bone/70 hover:bg-bone/10 hover:text-bone"
                  }`}
                >
                  {l.type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-line bg-surface">
            <div className="relative overflow-hidden p-6 sm:p-10" style={{ background: active.art }}>
              <DisasterArt
                type={active.type as "Flood" | "Earthquake" | "Cyclone" | "Heatwave" | "Landslide" | "Wildfire"}
                className="absolute inset-0 h-full w-full opacity-90"
              />
              <p className="relative font-ui text-[11px] uppercase tracking-widest text-white/70">Now studying · {active.type}</p>
              <h2 className="relative mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {active.why}
              </h2>
              <p className="relative mt-3 max-w-xl rounded-full bg-black/30 px-4 py-2 text-xs leading-5 text-white backdrop-blur-sm">
                Field note: {active.fun}
              </p>
            </div>
            <div className="grid gap-4 p-6 sm:p-8 lg:grid-cols-3">
              <div className="rounded-2xl border border-line bg-canvas p-5">
                <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-warn">
                  <BellRing size={14} /> Warning signs
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-body">
                  {active.signs.map((s) => <li key={s} className="flex gap-2"><span className="text-warn">●</span>{s}</li>)}
                </ul>
              </div>
              <div className={`flip rounded-2xl border border-ok/40 bg-ok-tint p-5 ${active.type === "Earthquake" ? "quake-hover" : ""}`}>
                <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-ok">
                  <CircleCheck size={14} /> How to resist · hover to flip
                </p>
                <div className="flip-inner mt-3">
                  <ul className="flip-face space-y-2 text-sm leading-6 text-slate-ink">
                    {active.doList.map((d) => <li key={d} className="flex gap-2"><span className="font-bold text-ok">—</span>{d}</li>)}
                  </ul>
                </div>
                <p className="mt-3 border-t border-ok/30 pt-3 text-xs leading-5 text-slate-body">
                  {active.drill}
                </p>
              </div>
              <div className="rounded-2xl border border-alert/40 bg-alert-tint p-5">
                <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-alert">
                  <CircleX size={14} /> Never do this
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-ink">
                    {active.dontList.map((d) => <li key={d} className="flex gap-2"><span className="font-bold text-alert">—</span>{d}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10">
          <Kicker>All six · hover any card to flip</Kicker>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-ink">The full syllabus</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((l, i) => (
              <Reveal key={l.type} delay={(i % 3) * 90}>
                <Tilt className="h-full">
                  <button
                    type="button"
                    onClick={() => { setActive(l); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="flip block h-full w-full text-left"
                  >
                    <span className="flip-inner block h-56">
                      <span className="flip-face absolute inset-0 flex flex-col justify-end overflow-hidden rounded-2xl border border-line p-5" style={{ background: l.art }}>
                        <DisasterArt
                          type={l.type as "Flood" | "Earthquake" | "Cyclone" | "Heatwave" | "Landslide" | "Wildfire"}
                          className="absolute inset-0 h-full w-full"
                        />
                        <span className="relative mt-3 font-display text-2xl font-semibold text-white">{l.type}</span>
                        <span className="relative font-ui text-[10px] uppercase tracking-widest text-white/70">hover to flip · tap to study</span>
                      </span>
                      <span className="flip-face flip-back absolute inset-0 flex flex-col justify-center rounded-2xl border border-espresso bg-espresso p-5 text-bone">
                        <span className="font-ui text-[10px] uppercase tracking-widest text-warn">How to resist</span>
                        <span className="mt-2 line-clamp-4 text-sm leading-6 text-bone/85">{l.doList[0]} · {l.doList[1]}</span>
                        <span className="mt-3 inline-flex items-center gap-1 font-ui text-[11px] font-semibold uppercase tracking-widest text-warn">
                          Open lesson <ArrowRight size={12} />
                        </span>
                      </span>
                    </span>
                  </button>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal><QuizBox /></Reveal>
          <Reveal delay={110}>
            <div className="grain relative flex h-full flex-col overflow-hidden rounded-2xl bg-teal-brand p-6 text-white sm:p-8">
              <p className="font-ui text-[11px] uppercase tracking-widest text-white/70">You studied — now act</p>
              <h3 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight">Grown-ups move relief. Students move awareness.</h3>
              <p className="mt-3 text-sm leading-6 text-white/85">Share the drill with your class, then explore live disasters or donate to a real camp.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryCTA href="/impact" className="!bg-white !text-espresso shadow-none">See real impact</PrimaryCTA>
                <Link href="/start" className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 font-ui text-xs font-semibold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-white/10">
                  Pick another path →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
