import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/** Mono uppercase kicker with the ember pulse dot — above every heading. */
export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest text-slate-body ${className}`}
    >
      <span className="inline-block size-1.5 rounded-full bg-teal-brand" />
      {children}
    </p>
  );
}

/**
 * Blueprint backdrop: hairline grid with dots at every interior
 * intersection. Absolutely positioned, pointer-events-none.
 */
export function GridBackdrop({
  cols = 6,
  rows = 3,
  className = "",
}: {
  cols?: number;
  rows?: number;
  className?: string;
}) {
  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push(
        <div key={`${r}-${c}`} className="relative border-r border-b border-line">
          {r > 0 && c > 0 && (
            <span className="absolute -left-[4px] -top-[4px] size-2 rounded-full border border-line bg-surface" />
          )}
        </div>,
      );
    }
  }
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 grid ${className}`}
      style={
        {
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        } as CSSProperties
      }
    >
      {cells}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8">
      <Kicker>{eyebrow}</Kicker>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="max-w-2xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-slate-ink sm:text-4xl">
          {title}
        </h2>
        {action && (
          <Link
            href={action.href}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-4 py-2 font-ui text-[11px] uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5 hover:border-teal-brand hover:text-teal-brand"
          >
            {action.label}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        )}
      </div>
      {desc && <p className="mt-3 max-w-2xl text-[15px] leading-7">{desc}</p>}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "alert" | "teal";
}) {
  const tones = {
    neutral: "bg-canvas text-slate-body border-line-strong",
    ok: "bg-ok-tint text-ok border-ok/30",
    warn: "bg-warn-tint text-warn border-warn/30",
    alert: "bg-alert-tint text-alert border-alert/30",
    teal: "bg-teal-tint text-teal-brand border-teal-brand/25",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-widest ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PrimaryCTA({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-full bg-teal-brand px-7 font-ui text-xs font-semibold uppercase tracking-widest text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:bg-teal-brand-hover active:translate-y-0 active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

/** Bordered, transparent CTA — the counterpart to PrimaryCTA. */
export function SecondaryCTA({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-full border border-line-strong bg-surface px-7 font-ui text-xs font-semibold uppercase tracking-widest text-slate-ink shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-slate-ink active:translate-y-0 active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

/** Human maintainer notice — sits near auth + payment + registration forms. */
export function LowBandwidthNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`mt-5 flex items-start gap-2 border-t border-line pt-4 text-xs leading-5 text-slate-body ${className}`}
    >
      <span aria-hidden="true" className="mt-0.5 inline-block size-1.5 shrink-0 rounded-full bg-teal-brand" />
      Note: built for low-bandwidth mobile networks during emergency power
      outages — every page stays usable on 2G.
    </p>
  );
}

export function StatBlock({  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-l border-line-strong px-4 py-3">
      <p className="font-mono text-2xl font-medium tracking-tight text-slate-ink">
        {value}
      </p>
      <p className="mt-1 font-ui text-[10px] uppercase leading-4 tracking-widest text-slate-body">
        {label}
      </p>
    </div>
  );
}
