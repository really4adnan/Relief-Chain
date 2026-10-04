import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AlertTicker } from "@/components/alert-ticker";
import { IntentGrid, StormField, Typewriter } from "@/components/journey";
import { Reveal } from "@/components/motion";
import { Kicker } from "@/components/ui";

export const metadata: Metadata = {
  title: "Why are you here?",
  description:
    "Tell ReliefChain why you came — explore disasters, get help, claim tenders, register your organisation, donate or study.",
};

export default function StartPage() {
  return (
    <>
      <AlertTicker />
      {/* Header gate */}
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
            WHY YOU?
          </p>
          <div className="relative z-[2] px-6 pb-10 pt-12 sm:px-10 lg:px-14">
            <p className="hero-in hero-in-1 flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest text-bone/60">
              <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
              What do you want to do?
            </p>
            <h1 className="hero-in hero-in-3 mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
              Why are you <em className="text-amber-200 not-italic">here?</em>
            </h1>
            <p className="hero-in hero-in-4 mt-4 max-w-xl text-base leading-7 text-bone/75 sm:text-lg">
              <Typewriter
                phrases={[
                  "Explore live disasters…",
                  "Get help fast…",
                  "Claim a relief tender…",
                  "Register your organisation…",
                  "Donate transparently…",
                  "Know how nature works…",
                ]}
              />
            </p>
            <p className="hero-in hero-in-5 mt-3 max-w-xl text-sm leading-6 text-bone/60">
              One tap sends you to the right room. You can always come back and
              pick another — the whole chain stays open.
            </p>
          </div>
        </div>
      </section>

      {/* Intent grid */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Reveal>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <Kicker>Seven paths · one chain</Kicker>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-ink">
                  Select what describes you
                </h2>
              </div>
              <Link
                href="/impact"
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-4 py-2 font-ui text-[11px] uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5 hover:border-teal-brand hover:text-teal-brand"
              >
                Skip → see what nature can cause
              </Link>
            </div>
          </Reveal>
          <IntentGrid />
          <Reveal delay={120}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/impact"
                className="btn-ember inline-flex h-12 items-center rounded-full bg-teal-brand px-7 font-ui text-xs font-semibold uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(148,39,2,0.35)] transition-all hover:-translate-y-0.5"
              >
                Continue → what nature can cause
                <ArrowRight size={15} className="ml-2" />
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center rounded-full border border-line-strong bg-surface px-7 font-ui text-xs font-semibold uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5"
              >
                <ArrowLeft size={15} className="mr-2" />
                Back to the question
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
