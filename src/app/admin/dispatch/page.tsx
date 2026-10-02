import { Badge } from "@/components/ui";
import { DispatchForm } from "@/components/dispatch-form";
import { TenderAdminActions } from "@/components/tender-claim";
import {
  DisasterStatusActions,
  TenderCreateForm,
} from "@/components/admin-dispatch-tools";
import { getAllDispatch, getAllDisasters, getAllTenders } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function DispatchPage() {
  const [dispatch, disasters, tenders] = await Promise.all([
    getAllDispatch(),
    getAllDisasters(),
    getAllTenders(),
  ]);
  const active = disasters.filter((d) => d.status === "active");

  return (
    <div className="space-y-8">
      <div className="border-b border-line pb-3">
        <h1 className="text-xl font-semibold text-slate-ink">
          Emergency dispatch
        </h1>
        <p className="mt-1 text-sm">
          Broadcast a verified alert — every registered body in the affected
          region is notified simultaneously and the event goes live on the public
          feed.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-ink">
            New alert
          </h2>
          <div className="border border-line bg-surface p-5">
            <DispatchForm />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-ink">
            Queue notifications ({dispatch.length})
          </h2>
          <div className="max-h-[480px] overflow-y-auto border border-line bg-surface">
            <ul className="divide-y divide-line">
              {dispatch.map((entry) => (
                <li key={entry.id} className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="teal">{entry.channel}</Badge>
                    <Badge tone={entry.status === "sent" ? "ok" : "warn"}>
                      {entry.status}
                    </Badge>
                    <span className="ml-auto font-mono text-[11px] text-slate-body">
                      {new Date(entry.sentAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-ink">
                    {entry.orgName}
                  </p>
                  <p className="text-xs text-slate-body">
                    {entry.disasterTitle}
                    {entry.note ? ` · ${entry.note}` : ""}
                  </p>
                </li>
              ))}
              {dispatch.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-slate-body">
                  Empty — broadcast your first alert.
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-ink">
          Tender lifecycle ({tenders.length})
        </h2>
        <div className="mb-6 border border-line bg-surface p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-ink">Open a new tender</h3>
          <TenderCreateForm disasters={disasters.map((d) => ({ id: d.id, title: d.title }))} />
        </div>
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-canvas">
              <tr className="border-b border-line font-ui text-[11px] uppercase text-slate-body">
                <th className="px-3 py-2 font-medium">Ref</th>
                <th className="px-3 py-2 font-medium">Tender</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Manage</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((t) => (
                <tr key={t.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 font-mono text-xs text-teal-brand">{t.ref}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium text-slate-ink">{t.title}</p>
                    {t.claimedByName && (
                      <p className="font-mono text-[11px] text-slate-body">
                        claimed by {t.claimedByName}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      tone={
                        t.status === "Open"
                          ? "ok"
                          : t.status === "Claimed"
                            ? "teal"
                            : t.status === "In Progress"
                              ? "warn"
                              : "neutral"
                      }
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <TenderAdminActions id={t.id} status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-ink">
          Active emergencies ({active.length})
        </h2>
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-canvas">
              <tr className="border-b border-line font-ui text-[11px] uppercase text-slate-body">
                <th className="px-3 py-2 font-medium">Alert</th>
                <th className="px-3 py-2 font-medium">Region</th>
                <th className="px-3 py-2 font-medium">Severity</th>
                <th className="px-3 py-2 text-right font-medium">Affected</th>
                <th className="px-3 py-2 font-medium">Reported</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {active.map((d) => (
                <tr key={d.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 font-medium text-slate-ink">{d.title}</td>
                  <td className="px-3 py-2">
                    {d.region}, {d.state}
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      tone={d.severity === "critical" ? "alert" : d.severity === "high" ? "warn" : "neutral"}
                    >
                      {d.severity}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {d.affected.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {new Date(d.reportedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <DisasterStatusActions id={d.id} status={d.status} />
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
