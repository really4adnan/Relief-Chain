import type { Metadata } from "next";
import Link from "next/link";
import { AlertTicker } from "@/components/alert-ticker";
import { DisasterArt } from "@/components/disaster-art";
import { Badge, SectionHead } from "@/components/ui";
import { getAllDisasters } from "@/lib/repo";
import { getIndiaRegionEvents, type LiveEvent } from "@/lib/eonet";
import type { DisasterStatus } from "@/lib/data";

export const metadata: Metadata = {
  title: "Live disasters",
  description:
    "Real-time list of natural disasters in India with severity, affected population, relief tenders — plus a live satellite event feed from NASA EONET.",
};

const filters: { key: "all" | DisasterStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "contained", label: "Contained" },
  { key: "resolved", label: "Resolved" },
];

function severityTone(sev: string) {
  if (sev === "critical") return "alert" as const;
  if (sev === "high") return "warn" as const;
  return "neutral" as const;
}

function statusTone(status: DisasterStatus) {
  if (status === "active") return "alert" as const;
  if (status === "contained") return "warn" as const;
  return "ok" as const;
}

function categoryTone(category: string) {
  const c = category.toLowerCase();
  if (c.includes("flood") || c.includes("earthquake") || c.includes("volcano"))
    return "alert" as const;
  if (c.includes("storm") || c.includes("wildfire") || c.includes("landslide"))
    return "warn" as const;
  return "neutral" as const;
}

function LiveFeed({ events }: { events: LiveEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="border border-dashed border-line bg-surface p-6 text-center text-sm text-slate-body">
        Live satellite feed unavailable right now — the register below still
        shows agency-reported events.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line border border-line bg-surface">
      {events.map((e) => (
        <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
          <Badge tone={categoryTone(e.category)}>{e.category}</Badge>
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
          {typeof e.lat === "number" && typeof e.lon === "number" && (
            <span className="hidden font-mono text-xs text-slate-body sm:inline">
              {e.lat.toFixed(2)}°N, {e.lon.toFixed(2)}°E
            </span>
          )}
          <Badge tone={e.status === "active" ? "alert" : "neutral"}>{e.status}</Badge>
          {e.sourceUrl ? (
            <a
              href={e.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-teal-brand hover:underline"
            >
              source ↗
            </a>
          ) : (
            <span className="text-xs text-slate-body">NASA EONET</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function DisastersPage({
  searchParams,
}: PageProps<"/disasters">) {
  const { status } = await searchParams;
  const active = filters.some((f) => f.key === status)
    ? (status as string)
    : "all";

  const [allDisasters, liveEvents] = await Promise.all([
    getAllDisasters(),
    getIndiaRegionEvents(12),
  ]);

  const list =
    active === "all"
      ? allDisasters
      : allDisasters.filter((d) => d.status === active);

  return (
    <>
      <AlertTicker />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SectionHead
          eyebrow="Live feed"
          title="Disaster register"
          desc="Every entry is logged by an authorised reporter. Dispatch begins the moment severity is set to high or critical."
        />

        {/* Live regional satellite/event feed — NASA EONET */}
        <section id="live-feed" className="mb-8">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-2">
            <div>
              <h2 className="text-base font-semibold text-slate-ink">
                Live regional event feed
              </h2>
              <p className="text-xs text-slate-body">
                India &amp; neighbourhood (68–98°E, 6–37°N) · floods, cyclones,
                earthquakes, wildfires · auto-refreshed hourly
              </p>
            </div>
            <span className="font-ui text-[11px] uppercase tracking-wide text-slate-body">
              source: NASA EONET
            </span>
          </div>
          <LiveFeed events={liveEvents} />
        </section>

        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Filter by status">
          {filters.map((f) => (
            <Link
              key={f.key}
              href={f.key === "all" ? "/disasters" : `/disasters?status=${f.key}`}
              className={`border px-3 py-1.5 text-sm font-medium transition-colors ${
                active === f.key
                  ? "border-teal-brand bg-teal-brand text-white"
                  : "border-line bg-surface text-slate-body hover:text-slate-ink"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>

        <ul className="space-y-4">
          {list.map((d) => (
            <li
              key={d.id}
              className="overflow-hidden border border-line bg-surface transition-colors hover:border-teal-brand/40"
            >
              <div
                className="relative flex h-36 items-end justify-between gap-2 overflow-hidden p-4"
                style={{
                  background:
                    d.type === "Flood"
                      ? "linear-gradient(135deg,#0c4a6e,#0e7490)"
                      : d.type === "Earthquake"
                        ? "linear-gradient(135deg,#451a03,#b45309)"
                        : d.type === "Cyclone"
                          ? "linear-gradient(135deg,#1e3a5f,#0ea5e9)"
                          : d.type === "Wildfire"
                            ? "linear-gradient(135deg,#431407,#ea580c)"
                            : d.type === "Landslide"
                              ? "linear-gradient(135deg,#292524,#857262)"
                              : "linear-gradient(135deg,#5c1a02,#f59e0b)",
                }}
              >
                <DisasterArt
                  type={d.type}
                  className="absolute inset-0 h-full w-full"
                />
                <span className="relative flex flex-wrap items-center gap-2">
                  <Badge tone={severityTone(d.severity)}>{d.severity}</Badge>
                  <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                </span>
                <span className="relative rounded-full bg-black/35 px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                  {d.type}
                </span>
              </div>
              <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-slate-body">
                  {d.type} · reported{" "}
                  {new Date(d.reportedAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-ink">
                {d.title}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6">{d.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-3 text-sm">
                <span>
                  <span className="font-mono font-semibold text-slate-ink">
                    {d.affected.toLocaleString("en-IN")}
                  </span>{" "}
                  people affected
                </span>
                <span className="text-slate-body">
                  {d.region}, {d.state}
                </span>
                <Link
                  href={`/tenders?disaster=${d.id}`}
                  className="ml-auto font-semibold text-teal-brand hover:underline"
                >
                  Relief tenders for this event →
                </Link>
              </div>
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="border border-dashed border-line bg-surface p-8 text-center text-sm">
              No disasters match this filter.
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
