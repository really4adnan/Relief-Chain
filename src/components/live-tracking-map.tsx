"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Kicker } from "@/components/ui";
import { IndiaMap } from "@/components/india-map";
import type { Disaster, Tender } from "@/lib/data";
import type { LiveEvent } from "@/lib/eonet";
import { rollupByState, stateIdFromName, stateNameFromId } from "@/lib/india";

/**
 * Live disaster tracking: choropleth of affected people by state, critical
 * pulse, per-state drill-down into register disasters, open tenders and the
 * NASA EONET satellite feed — all updating from the same selection.
 */
export function LiveTrackingMap({
  disasters,
  liveEvents,
  tenders,
  updatedAt,
}: {
  disasters: Disaster[];
  liveEvents: LiveEvent[];
  tenders: Tender[];
  updatedAt: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const current = useMemo(
    () => disasters.filter((d) => d.status !== "resolved"),
    [disasters]
  );
  const rollup = useMemo(() => rollupByState(current), [current]);
  const stateName = selected ? stateNameFromId(selected) : null;

  const stateDisasters = useMemo(
    () =>
      selected
        ? current.filter((d) => stateIdFromName(d.state) === selected)
        : current,
    [current, selected]
  );

  const stateTenders = useMemo(
    () =>
      selected && stateName
        ? tenders.filter(
            (t) =>
              t.region.includes(stateName) ||
              current.some(
                (d) =>
                  d.id === t.disasterId && stateIdFromName(d.state) === selected
              )
          )
        : tenders,
    [tenders, selected, stateName, current]
  );

  const criticalIds = useMemo(() => {
    const set = new Set<string>();
    for (const d of current) {
      const id = stateIdFromName(d.state);
      if (id && d.severity === "critical") set.add(id);
    }
    return [...set];
  }, [current]);

  const detail: Record<string, string> = {};
  for (const d of current) {
    const id = stateIdFromName(d.state);
    if (id && !detail[id]) detail[id] = `${d.type} · ${d.region}`;
  }

  function refresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1200);
  }

  return (
    <div>
      {/* Status strip */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border border-line bg-surface px-4 py-3">
        <span className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest text-alert">
          <span className="live-dot inline-block size-2 rounded-full bg-alert" />
          Live tracking
        </span>
        <span className="font-mono text-[11px] text-slate-body">
          {current.length} current emergencies · {liveEvents.length} satellite events
        </span>
        <span className="ml-auto flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-body">
            updated{" "}
            {new Date(updatedAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            IST
          </span>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="border border-line-strong px-3 py-1.5 font-ui text-[10px] uppercase tracking-widest text-slate-ink transition-colors hover:bg-canvas disabled:opacity-60"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Map */}
        <section className="card-hover border border-line bg-surface p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <Kicker>{selected ? "State view" : "All India"}</Kicker>
              <h2 className="mt-1 font-display text-xl leading-tight tracking-tight text-slate-ink">
                {stateName ?? "India"} — {stateDisasters.length} current
              </h2>
            </div>
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="border border-line-strong px-2 py-1 font-ui text-[10px] uppercase tracking-widest text-slate-body hover:bg-canvas hover:text-slate-ink"
              >
                Reset
              </button>
            )}
          </div>
          <IndiaMap
            metrics={rollup.metrics}
            critical={criticalIds}
            detail={detail}
            selected={selected}
            onSelect={setSelected}
            className="mt-2"
          />
          <div className="mt-3 grid grid-cols-3 gap-px border border-line bg-line">
            {[
              { v: String(stateDisasters.length), l: "Emergencies" },
              {
                v: String(
                  stateDisasters.filter((d) => d.status === "active").length
                ),
                l: "Active",
              },
              {
                v: String(
                  stateTenders.filter((t) => t.status === "Open").length
                ),
                l: "Open tenders",
              },
            ].map((s) => (
              <div key={s.l} className="bg-canvas px-2 py-2 text-center">
                <p className="font-mono text-base font-medium text-slate-ink">
                  {s.v}
                </p>
                <p className="font-ui text-[9px] uppercase tracking-widest text-slate-body">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Current disasters in scope */}
        <section>
          <div className="mb-3 flex items-end justify-between border-b border-line pb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-ink">
              {stateName ? `Now in ${stateName}` : "Every current disaster"}
            </h2>
            <span className="font-ui text-[10px] uppercase tracking-widest text-slate-body">
              {stateDisasters.length} shown
            </span>
          </div>
          {stateDisasters.length === 0 ? (
            <div className="border border-dashed border-line-strong bg-surface px-4 py-8 text-center">
              <p className="font-ui text-[11px] uppercase tracking-widest text-slate-body">
                No current emergencies{stateName ? ` in ${stateName}` : ""}
              </p>
              <p className="mt-2 text-xs">Everything is calm here right now.</p>
            </div>
          ) : (
            <ul className="nice-scroll max-h-[560px] space-y-3 overflow-y-auto pr-1">
              {stateDisasters.map((d, i) => (
                <li
                  key={d.id}
                  className={`card-hover rise border border-line bg-surface p-4 rise-${Math.min((i % 6) + 1, 6)}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      tone={
                        d.severity === "critical"
                          ? "alert"
                          : d.severity === "high"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {d.severity}
                    </Badge>
                    <Badge
                      tone={
                        d.status === "active"
                          ? "alert"
                          : d.status === "contained"
                            ? "warn"
                            : "ok"
                      }
                    >
                      {d.status}
                    </Badge>
                    <span className="font-mono text-xs text-slate-body">
                      {d.type} · {d.region}, {d.state}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-ink">
                    {d.title}
                  </p>
                  <p className="mt-1 text-xs leading-5">{d.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-2 text-xs">
                    <span className="font-mono font-semibold text-slate-ink">
                      {d.affected.toLocaleString("en-IN")} affected
                    </span>
                    <Link
                      href={`/tenders?disaster=${d.id}`}
                      className="link-sweep ml-auto font-semibold text-teal-brand"
                    >
                      Relief tenders →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Satellite feed scoped to selection note */}
      {liveEvents.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-ink">
              Satellite event feed
            </h2>
            <span className="font-ui text-[10px] uppercase tracking-widest text-slate-body">
              NASA EONET · India & neighbourhood · hourly
            </span>
          </div>
          <ul className="divide-y divide-line border border-line bg-surface">
            {liveEvents.slice(0, 8).map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3"
              >
                <Badge tone="neutral">{e.category}</Badge>
                <span className="min-w-0 flex-1 text-sm font-medium text-slate-ink">
                  {e.title}
                </span>
                <span className="font-mono text-xs text-slate-body">
                  {new Date(e.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <Badge tone={e.status === "active" ? "alert" : "neutral"}>
                  {e.status}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
