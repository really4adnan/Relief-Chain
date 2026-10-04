import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Badge, SectionHead } from "@/components/ui";
import { TenderClaim } from "@/components/tender-claim";
import { inr } from "@/lib/data";
import { getAllDisasters, getAllTenders } from "@/lib/repo";

export const metadata: Metadata = {
  title: "Relief tenders",
  description:
    "Open relief tenders for disaster response — food, shelter, rescue and logistics jobs posted by verified agencies.",
};

const statuses = ["All", "Open", "Claimed", "In Progress", "Completed"] as const;

function statusTone(status: string) {
  if (status === "Open") return "ok" as const;
  if (status === "Claimed") return "teal" as const;
  if (status === "In Progress") return "warn" as const;
  return "neutral" as const;
}

export default async function TendersPage({
  searchParams,
}: PageProps<"/tenders">) {
  const { disaster, status } = await searchParams;
  const disasterId = typeof disaster === "string" ? disaster : null;
  const statusFilter =
    typeof status === "string" &&
    (statuses as readonly string[]).includes(status)
      ? status
      : "All";
  const [tenders, disasters] = await Promise.all([
    getAllTenders(),
    getAllDisasters(),
  ]);

  const list = tenders.filter((t) => {
    if (disasterId && t.disasterId !== disasterId) return false;
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    return true;
  });

  const currentDisaster = disasters.find((d) => d.id === disasterId);
  const totalBudget = list.reduce((s, t) => s + t.budget, 0);

  const qs = (s: string) =>
    `/tenders?${new URLSearchParams({
      ...(disasterId ? { disaster: disasterId } : {}),
      ...(s !== "All" ? { status: s } : {}),
    }).toString()}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHead
        eyebrow="Tenders"
        title="Relief tenders"
        desc="Anyone can browse open relief jobs. Claiming one needs sign-in + verification — budgets are escrowed and released against milestone proof, and every claim is public."
      />

      <p className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-ink/20 bg-slate-ink px-4 py-3 text-sm text-white">
        <Lock size={14} className="shrink-0 text-warn" />
        Browsing is open to all. To claim a tender,{" "}
        <Link href="/login?next=%2Ftenders" className="font-semibold underline underline-offset-4">
          sign in
        </Link>{" "}
        or{" "}
        <Link href="/register" className="font-semibold underline underline-offset-4">
          register your organisation
        </Link>
        .
      </p>

      {currentDisaster && (
        <div className="rise mb-6 border border-teal-brand/30 bg-teal-tint px-4 py-3 text-sm">
          Filtering for{" "}
          <span className="font-semibold text-slate-ink">
            {currentDisaster.title}
          </span>{" "}
          ·{" "}
          <Link href="/tenders" className="font-semibold text-teal-brand underline">
            clear filter
          </Link>
        </div>
      )}

      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filter by status">
        {statuses.map((s) => (
          <Link
            key={s}
            href={qs(s)}
            className={`border px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s
                ? "border-teal-brand bg-teal-brand text-white"
                : "border-line bg-surface text-slate-body hover:text-slate-ink"
            }`}
          >
            {s}
          </Link>
        ))}
      </nav>

      <div className="mb-6 grid gap-px border border-line bg-line sm:grid-cols-3">
        <div className="bg-surface px-4 py-3">
          <p className="font-mono text-xl font-semibold text-slate-ink">
            {list.filter((t) => t.status === "Open").length}
          </p>
          <p className="text-xs">Open tenders</p>
        </div>
        <div className="bg-surface px-4 py-3">
          <p className="font-mono text-xl font-semibold text-slate-ink">
            {inr(totalBudget)}
          </p>
          <p className="text-xs">Total budget listed</p>
        </div>
        <div className="bg-surface px-4 py-3">
          <p className="font-mono text-xl font-semibold text-slate-ink">0%</p>
          <p className="text-xs">Platform commission</p>
        </div>
      </div>

      <ul className="space-y-4">
        {list.map((t, i) => {
          const d = disasters.find((x) => x.id === t.disasterId);
          return (
            <li
              key={t.id}
              className={`card-hover rise border border-line bg-surface p-5 rise-${Math.min((i % 6) + 1, 6)}`}
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
              <div className="mt-3">
                {t.status === "Open" ? (
                  <TenderClaim tenderId={t.id} />
                ) : (
                  <Link
                    href="/live"
                    className="link-sweep text-sm font-semibold text-teal-brand"
                  >
                    Track progress on the live map →
                  </Link>
                )}
              </div>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="border border-dashed border-line bg-surface p-8 text-center text-sm">
            No tenders match this filter.
          </li>
        )}
      </ul>
    </div>
  );
}
