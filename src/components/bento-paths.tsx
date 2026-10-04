"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  HandCoins,
  LifeBuoy,
  MapPin,
} from "lucide-react";
import { Reveal } from "@/components/motion";
import { Kicker } from "@/components/ui";

export type BentoStateCount = { state: string; active: number };

/**
 * Bento path selection — one featured emergency card (60%) plus three
 * compact cards. Counts are live props, never hardcoded zeros.
 */
export function BentoPaths({
  states,
  openTenders,
  drillCount,
}: {
  states: BentoStateCount[];
  openTenders: number;
  drillCount: number;
}) {
  const [picked, setPicked] = useState("");
  const pickedCount = states.find((s) => s.state === picked)?.active ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <Reveal>
        <Kicker>Choose your path</Kicker>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-slate-ink sm:text-4xl">
          Two doors. Pick the one that matches your urgency.
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-5 lg:grid-cols-5">
        {/* Card 1 — featured emergency help (60%) */}
        <Reveal className="lg:col-span-3">
          <article className="card-hover flex h-full flex-col rounded-2xl border border-alert/40 bg-surface p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-8">
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-alert px-3 py-1 font-mono text-[11px] font-medium tracking-wide text-white">
              <span className="live-dot inline-block size-1.5 rounded-full bg-white" />
              Urgent · open to all
            </p>
            <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-ink sm:text-4xl">
              I need emergency help
            </h3>
            <p className="mt-2 max-w-md text-[15px] leading-7 text-slate-body">
              Find who responds near you — relief camps, rescue crews and
              medical triage — with live tracking of aid reaching your
              district.
            </p>

            <label
              htmlFor="bento-state"
              className="mt-6 block font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-body"
            >
              <MapPin size={13} className="mr-1 inline" aria-hidden="true" />
              Your location
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <select
                id="bento-state"
                value={picked}
                onChange={(e) => setPicked(e.target.value)}
                className="h-12 min-h-[48px] flex-1 rounded-xl border border-line-strong bg-surface px-3 text-sm text-slate-ink focus:border-teal-brand"
              >
                <option value="">All of India — show everything</option>
                {states.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state} — {s.active} active {s.active === 1 ? "emergency" : "emergencies"}
                  </option>
                ))}
              </select>
              <Link
                href="/live"
                aria-label={
                  picked
                    ? `Request emergency aid near ${picked}`
                    : "Request emergency aid"
                }
                className="pressable inline-flex h-12 min-h-[48px] items-center justify-center gap-2 rounded-full bg-teal-brand px-7 font-ui text-xs font-semibold uppercase tracking-widest text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-teal-brand-hover active:scale-[0.98]"
              >
                Request emergency aid
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-3 font-mono text-[11px] tracking-wide text-slate-body">
              {picked && pickedCount !== null
                ? `${pickedCount} active ${pickedCount === 1 ? "emergency" : "emergencies"} in ${picked} · dial 112 any time`
                : "Emergency? Dial 112 · NDMA 1078 — no account needed"}
            </p>
          </article>
        </Reveal>

        {/* Right rail — three compact cards */}
        <div className="grid gap-5 lg:col-span-2">
          <Reveal delay={90}>
            <Link
              href="/tenders"
              className="card-hover group flex h-full items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-brand text-white">
                <HandCoins size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl font-semibold tracking-tight text-slate-ink">
                  Live relief tenders
                </span>
                <span className="mt-0.5 block text-sm leading-6 text-slate-body">
                  <span className="font-mono font-medium text-slate-ink">
                    {openTenders} open
                  </span>{" "}
                  — food, boats, shelters, logistics. Claiming needs sign-in.
                </span>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-slate-body transition-transform group-hover:translate-x-1 group-hover:text-slate-ink" />
            </Link>
          </Reveal>

          <Reveal delay={150}>
            <Link
              href="/register"
              className="card-hover group flex h-full items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-slate-ink text-white">
                <Building2 size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl font-semibold tracking-tight text-slate-ink">
                  NGO &amp; partner registration
                </span>
                <span className="mt-0.5 block text-sm leading-6 text-slate-body">
                  Ground teams onboard here — verified in ~48 hours. Sign-in
                  required.
                </span>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-slate-body transition-transform group-hover:translate-x-1 group-hover:text-slate-ink" />
            </Link>
          </Reveal>

          <Reveal delay={210}>
            <Link
              href="/learn#ndma-drills"
              className="card-hover group flex h-full items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ok-tint text-ok">
                <GraduationCap size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl font-semibold tracking-tight text-slate-ink">
                  NDMA safety drills
                </span>
                <span className="mt-0.5 block text-sm leading-6 text-slate-body">
                  <span className="font-mono font-medium text-slate-ink">
                    {drillCount} bite-sized drills
                  </span>{" "}
                  — offline-first survival protocols, free forever.
                </span>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-slate-body transition-transform group-hover:translate-x-1 group-hover:text-slate-ink" />
            </Link>
          </Reveal>
        </div>
      </div>

      <Reveal delay={120}>
        <p className="mt-8 flex items-center justify-center gap-2 border-t border-line pt-5 text-center font-mono text-[11px] tracking-wide text-slate-body">
          <LifeBuoy size={13} aria-hidden="true" className="text-teal-brand" />
          Built for low-bandwidth mobile networks during emergency power outages.
        </p>
      </Reveal>
    </div>
  );
}
