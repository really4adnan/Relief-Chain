import Link from "next/link";
import type { ReactNode } from "react";
import { GridBackdrop, Kicker } from "@/components/ui";

export const authField =
  "h-11 w-full border border-line-strong bg-surface px-3 font-mono text-sm text-slate-ink placeholder:font-sans placeholder:text-slate-body/60 focus:border-slate-ink focus:outline-none";

export const authLabel =
  "mb-1.5 block font-ui text-[10px] uppercase tracking-widest text-slate-body";

/**
 * Two-panel auth frame: brand/value panel on the left, form on the right.
 * Shared by /login and /signup so the entry flow reads as one screen.
 */
export function AuthShell({
  eyebrow,
  title,
  desc,
  points,
  alt,
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  points: string[];
  alt: { href: string; label: string; text: string };
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="relative">
        <div className="relative overflow-hidden border border-line bg-surface">
          <GridBackdrop cols={4} rows={4} />

          <div className="relative z-10 grid md:grid-cols-2">
            {/* Value panel */}
            <div className="border-b border-line p-6 sm:p-8 md:border-b-0 md:border-r">
              <Kicker>{eyebrow}</Kicker>
              <h1 className="mt-3 font-display text-3xl leading-[1.1] tracking-tight text-slate-ink sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6">{desc}</p>

              <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                {points.map((p) => (
                  <li
                    key={p}
                    className="flex gap-2 font-ui text-[11px] uppercase tracking-widest text-slate-body"
                  >
                    <span className="text-slate-ink">—</span>
                    {p}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-slate-body">
                {alt.text}{" "}
                <Link
                  href={alt.href}
                  className="font-ui text-[11px] uppercase tracking-widest text-teal-brand underline underline-offset-4 hover:text-teal-brand-hover"
                >
                  {alt.label} →
                </Link>
              </p>
            </div>

            {/* Form panel */}
            <div className="p-6 sm:p-8">{children}</div>
          </div>
        </div>
      </div>

      <p className="mt-4 font-ui text-[10px] uppercase tracking-widest text-slate-body/80">
        Services available in India only · +91 numbers · amounts in INR · times in
        IST
      </p>
    </div>
  );
}
