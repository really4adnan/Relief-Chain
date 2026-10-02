import { Badge } from "@/components/ui";
import { AdminRegistrationActions } from "@/components/admin-actions";
import { backendInfo, getAllRegistrations } from "@/lib/repo";

export const dynamic = "force-dynamic";

function statusTone(status: string) {
  if (status === "approved") return "ok" as const;
  if (status === "rejected") return "alert" as const;
  return "warn" as const;
}

export default async function VerificationsPage() {
  const regs = await getAllRegistrations();
  const info = backendInfo();
  const pending = regs.items.filter((r) => r.status === "pending");
  const done = regs.items.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <h1 className="text-xl font-semibold text-slate-ink">
          Organisation verifications
        </h1>
        <span className="font-mono text-[11px] text-slate-body">
          {pending.length} pending · source: {info.label}
        </span>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-ink">
          Pending review
        </h2>
        <ul className="space-y-4">
          {pending.map((r) => (
            <li key={r.id} className="border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-teal-brand">
                  {r.ref}
                </span>
                <Badge tone="warn">pending</Badge>
                <span className="font-mono text-xs text-slate-body">
                  {new Date(r.createdAt).toLocaleString("en-IN")}
                </span>
                <span className="ml-auto">
                  <AdminRegistrationActions id={r.id} />
                </span>
              </div>
              <p className="mt-2 font-medium text-slate-ink">
                {r.orgName} <span className="text-slate-body">· {r.kind}</span>
              </p>
              <p className="mt-1 text-sm leading-6">{r.focus}</p>
              {(r.certUrl || r.pan || r.idProof) && (
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-2 text-xs">
                  {r.certUrl && (
                    <a
                      href={r.certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-teal-brand hover:underline"
                    >
                      Certificate ↗
                    </a>
                  )}
                  {r.pan && (
                    <span className="font-mono text-slate-body">PAN: {r.pan}</span>
                  )}
                  {r.idProof && (
                    <span className="text-slate-body">ID: {r.idProof}</span>
                  )}
                </div>
              )}
              <div className="mt-3 grid gap-x-6 gap-y-1 border-t border-line pt-3 text-xs text-slate-body sm:grid-cols-4">
                <span>Contact: {r.contactName}</span>
                <span className="font-mono">{r.email}</span>
                <span className="font-mono">{r.phone}</span>
                <span>
                  Reg: <span className="font-mono">{r.regNumber}</span> · {r.region}
                </span>
              </div>
            </li>
          ))}
          {pending.length === 0 && (
            <li className="border border-dashed border-line bg-surface p-6 text-center text-sm text-slate-body">
              Nothing waiting — every registration has been reviewed.
            </li>
          )}
        </ul>
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-ink">
            Reviewed
          </h2>
          <div className="overflow-x-auto border border-line bg-surface">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-canvas">
                <tr className="border-b border-line font-ui text-[11px] uppercase text-slate-body">
                  <th className="px-3 py-2 font-medium">Ref</th>
                  <th className="px-3 py-2 font-medium">Organisation</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {done.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-3 py-2 font-mono text-xs">{r.ref}</td>
                    <td className="px-3 py-2 font-medium text-slate-ink">
                      {r.orgName}
                    </td>
                    <td className="px-3 py-2">{r.kind}</td>
                    <td className="px-3 py-2">
                      <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
