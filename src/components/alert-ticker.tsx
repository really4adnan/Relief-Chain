import { getAllDisasters } from "@/lib/repo";
import type { Severity } from "@/lib/data";

const severityStyles: Record<Severity, string> = {
  critical: "bg-alert text-white",
  high: "bg-warn text-white",
  moderate: "bg-slate-ink text-white",
};

export async function AlertTicker() {
  const disasters = await getAllDisasters();
  const active = disasters.filter((d) => d.status === "active").slice(0, 8);
  const items = active.map((d) => (
    <span key={d.id} className="inline-flex items-center gap-2 px-6">
      <span
        className={`px-1.5 py-0.5 font-alert text-[10px] font-black uppercase tracking-wide ${severityStyles[d.severity]}`}
      >
        {d.severity}
      </span>
      <span className="text-sm text-white">
        {d.state}: {d.title} — {d.affected.toLocaleString("en-IN")} affected
      </span>
      <span className="text-white/50">•</span>
    </span>
  ));

  if (items.length === 0) return null;

  return (
    <div
      className="grain overflow-hidden border-b border-espresso bg-espresso"
      role="region"
      aria-label="Active disaster alerts"
    >
      <div className="relative z-[2] flex items-center">
          <span className="flex shrink-0 items-center gap-2 bg-teal-brand px-4 py-2.5 font-alert text-xs font-black uppercase tracking-widest text-white">
          <span className="live-dot inline-block size-1.5 rounded-full bg-white" />
          Live
        </span>
        <div className="relative flex-1 overflow-hidden py-2.5">
          <div className="ticker-track flex w-max whitespace-nowrap">
            {items}
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}
