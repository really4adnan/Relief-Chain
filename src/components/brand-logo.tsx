"use client";

import { useState } from "react";
import { Logo } from "./logo";

/**
 * Official ReliefChain brand lockup (India map + chain + wordmark).
 * Drop the supplied artwork at `public/brand/reliefchain-logo.png`
 * (any width ≥ 480px, transparent or white background). Until then —
 * or if the file fails to load — it falls back to the inline mark so
 * nothing ever renders broken.
 */
export function BrandLogo({
  className = "h-16 w-auto",
  alt = "ReliefChain — Service · Connectivity · Strength",
}: {
  className?: string;
  alt?: string;
}) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span className="flex items-center gap-2 text-slate-ink">
        <span className="grid size-8 place-items-center rounded-full bg-slate-ink text-bone">
          <Logo className="h-4 w-4" />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">
          ReliefChain
        </span>
      </span>
    );
  }

  return (
    <img
      src="/brand/reliefchain-logo.png"
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setMissing(true)}
    />
  );
}
