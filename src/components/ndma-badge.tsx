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
  const tones = {
    L1: dark
      ? "border-white/25 bg-white/10 text-white"
      : "border-teal-brand/30 bg-teal-tint text-teal-brand",
    L2: dark
      ? "border-white/25 bg-white/10 text-white"
      : "border-warn/30 bg-warn-tint text-warn",
    L3: dark
      ? "border-white/40 bg-alert text-white"
      : "border-alert/30 bg-alert-tint text-alert",
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
