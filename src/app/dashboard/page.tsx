import type { Metadata } from "next";
import { SectionHead } from "@/components/ui";
import { DashboardView } from "@/components/dashboard-view";
import { DashboardSession } from "@/components/dashboard-session";
import { getAllDisasters, getLedgerRows } from "@/lib/repo";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Role-based operations dashboard for ReliefChain organisations.",
};

export default async function DashboardPage() {
  const [disasters, ledger] = await Promise.all([
    getAllDisasters(),
    getLedgerRows(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHead
        eyebrow="Operations · India only"
        title="Operations dashboard"
        desc="Live state map, dispatch queue and the auditable funds ledger. Sign in to tie this view to your organisation account."
        action={{ href: "/tenders", label: "Browse tenders" }}
      />

      <DashboardSession demo={!isSupabaseConfigured} />

      <DashboardView disasters={disasters} ledger={ledger} />
    </div>
  );
}
