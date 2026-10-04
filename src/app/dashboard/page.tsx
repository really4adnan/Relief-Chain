import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { SectionHead } from "@/components/ui";
import { DashboardView } from "@/components/dashboard-view";
import { DashboardSession } from "@/components/dashboard-session";
import { RequireAuth } from "@/components/require-auth";
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
        desc="Dispatch queue, live state map and the auditable funds ledger. Sign-in required — this view is tied to your organisation account."
        action={{ href: "/tenders", label: "Browse tenders" }}
      />

      <p className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-slate-ink px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-widest text-white">
        <Lock size={11} /> Sign-in required
      </p>

      <RequireAuth next="/dashboard" action="open the operations dashboard">
        <DashboardSession demo={!isSupabaseConfigured} />

        <DashboardView disasters={disasters} ledger={ledger} />
      </RequireAuth>
    </div>
  );
}
