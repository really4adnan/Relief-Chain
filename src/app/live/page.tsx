import type { Metadata } from "next";
import { AlertTicker } from "@/components/alert-ticker";
import { SectionHead } from "@/components/ui";
import { LiveTrackingMap } from "@/components/live-tracking-map";
import { getAllDisasters, getAllTenders } from "@/lib/repo";
import { getIndiaRegionEvents } from "@/lib/eonet";

export const metadata: Metadata = {
  title: "Live tracking",
  description:
    "Track every current disaster in India live — state-wise impact map, per-emergency drill-down, open tenders and the NASA satellite feed.",
};

export const revalidate = 300;

export default async function LivePage() {
  const [disasters, tenders, liveEvents] = await Promise.all([
    getAllDisasters(),
    getAllTenders(),
    getIndiaRegionEvents(20),
  ]);

  return (
    <>
      <AlertTicker />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SectionHead
          eyebrow="Live tracking"
          title="Every current disaster, one map"
          desc="Click any state to drill into its emergencies and open tenders. Impact shading updates as new alerts are broadcast."
          action={{ href: "/disasters", label: "Full register" }}
        />
        <LiveTrackingMap
          disasters={disasters}
          liveEvents={liveEvents}
          tenders={tenders}
          updatedAt={new Date().toISOString()}
        />
      </div>
    </>
  );
}
