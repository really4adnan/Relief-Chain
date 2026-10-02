"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { INDIA_VIEWBOX, indiaStatePaths } from "@/lib/india-map-data";

/** 5-step monochrome choropleth ramp — index 0 = no data, 4 = max. */
const FILLS = ["#f3f3f3", "#dcdcdc", "#a1a1aa", "#52525b", "#09090b"];

type Props = {
  /** state id → value (affected people). Missing ids render as no-data. */
  metrics?: Record<string, number>;
  /** state ids that should flash red (critical emergencies) */
  critical?: string[];
  /** state id → secondary line in the tooltip */
  detail?: Record<string, string>;
  selected?: string | null;
  onSelect?: (id: string | null) => void;
  format?: (n: number) => string;
  className?: string;
};

function levelOf(value: number, max: number): number {
  if (!value || value <= 0) return 0;
  if (max <= 0) return 1;
  return Math.min(4, Math.max(1, Math.ceil(Math.sqrt(value / max) * 4)));
}

export function IndiaMap({
  metrics = {},
  critical = [],
  detail = {},
  selected = null,
  onSelect,
  format = (n) => n.toLocaleString("en-IN"),
  className = "",
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const max = useMemo(
    () => Object.values(metrics).reduce((m, v) => Math.max(m, v), 0),
    [metrics],
  );
  const criticalSet = useMemo(() => new Set(critical), [critical]);

  /* Zoom-to-selected: measure the path, centre it, ease the <g> transform. */
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg || !selected) {
      setZoom(null);
      return;
    }
    const path = svg.querySelector<SVGPathElement>(`path[data-id="${selected}"]`);
    if (!path) {
      setZoom(null);
      return;
    }
    const b = path.getBBox();
    if (!b.width || !b.height) {
      setZoom(null);
      return;
    }
    const [, , vw, vh] = INDIA_VIEWBOX.split(" ").map(Number);
    const k = Math.min(3.2, Math.max(1, Math.min(vw / b.width, vh / b.height) * 0.62));
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    setZoom(
      `translate(${vw / 2} ${vh / 2}) scale(${k}) translate(${-cx} ${-cy})`,
    );
  }, [selected]);

  function trackPointer(e: React.MouseEvent) {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const active = hovered ?? selected;
  const activeName = active
    ? (indiaStatePaths.find((s) => s.id === active)?.name ?? null)
    : null;
  const activeValue = active ? (metrics[active] ?? 0) : 0;
  const legendMax = max > 0 ? format(max) : "—";

  return (
    <div className={`relative ${className}`} ref={boxRef}>
      <svg
        ref={svgRef}
        viewBox={INDIA_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full select-none"
        role="img"
        aria-label="Map of India — active emergencies by state"
        onMouseMove={trackPointer}
        onMouseLeave={() => {
          setHovered(null);
          setPointer(null);
        }}
      >
        <g
          style={{
            transform: zoom ?? "none",
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {indiaStatePaths.map((s, i) => {
            const level = levelOf(metrics[s.id] ?? 0, max);
            const isSel = selected === s.id;
            const isHov = hovered === s.id;
            const isCrit = criticalSet.has(s.id);
            const fill = isSel ? "#0f766e" : isHov ? "#27272a" : FILLS[level];
            return (
              <path
                key={s.id}
                data-id={s.id}
                d={s.d}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${s.name}: ${metrics[s.id] ? format(metrics[s.id]) : "no active emergencies"}`}
                className="map-enter outline-none"
                style={{
                  animationDelay: `${Math.min(i * 16, 560)}ms`,
                  fill,
                  stroke: isSel ? "#0f766e" : "#ffffff",
                  strokeWidth: isSel ? 1.6 : 0.7,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHovered(s.id)}
                onFocus={() => setHovered(s.id)}
                onBlur={() => setHovered(null)}
                onClick={() => onSelect?.(isSel ? null : s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(isSel ? null : s.id);
                  }
                }}
              >
                {isCrit && (
                  <animate
                    attributeName="fill-opacity"
                    values="1;0.72;1"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                )}
                <title>{s.name}</title>
              </path>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {activeName && pointer && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[135%] border border-slate-ink bg-slate-ink px-3 py-2 text-canvas shadow-none"
          style={{ left: pointer.x, top: pointer.y }}
        >
          <p className="font-ui text-[10px] uppercase tracking-widest text-canvas/60">
            {active}
            {criticalSet.has(active!) ? " · critical" : ""}
          </p>
          <p className="font-display text-sm leading-tight">{activeName}</p>
          <p className="font-mono text-xs">
            {activeValue > 0 ? `${format(activeValue)} affected` : "No active alerts"}
          </p>
          {detail[active!] && (
            <p className="mt-0.5 font-ui text-[10px] uppercase tracking-widest text-canvas/60">
              {detail[active!]}
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 font-ui text-[10px] uppercase tracking-widest text-slate-body">
        <span className="flex items-center gap-1.5">
          <span className="flex">
            {FILLS.map((f) => (
              <span key={f} className="h-3 w-5 border-r border-surface" style={{ background: f }} />
            ))}
          </span>
          <span>0 → {legendMax} affected</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-5 animate-pulse"
            style={{ background: "#dc2626" }}
          />
          Critical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-5" style={{ background: "#0f766e" }} />
          Selected
        </span>
        <span className="ml-auto text-slate-body/70">
          {selected ? "Click state again to reset" : "Click a state to filter"}
        </span>
      </div>
    </div>
  );
}
