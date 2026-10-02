import type { Metadata } from "next";
import { AlertTicker } from "@/components/alert-ticker";
import { StudyZone } from "@/components/study-zone";

export const metadata: Metadata = {
  title: "Know nature",
  description:
    "Learn why floods, earthquakes, cyclones, heatwaves, landslides and wildfires happen — and how to resist them. Flip cards, drills + quiz.",
};

export default function LearnPage() {
  return (
    <>
      <AlertTicker />
      <StudyZone />
    </>
  );
}
