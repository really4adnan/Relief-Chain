"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Kicker } from "@/components/ui";
import { IndiaMap } from "@/components/india-map";
import { inr, organisations, stats, tenders, type Disaster, type LedgerRow } from "@/lib/data";
import { rollupByState, stateIdFromName, stateNameFromId } from "@/lib/india";

function Cell({
  value,
  label,
  tone = "ink",
}: {
  value: string;
  label: string;
  tone?: "ink" | "ok";
}) {
  return (
    <div className="bg-surface px-4 py-4">
      <p
        className={`font-mono text-2xl font-medium tracking-tight ${
          tone === "ok" ? "text-ok" : "text-slate-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 font-ui text-[10px] uppercase tracking-widest text-slate-body">
        {label}
      </p>
    </div>
  );
}

export function DashboardView({
  disasters,
  ledger,
}: {
  disasters: Disaster[];
  ledger: LedgerRow[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const active = useMemo(() => disasters.filter((d) => d.status === "active"), [disasters]);
  const rollup = useMemo(() => rollupByState(active), [active]);
  const stateName = selected ? stateNameFromId(selected) : null;

  const queue = useMemo(
    () => (selected ? active.filter((d) => stateIdFromName(d.state) === selected) : active),
    [active, selected],
  );

  const rows = useMemo(
    () =>
      selected
        ? ledger.filter((r) => r.state && stateIdFromName(r.state) === selected)
        : ledger,
    [ledger, selected],
  );

  const stateTenders = useMemo(
    () =>
      selected && stateName
        ? tenders.filter((t) => t.region.includes(stateName))
        : tenders,
    [selected, stateName],
  );

  const stateOrgs = useMemo(
    () =>
      selected && stateName
        ? organisations.filter((o) => o.region === stateName || o.region === "Nationwide")
        : organisations,
    [selected, stateName],
  );

  const affected = selected
    ? (rollup.metrics[selected] ?? 0)
    : active.reduce((sum, d) => sum + d.affected, 0);

  const criticalIds = useMemo(() => {
    const set = new Set<string>();
    for (const d of active) {
      const id = stateIdFromName(d.state);
      if (id && d.severity === "critical") set.add(id);
    }
    return [...set];
  }, [active]);

  const detail: Record<string, string> = {};
  for (const d of active) {
    const id = stateIdFromName(d.state);
    if (id && !detail[id]) detail[id] = `${d.type} · ${d.region}`;
  }

  return (
    <>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-4">
        <Cell value={`${stats.avgDispatchTimeSec}s`} label="Avg dispatch time" />
        <Cell value={String(selected ? queue.length : active.length)} label={selected ? "Alerts in state" : "Active alerts"} />
        <Cell value={affected.toLocaleString("en-IN")} label={selected ? "Affected (state)" : "Affected (all India)"} />
        <Cell value="98.4%" label="Milestones on time" tone="ok" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)_minmax(0,1fr)]">
        {/* Dispatch queue */}
        <section className="order-2 lg:order-1">
          <div className="mb-3 flex items-end justify-between border-b border-line pb-2">
            <div>
              <Kicker>Dispatch queue</Kicker>
              <h2 className="mt-1 text-sm font-semibold uppercase tracking-wide text-slate-ink">
                {stateName ?? "All India"}
              </h2>
            </div>
            <Link
              href="/tenders"
              className="font-ui text-[10px] uppercase tracking-widest text-slate-ink hover:text-teal-brand"
            >
              Tenders →
            </Link>
          </div>

          {queue.length === 0 ? (
            <div className="border border-dashed border-line-strong bg-surface px-4 py-8 text-center">
              <p className="font-ui text-[11px] uppercase tracking-widest text-slate-body">
                No active alerts in {stateName}
              </p>
              <p className="mt-2 text-xs">Everything is calm here right now.</p>
            </div>
          ) : (
            <ul className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {queue.map((d) => (
                <li key={d.id} className="border border-line bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <Badge tone={d.severity === "critical" ? "alert" : "warn"}>
                      {d.severity}
                    </Badge>
                    <span className="font-mono text-xs text-slate-body">
                      {d.region}, {d.state}
                    </span>
                    <Link
                      href={`/tenders?disaster=${d.id}`}
                      className="ml-auto font-ui text-[10px] uppercase tracking-widest text-teal-brand hover:underline"
                    >
                      Tenders →
                    </Link>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-ink">{d.title}</p>
                  <p className="mt-1 text-xs leading-5">{d.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Map — the centre of the operations view */}
        <section className="order-1 lg:order-2">
          <div className="border border-line bg-surface p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <Kicker>{selected ? "State view" : "Live choropleth"}</Kicker>
                <h2 className="mt-1 font-display text-lg leading-tight tracking-tight text-slate-ink">
                  {stateName ?? "India"}
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
              <div className="bg-canvas px-2 py-2 text-center">
                <p className="font-mono text-base font-medium text-slate-ink">
                  {selected ? queue.length : active.length}
                </p>
                <p className="font-ui text-[9px] uppercase tracking-widest text-slate-body">
                  Alerts
                </p>
              </div>
              <div className="bg-canvas px-2 py-2 text-center">
                <p className="font-mono text-base font-medium text-slate-ink">
                  {stateOrgs.length}
                </p>
                <p className="font-ui text-[9px] uppercase tracking-widest text-slate-body">
                  Orgs
                </p>
              </div>
              <div className="bg-canvas px-2 py-2 text-center">
                <p className="font-mono text-base font-medium text-slate-ink">
                  {stateTenders.filter((t) => t.status === "Open").length}
                </p>
                <p className="font-ui text-[9px] uppercase tracking-widest text-slate-body">
                  Open tenders
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Funds ledger */}
        <section className="order-3">
          <div className="mb-3 flex items-end justify-between border-b border-line pb-2">
            <div>
              <Kicker>Funds ledger</Kicker>
              <h2 className="mt-1 text-sm font-semibold uppercase tracking-wide text-slate-ink">
                {stateName ?? "All India"}
              </h2>
            </div>
            <span className="font-ui text-[10px] uppercase tracking-widest text-slate-body">
              IST
            </span>
          </div>

          <div className="overflow-x-auto border border-line bg-surface">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="bg-canvas">
                <tr className="border-b border-line font-ui text-[10px] uppercase tracking-widest text-slate-body">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Note</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center font-ui text-[11px] uppercase tracking-widest text-slate-body">
                      No transactions for {stateName}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.ref} className="border-b border-line last:border-0">
                      <td className="px-3 py-2.5 font-mono text-xs">{row.date}</td>
                      <td className="px-3 py-2.5">
                        <p className="text-slate-ink">{row.note}</p>
                        <p className="font-mono text-[11px] text-slate-body">{row.ref}</p>
                      </td>
                      <td
                        className={`px-3 py-2.5 text-right font-mono ${
                          row.kind === "in" ? "text-ok" : "text-slate-ink"
                        }`}
                      >
                        {row.kind === "in" ? "+" : "−"}
                        {inr(Math.abs(row.amount))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-body">
            Withdrawals above ₹5L need dual approval. Everything is written in IST
            and exportable as CSV for audits.
          </p>
        </section>
      </div>
    </>
  );
}
