import type { Metadata } from "next";
import Link from "next/link";
import { Badge, SectionHead } from "@/components/ui";
import { getAllOrganisations } from "@/lib/repo";
import { inr } from "@/lib/data";

export const metadata: Metadata = {
  title: "Organisation directory",
  description:
    "Verified NGOs, PWD companies, government bodies and volunteer groups registered on ReliefChain.",
};

const kinds = ["All", "NGO", "PWD Company", "Government Body", "Volunteer Group"] as const;

export default async function DirectoryPage({
  searchParams,
}: PageProps<"/directory">) {
  const { kind, q } = await searchParams;
  const activeKind = kinds.includes(kind as never) ? (kind as string) : "All";
  const query = typeof q === "string" ? q.trim().toLowerCase() : "";
  const organisations = await getAllOrganisations();

  const list = organisations.filter((o) => {
    const kindOk = activeKind === "All" || o.kind === activeKind;
    const qOk =
      !query ||
      o.name.toLowerCase().includes(query) ||
      o.focus.toLowerCase().includes(query) ||
      o.region.toLowerCase().includes(query);
    return kindOk && qOk;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHead
        eyebrow="Directory"
        title="Verified bodies on the chain"
        desc="Every listing is document-verified before it can receive dispatch alerts or claim tenders."
        action={{ href: "/register", label: "Register an organisation" }}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form className="flex flex-1 gap-2" action="/directory" method="get">
          <label htmlFor="q" className="sr-only">
            Search organisations
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search by name, focus or region…"
            className="h-10 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink placeholder:text-slate-body/70 focus:border-teal-brand"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded bg-slate-ink px-4 text-sm font-semibold text-white hover:bg-teal-brand"
          >
            Search
          </button>
        </form>
        <nav className="flex flex-wrap gap-2" aria-label="Filter by kind">
          {kinds.map((k) => (
            <Link
              key={k}
              href={k === "All" ? "/directory" : `/directory?kind=${encodeURIComponent(k)}`}
              className={`border px-3 py-1.5 text-sm font-medium ${
                activeKind === k
                  ? "border-teal-brand bg-teal-brand text-white"
                  : "border-line bg-surface text-slate-body hover:text-slate-ink"
              }`}
            >
              {k}
            </Link>
          ))}
        </nav>
      </div>

      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-canvas">
            <tr className="border-b border-line font-ui text-[11px] uppercase tracking-wide text-slate-body">
              <th className="px-4 py-2.5 font-medium">Organisation</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Region</th>
              <th className="px-4 py-2.5 text-right font-medium">Responders</th>
              <th className="px-4 py-2.5 text-right font-medium">Funds raised</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-ink">{o.name}</p>
                  <p className="text-xs text-slate-body">{o.focus}</p>
                </td>
                <td className="px-4 py-3">{o.kind}</td>
                <td className="px-4 py-3">{o.region}</td>
                <td className="px-4 py-3 text-right font-mono">
                  {o.responders}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {o.fundsRaised > 0 ? inr(o.fundsRaised) : "—"}
                </td>
                <td className="px-4 py-3">
                  {o.verified ? (
                    <Badge tone="ok">verified</Badge>
                  ) : (
                    <Badge tone="warn">pending</Badge>
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-body">
                  No organisations match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
