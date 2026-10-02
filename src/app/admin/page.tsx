import Link from "next/link";
import { Badge } from "@/components/ui";
import {
  backendInfo,
  getAllContacts,
  getAllDispatch,
  getAllDisasters,
  getAllDonations,
  getAllOrganisations,
  getAllRegistrations,
} from "@/lib/repo";
import { inr } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [regs, contacts, donations, disasters, orgs, dispatch] =
    await Promise.all([
      getAllRegistrations(),
      getAllContacts(),
      getAllDonations(),
      getAllDisasters(),
      getAllOrganisations(),
      getAllDispatch(),
    ]);

  const pending = regs.items.filter((r) => r.status === "pending");
  const active = disasters.filter((d) => d.status === "active");
  const totalRaised = donations.items.reduce((s, d) => s + d.amount, 0);
  const info = backendInfo();

  const tiles = [
    {
      label: "Pending verifications",
      value: pending.length,
      href: "/admin/verifications",
      tone: pending.length > 0 ? "text-warn" : "text-slate-ink",
    },
    {
      label: "Active emergencies",
      value: active.length,
      href: "/disasters",
      tone: "text-alert",
    },
    {
      label: "Unread messages",
      value: contacts.items.length,
      href: "/admin/messages",
      tone: "text-slate-ink",
    },
    {
      label: "Donation pledges",
      value: inr(totalRaised),
      href: "/admin/funds",
      tone: "text-ok",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <h1 className="text-xl font-semibold text-slate-ink">Overview</h1>
          <span className="border border-line bg-canvas px-3 py-1 font-mono text-[11px] text-slate-body">
            storage: {info.label}
          </span>
        </div>

        <div className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-4">
          {tiles.map((t) => (
            <Link key={t.label} href={t.href} className="bg-surface p-4 hover:bg-canvas">
              <p className={`font-mono text-2xl font-semibold ${t.tone}`}>
                {t.value}
              </p>
              <p className="mt-0.5 text-xs">{t.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-ink">
            Recent dispatch log
          </h2>
          <Link href="/admin/dispatch" className="text-sm font-semibold text-teal-brand">
            Broadcast new alert →
          </Link>
        </div>
        <div className="mt-3 overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-canvas">
              <tr className="border-b border-line font-ui text-[11px] uppercase text-slate-body">
                <th className="px-3 py-2 font-medium">Sent</th>
                <th className="px-3 py-2 font-medium">Alert</th>
                <th className="px-3 py-2 font-medium">Organisation</th>
                <th className="px-3 py-2 font-medium">Channel</th>
              </tr>
            </thead>
            <tbody>
              {dispatch.slice(0, 8).map((entry) => (
                <tr key={entry.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 font-mono text-xs">
                    {new Date(entry.sentAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 text-slate-ink">{entry.disasterTitle}</td>
                  <td className="px-3 py-2">{entry.orgName}</td>
                  <td className="px-3 py-2">
                    <Badge tone="teal">{entry.channel}</Badge>{" "}
                    <Badge tone={entry.status === "sent" ? "ok" : "warn"}>
                      {entry.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {dispatch.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-body">
                    No dispatches yet — broadcast an alert to start the chain.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="border-b border-line pb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-ink">
            Network health
          </h2>
        </div>
        <div className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-3">
          <div className="bg-surface p-4">
            <p className="font-mono text-xl font-semibold text-slate-ink">
              {orgs.filter((o) => o.verified).length}/{orgs.length}
            </p>
            <p className="text-xs">Verified organisations</p>
          </div>
          <div className="bg-surface p-4">
            <p className="font-mono text-xl font-semibold text-slate-ink">
              {regs.items.filter((r) => r.status === "approved").length}
            </p>
            <p className="text-xs">Approvals processed</p>
          </div>
          <div className="bg-surface p-4">
            <p className="font-mono text-xl font-semibold text-slate-ink">
              {info.configured ? "connected" : "local only"}
            </p>
            <p className="text-xs">Supabase status</p>
          </div>
        </div>
      </section>
    </div>
  );
}
