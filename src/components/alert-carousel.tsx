"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type AlertItem = {
  id: string;
  level: "L1" | "L2" | "L3";
  severity: string;
  state: string;
  title: string;
  camps: number;
  affected: string;
};

/** Solid severity fills — no muted outlines for critical states. */
const severityFill: Record<string, string> = {
  critical: "bg-alert text-white",
  high: "bg-[#9a3412] text-white",
  moderate: "bg-l1-bg text-l1-text",
};

/**
 * Interactive alert carousel — replaces the scrolling marquee.
 * Pause/play, prev/next, and per-state filters (Assam, Odisha, TN…)
 * so readers tap straight into a state feed instead of waiting out
 * a loop. Auto-advances every 6s; respects reduced-motion.
 */
export function AlertCarousel({ items }: { items: AlertItem[] }) {
  const states = useMemo(
    () => [...new Set(items.map((i) => i.state))],
    [items],
  );
  const [filter, setFilter] = useState<string>("all");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.state === filter)),
    [items, filter],
  );

  useEffect(() => {
    setIndex(0);
  }, [filter]);

  useEffect(() => {
    if (paused || visible.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % visible.length),
      6000,
    );
    return () => clearInterval(t);
  }, [paused, visible.length]);

  if (items.length === 0) return null;
  const current = visible[index] ?? visible[0];
  if (!current) return null;

  return (
    <div
      className="border-b border-espresso bg-espresso text-white"
      role="region"
      aria-label="Live NDMA operational feed"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2.5 sm:px-6 lg:flex-row lg:items-center lg:gap-4">
        <p className="flex shrink-0 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest">
          <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
          Live · {visible.length} active
        </p>

        {/* State filters */}
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter alerts by state"
        >
          {["all", ...states].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              aria-pressed={filter === s}
              className={`min-h-[48px] rounded-full px-3.5 font-mono text-[11px] font-medium tracking-wide transition-all ${
                filter === s
                  ? "bg-white text-espresso"
                  : "border border-white/30 text-white/80 hover:border-white hover:text-white"
              }`}
            >
              {s === "all" ? "All states" : s}
            </button>
          ))}
        </div>

        {/* Current alert card */}
        <div
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-white/[0.07] px-3.5 py-2"
          aria-live="polite"
        >
          <span
            className={`shrink-0 rounded-md px-2 py-1 font-mono text-[11px] font-semibold tracking-wide ${severityFill[current.severity] ?? "bg-white/15 text-white"}`}
          >
            {current.severity === "critical"
              ? "CRITICAL"
              : current.severity === "high"
                ? "HIGH"
                : current.severity.toUpperCase()}
          </span>
          <p className="min-w-0 flex-1 truncate font-mono text-xs tracking-wide">
            <span className="font-semibold text-amber-200">
              [NDMA {current.level}]
            </span>{" "}
            <span className="text-white">{current.title}</span>{" "}
            <span className="text-white/70">
              · {current.camps} {current.camps === 1 ? "camp" : "camps"} ·{" "}
              {current.affected} affected ·{" "}
              <a
                href="tel:1078"
                aria-label="Call NDMA helpline 1078"
                className="underline underline-offset-4"
              >
                1078
              </a>
              {" / "}
              <a
                href="tel:112"
                aria-label="Call emergency number 112"
                className="underline underline-offset-4"
              >
                112
              </a>
            </span>
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex shrink-0 items-center gap-1.5" role="group" aria-label="Alert carousel controls">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + visible.length) % visible.length)}
            aria-label="Previous alert"
            disabled={visible.length < 2}
            className="grid size-12 min-h-[48px] min-w-[48px] place-items-center rounded-full border border-white/30 text-white transition-all hover:-translate-y-0.5 hover:border-white active:scale-[0.98] disabled:opacity-40"
          >
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume alert rotation" : "Pause alert rotation"}
            aria-pressed={paused}
            className="grid size-12 min-h-[48px] min-w-[48px] place-items-center rounded-full border border-white/30 text-white transition-all hover:-translate-y-0.5 hover:border-white active:scale-[0.98]"
          >
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % visible.length)}
            aria-label="Next alert"
            disabled={visible.length < 2}
            className="grid size-12 min-h-[48px] min-w-[48px] place-items-center rounded-full border border-white/30 text-white transition-all hover:-translate-y-0.5 hover:border-white active:scale-[0.98] disabled:opacity-40"
          >
            <ChevronRight size={17} aria-hidden="true" />
          </button>
          <span className="ml-1 font-mono text-[11px] text-white/60" aria-hidden="true">
            {visible.length > 0 ? `${index + 1}/${visible.length}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
