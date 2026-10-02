import { Badge } from "@/components/ui";
import { DonationActions } from "@/components/funds-actions";
import { CsvExport } from "@/components/csv-export";
import { backendInfo, getAllDonations, getLedgerRows } from "@/lib/repo";
import { getAllDispatch } from "@/lib/repo";
import { getAllDisasters } from "@/lib/repo";
import { inr } from "@/lib/data";

export const dynamic = "force-dynamic";

function statusTone(status: string) {
  if (status === "pledged") return "teal" as const;
  if (status === "captured") return "ok" as const;
  return "neutral" as const;
}

export default async function FundsPage() {
  const donations = await getAllDonations();
  const dispatch = await getAllDispatch();
  const ledger = await getLedgerRows();
  const disasters = await getAllDisasters();
  const info = backendInfo();

  const disasterName = new Map(disasters.map((d) => [d.id, d.title]));
  const total = donations.items.reduce((s, d) => s + d.amount, 0);
  const byDisaster = new Map<string, number>();
  for (const d of donations.items) {
    const key = d.disasterId || "unassigned";
    byDisaster.set(key, (byDisaster.get(key) ?? 0) + d.amount);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <h1 className="text-xl font-semibold text-slate-ink">Funds oversight</h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-body">
            source: {info.label}
          </span>
          <CsvExport
            filename="reliefchain-donations.csv"
            headers={["receipt", "donor", "email", "fund", "status", "amount_inr", "created_at"]}
            rows={donations.items.map((d) => [
              d.receiptId,
              d.name || "—",
              d.email,
              disasterName.get(d.disasterId) ?? d.disasterId ?? "—",
              d.status,
              d.amount,
              d.createdAt,
            ])}
          />
        </div>
      </div>

      <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
        <div className="bg-surface p-4">
          <p className="font-mono text-2xl font-semibold text-slate-ink">
            {inr(total)}
          </p>
          <p className="mt-0.5 text-xs">Total pledged</p>
        </div>
        <div className="bg-surface p-4">
          <p className="font-mono text-2xl font-semibold text-slate-ink">
            {donations.items.length}
          </p>
          <p className="mt-0.5 text-xs">Donation records</p>
        </div>
        <div className="bg-surface p-4">
          <p className="font-mono text-2xl font-semibold text-slate-ink">0%</p>
          <p className="mt-0.5 text-xs">Platform commission</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-ink">
          Pledges by emergency
        </h2>
        <div className="border border-line bg-surface">
          <ul className="divide-y divide-line">
            {[...byDisaster.entries()].map(([id, amount]) => (
              <li key={id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-slate-ink">
                  {disasterName.get(id) ?? (
                    <span className="font-mono text-xs text-slate-body">{id}</span>
                  )}
                </span>
                <span className="font-mono font-semibold text-slate-ink">
                  {inr(amount)}
                </span>
              </li>
            ))}
            {byDisaster.size === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-body">
                No pledges yet.
              </li>
            )}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-ink">
          Donation register
        </h2>
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-canvas">
              <tr className="border-b border-line font-ui text-[11px] uppercase text-slate-body">
                <th className="px-3 py-2 font-medium">Receipt</th>
                <th className="px-3 py-2 font-medium">Donor</th>
                <th className="px-3 py-2 font-medium">Fund</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.items.map((d) => (
                <tr key={d.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 font-mono text-xs">{d.receiptId}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium text-slate-ink">{d.name || "—"}</p>
                    <p className="font-mono text-[11px] text-slate-body">{d.email}</p>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {disasterName.get(d.disasterId) ?? (
                      <span className="font-mono text-[11px]">{d.disasterId || "—"}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                    {d.approvals.length > 0 && (
                      <span className="ml-1 font-mono text-[10px] text-warn">
                        {d.approvals.length}/2 approvals
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold">
                    {inr(d.amount)}
                  </td>
                  <td className="px-3 py-2">
                    <DonationActions id={d.id} status={d.status} amount={d.amount} />
                  </td>
                </tr>
              ))}
              {donations.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-body">
                    No donations recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-body">
          Capture moves a pledge to escrow credit; refund reverses it. Amounts
          above ₹5L need two distinct admin approvals. Dispatch queue entries:{" "}
          {dispatch.length}.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-ink">
            Public ledger
          </h2>
          <CsvExport
            filename="reliefchain-ledger.csv"
            headers={["date", "ref", "note", "amount_inr"]}
            rows={ledger.map((r) => [r.date, r.ref, r.note, r.amount])}
          />
        </div>
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-canvas">
              <tr className="border-b border-line font-ui text-[11px] uppercase text-slate-body">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Note</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row) => (
                <tr key={row.ref} className="border-b border-line last:border-0">
                  <td className="px-3 py-2.5 font-mono text-xs">{row.date}</td>
                  <td className="px-3 py-2.5">
                    <p className="text-slate-ink">{row.note}</p>
                    <p className="font-mono text-[11px] text-slate-body">{row.ref}</p>
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono ${
                      row.kind === "in" ? "text-ok" : "text-slate-ink"
                    }`}
                  >
                    {row.kind === "in" ? "+" : "−"}
                    {inr(Math.abs(row.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
