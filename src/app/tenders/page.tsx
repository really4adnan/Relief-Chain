import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Lock } from "lucide-react";
import { SectionHead } from "@/components/ui";
import { TenderList } from "@/components/tender-preview";
import { inr } from "@/lib/data";
import { getAllDisasters, getAllTenders } from "@/lib/repo";

export const metadata: Metadata = {
  title: "Relief tenders",
  description:
    "Open relief tenders for disaster response — food, shelter, rescue and logistics jobs posted by verified agencies.",
};

const statuses = ["All", "Open", "Claimed", "In Progress", "Completed"] as const;

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
        <Eye size={14} className="shrink-0 text-emerald-300" aria-hidden="true" />
        Browsing is open to all — tap <strong>Preview details</strong> on any
        tender for the full scope, no sign-in needed.{" "}
        <span className="inline-flex items-center gap-1">
          <Lock size={12} className="text-warn" aria-hidden="true" />
          Claiming needs{" "}
          <Link href="/login?next=%2Ftenders" className="font-semibold underline underline-offset-4">
            sign-in
          </Link>
        </span>
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
            aria-pressed={statusFilter === s}
            className={`inline-flex min-h-[48px] items-center rounded-full border px-4 text-sm font-medium transition-all hover:-translate-y-0.5 active:scale-[0.98] ${
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

      <TenderList tenders={list} disasters={disasters} />
    </div>
  );
}
