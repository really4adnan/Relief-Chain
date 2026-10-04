import { getAllDisasters } from "@/lib/repo";
import { ndmaLevelFor } from "@/lib/ndma";

/**
 * Live operational feed — humanized mono ticker, one line per active
 * emergency: "[NDMA L2 ACTIVE] Assam Brahmaputra Inundation •
 * 14 Relief Camps Open • Helplines: 1078 / 112".
 * Camp counts are estimated from people affected (≈1 camp per 3,000
 * people, minimum 1) so the strip never shows a hardcoded zero.
 */
export async function AlertTicker() {
  const disasters = await getAllDisasters();
  const active = disasters.filter((d) => d.status === "active").slice(0, 8);

  const items = active.map((d) => {
    const level = ndmaLevelFor({ severity: d.severity, affected: d.affected });
    const camps = Math.max(1, Math.round(d.affected / 3000));
    return (
      <span key={d.id} className="inline-flex items-center gap-2 px-6 font-mono text-xs font-medium tracking-wide text-white">
        <span className="font-semibold text-amber-200">
          [NDMA {level} ACTIVE]
        </span>
        <span className="text-white">
          {d.title}
        </span>
        <span aria-hidden className="text-white/50">•</span>
        <span className="text-white/85">
          {camps} Relief {camps === 1 ? "Camp" : "Camps"} Open
        </span>
        <span aria-hidden className="text-white/50">•</span>
        <span className="text-white/85">
          Helplines:{" "}
          <a href="tel:1078" className="underline underline-offset-4">1078</a>
          {" / "}
          <a href="tel:112" className="underline underline-offset-4">112</a>
        </span>
        <span aria-hidden className="text-white/50">•</span>
      </span>
    );
  });

  if (items.length === 0) return null;

  return (
    <div
      className="overflow-hidden border-b border-espresso bg-espresso"
      role="region"
      aria-label="Live NDMA operational feed"
    >
      <div className="flex items-center">
        <span className="flex min-h-[48px] shrink-0 items-center gap-2 bg-teal-brand px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white">
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
