import { getAllDisasters } from "@/lib/repo";
import { ndmaLevelFor } from "@/lib/ndma";
import { AlertCarousel, type AlertItem } from "@/components/alert-carousel";

/**
 * Live operational feed — server fetches the active register, the
 * interactive carousel (pause, prev/next, per-state filters) renders
 * it with solid severity fills. Camp counts are estimated from people
 * affected (≈1 camp per 3,000, minimum 1) — never hardcoded zeros.
 */
export async function AlertTicker() {
  const disasters = await getAllDisasters();
  const active = disasters.filter((d) => d.status === "active").slice(0, 8);

  const items: AlertItem[] = active.map((d) => ({
    id: d.id,
    level: ndmaLevelFor({ severity: d.severity, affected: d.affected }),
    severity: d.severity,
    state: d.state,
    title: d.title,
    camps: Math.max(1, Math.round(d.affected / 3000)),
    affected: d.affected.toLocaleString("en-IN"),
  }));

  if (items.length === 0) return null;
  return <AlertCarousel items={items} />;
}
