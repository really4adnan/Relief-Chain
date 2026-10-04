"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Eye, Lock, X } from "lucide-react";
import { Badge } from "@/components/ui";
import { TenderClaim } from "@/components/tender-claim";
import { inr, type Disaster, type Tender } from "@/lib/data";

function statusTone(status: string) {
  if (status === "Open") return "ok" as const;
  if (status === "Claimed") return "teal" as const;
  if (status === "In Progress") return "warn" as const;
  return "neutral" as const;
}

/**
 * Guest-friendly tender list: every card opens an inline preview modal
 * with full details (budget, skills, scope, disaster context) instead of
 * bouncing unauthenticated users to a login page. Claiming inside the
 * modal stays gated — verification still happens before work moves.
 */
export function TenderList({
  tenders,
  disasters,
}: {
  tenders: Tender[];
  disasters: Disaster[];
}) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const preview = tenders.find((t) => t.id === previewId) ?? null;
  const previewDisaster = preview
    ? disasters.find((x) => x.id === preview.disasterId)
    : null;

  // Modal a11y: lock scroll, focus the close button on open, return
  // focus on close, Escape dismisses.
  useEffect(() => {
    if (!preview) {
      if (wasOpen.current) {
        const el = document.querySelector<HTMLElement>(
          `[data-tender-preview="${previewId ?? ""}"]`,
        );
        el?.focus({ preventScroll: true });
      }
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [preview, previewId]);

  return (
    <>
      <ul className="space-y-4">
        {tenders.map((t, i) => {
          const d = disasters.find((x) => x.id === t.disasterId);
          return (
            <li
              key={t.id}
              className="card-hover rise border border-line bg-surface p-5"
              style={{ animationDelay: `${Math.min(i, 5) * 70}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-teal-brand">
                  {t.ref}
                </span>
                <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                <span className="font-mono text-xs text-slate-body">
                  closes {new Date(t.closesAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </span>
              </div>
              <h2 className="mt-2 text-base font-semibold text-slate-ink">
                {t.title}
              </h2>
              <p className="mt-1 text-sm text-slate-body">
                {t.region}
                {d ? ` · ${d.title}` : ""}
              </p>
              {t.claimedByName && (
                <p className="mt-1 font-mono text-xs text-teal-brand">
                  claimed by {t.claimedByName}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {t.skills.map((s) => (
                  <span
                    key={s}
                    className="border border-line bg-canvas px-2 py-0.5 font-ui text-[11px] uppercase text-slate-body"
                  >
                    {s}
                  </span>
                ))}
                <span className="ml-auto font-mono text-base font-semibold text-slate-ink">
                  {inr(t.budget)}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  data-tender-preview={t.id}
                  onClick={() => setPreviewId(t.id)}
                  aria-haspopup="dialog"
                  className="pressable inline-flex h-12 min-h-[48px] items-center gap-1.5 rounded-full border border-line-strong bg-surface px-5 font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-ink hover:border-slate-ink active:scale-[0.98]"
                >
                  <Eye size={14} aria-hidden="true" />
                  Preview details
                </button>
                {t.status === "Open" ? (
                  <span className="inline-flex items-center gap-1.5 px-2 font-ui text-[10px] uppercase tracking-widest text-slate-body">
                    <Lock size={11} aria-hidden="true" />
                    Claiming needs sign-in
                  </span>
                ) : (
                  <Link
                    href="/live"
                    className="link-sweep self-center text-sm font-semibold text-teal-brand"
                  >
                    Track progress on the live map →
                  </Link>
                )}
              </div>
            </li>
          );
        })}
        {tenders.length === 0 && (
          <li className="border border-dashed border-line bg-surface p-8 text-center text-sm">
            No tenders match this filter.
          </li>
        )}
      </ul>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Tender preview: ${preview.title}`}
          className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/50 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-surface shadow-[24px_0_60px_rgba(27,11,7,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-teal-brand">
                    {preview.ref}
                  </span>
                  <Badge tone={statusTone(preview.status)}>{preview.status}</Badge>
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-slate-ink sm:text-2xl">
                  {preview.title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setPreviewId(null)}
                aria-label="Close tender preview"
                className="ml-auto grid size-12 min-h-[48px] min-w-[48px] shrink-0 place-items-center rounded-full border border-line-strong text-slate-ink transition-colors hover:bg-canvas"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
              <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
                <div className="bg-surface px-4 py-3">
                  <p className="font-mono text-lg font-semibold text-slate-ink">
                    {inr(preview.budget)}
                  </p>
                  <p className="font-ui text-[10px] uppercase tracking-widest text-slate-body">
                    Escrowed budget
                  </p>
                </div>
                <div className="bg-surface px-4 py-3">
                  <p className="font-mono text-lg font-semibold text-slate-ink">
                    {new Date(preview.closesAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </p>
                  <p className="font-ui text-[10px] uppercase tracking-widest text-slate-body">
                    Closes
                  </p>
                </div>
                <div className="bg-surface px-4 py-3">
                  <p className="font-mono text-lg font-semibold text-slate-ink">
                    {preview.region.split(",")[0]}
                  </p>
                  <p className="font-ui text-[10px] uppercase tracking-widest text-slate-body">
                    District
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-body">
                  Scope
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-ink">
                  {preview.region}
                  {previewDisaster ? ` · posted against “${previewDisaster.title}” (${previewDisaster.affected.toLocaleString("en-IN")} affected).` : "."}{" "}
                  Funds release only against proven milestones; withdrawals
                  above ₹5L need dual approval.
                </p>
              </div>

              <div>
                <h3 className="font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-body">
                  Skills needed
                </h3>
                <p className="mt-2 flex flex-wrap gap-2">
                  {preview.skills.map((s) => (
                    <span
                      key={s}
                      className="border border-line bg-canvas px-2 py-0.5 font-ui text-[11px] uppercase text-slate-body"
                    >
                      {s}
                    </span>
                  ))}
                </p>
              </div>

              {preview.claimedByName ? (
                <p className="rounded-xl bg-canvas px-4 py-3 font-mono text-xs text-slate-body">
                  Claimed by {preview.claimedByName} — track delivery on the{" "}
                  <Link href="/live" className="font-semibold text-teal-brand underline">
                    live map
                  </Link>
                  .
                </p>
              ) : (
                <div className="rounded-2xl border border-line bg-canvas p-4">
                  <h3 className="font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-ink">
                    Claim this tender
                  </h3>
                  <div className="mt-2">
                    <TenderClaim tenderId={preview.id} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
