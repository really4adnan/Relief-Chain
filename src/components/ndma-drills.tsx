"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Timer,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { NDMA_DRILLS, type NdmaDrill } from "@/lib/ndma";

const drillIcons = { flood: Waves, earthquake: Zap, cyclone: Wind } as const;

/** 10-second Drop-Cover-Hold practice timer (earthquake drill). */
function DrillTimer() {
  const [left, setLeft] = useState<number | null>(null);
  const done = left === 0;

  useEffect(() => {
    if (left === null || left <= 0) return;
    const t = setTimeout(() => setLeft((v) => (v === null ? v : v - 1)), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return (
    <div className="mt-5 rounded-xl border border-line bg-canvas p-4">
      <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-body">
        <Timer size={14} className="text-teal-brand" />
        Practice timer · Drop, Cover, Hold
      </p>
      <div className="mt-3 flex items-center gap-4">
        <span
          aria-live="polite"
          className="font-mono text-4xl font-semibold tabular-nums text-slate-ink"
        >
          {left === null ? "10" : left}s
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-teal-brand transition-all duration-1000"
            style={{
              width:
                left === null ? "0%" : `${((10 - left) / 10) * 100}%`,
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => setLeft(10)}
          className="shrink-0 rounded-full bg-slate-ink px-5 py-2.5 font-ui text-[11px] font-semibold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {left !== null && !done ? "Restart" : "Start drill"}
        </button>
      </div>
      {done && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-teal-brand">
          <CheckCircle2 size={15} />
          Drill complete — hold that reflex.
        </p>
      )}
    </div>
  );
}

function DrillCard({
  drill,
  open,
  onToggle,
}: {
  drill: NdmaDrill;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = drillIcons[drill.slug];
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const kitDone = drill.checklist
    ? `${checked.size}/${drill.checklist.length} packed`
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-canvas/60 active:scale-[0.99] sm:p-6"
      >
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-full transition-colors ${
            open ? "bg-slate-ink text-white" : "bg-canvas text-slate-ink"
          }`}
        >
          <Icon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl font-medium tracking-tight text-slate-ink">
            {drill.title}
          </span>
          <span className="mt-0.5 block truncate text-sm text-slate-body">
            {drill.tagline}
          </span>
        </span>
        <span className="hidden shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-slate-body sm:inline-block">
          {drill.duration}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-body transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-line p-5 sm:p-6">
          <ol className="space-y-4">
            {drill.steps.map((s, i) => (
              <li key={s.title} className="flex gap-3.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal-tint font-mono text-xs font-semibold text-teal-brand">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-ink">{s.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-slate-body">
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {drill.slug === "earthquake" && <DrillTimer />}

          {drill.checklist && (
            <div className="mt-5 rounded-xl border border-line bg-canvas p-4">
              <p className="flex items-center justify-between font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-body">
                {drill.checklistTitle}
                <span className="font-mono normal-case tracking-normal text-teal-brand">
                  {kitDone}
                </span>
              </p>
              <ul className="mt-3 space-y-2">
                {drill.checklist.map((item, i) => (
                  <li key={item}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm transition-all hover:border-slate-ink active:scale-[0.99]">
                      <input
                        type="checkbox"
                        checked={checked.has(i)}
                        onChange={() => toggleCheck(i)}
                        className="size-4 shrink-0 accent-[#2E5A44]"
                      />
                      <span
                        className={
                          checked.has(i)
                            ? "text-slate-body line-through"
                            : "text-slate-ink"
                        }
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-alert/30 bg-alert-tint p-4">
            <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-alert">
              <AlertTriangle size={14} />
              NDMA says don&rsquo;t
            </p>
            <ul className="mt-2 space-y-1.5">
              {drill.donts.map((d) => (
                <li
                  key={d}
                  className="flex gap-2 text-sm leading-6 text-slate-ink"
                >
                  <span className="font-bold text-alert">×</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 font-mono text-[11px] tracking-wide text-slate-body">
            Adapted from{" "}
            <a
              href={drill.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-teal-brand underline underline-offset-4"
            >
              {drill.sourceLabel} · ndma.gov.in
              <ExternalLink size={11} />
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

/** Interactive NDMA safety drill cards — accordion steps, kit checklist, drill timer. */
export function NdmaDrills() {
  const [openSlug, setOpenSlug] = useState<string>(NDMA_DRILLS[0].slug);

  return (
    <div className="grid gap-4">
      {NDMA_DRILLS.map((drill) => (
        <DrillCard
          key={drill.slug}
          drill={drill}
          open={openSlug === drill.slug}
          onToggle={() =>
            setOpenSlug((cur) => (cur === drill.slug ? "" : drill.slug))
          }
        />
      ))}
    </div>
  );
}
