import { NDMA_LEVELS, ndmaLevelFor } from "@/lib/ndma";
import type { Disaster } from "@/lib/data";

/**
 * NDMA escalation badge — L1 District (DDMA) · L2 State (SDRF) ·
 * L3 National (NDRF). Server-safe: no hooks, renders inline anywhere
 * including the alert ticker and disaster cards.
 */
export function NdmaLevelBadge({
  severity,
  affected,
  dark = false,
}: {
  severity: Disaster["severity"];
  affected: number;
  dark?: boolean;
}) {
  const level = ndmaLevelFor({ severity, affected });
  const meta = NDMA_LEVELS[level];
  // Exact spec tones: L1 amber #FEF3C7/#92400E · L2 orange #FFEDD5/#9A3412
  // · L3 red #FEE2E2/#991B1B. Dark panels keep a translucent treatment.
  const tones = {
    L1: dark
      ? "border-white/25 bg-white/10 text-white"
      : "border-[#92400e]/30 bg-l1-bg text-l1-text",
    L2: dark
      ? "border-white/25 bg-white/10 text-white"
      : "border-[#9a3412]/30 bg-l2-bg text-l2-text",
    L3: dark
      ? "border-white/40 bg-alert text-white"
      : "border-[#991b1b]/30 bg-l3-bg text-l3-text",
  } as const;

  return (
    <span
      title={`${meta.code} · ${meta.scope} response — ${meta.detail}`}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide ${tones[level]}`}
    >
      {meta.code} · {meta.responder}
    </span>
  );
}
