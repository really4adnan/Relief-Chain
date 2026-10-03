import type { Metadata } from "next";
import { AlertTicker } from "@/components/alert-ticker";
import { NdmaDrills } from "@/components/ndma-drills";
import { StudyZone } from "@/components/study-zone";
import { Reveal } from "@/components/motion";
import { Kicker } from "@/components/ui";

export const metadata: Metadata = {
  title: "Know nature",
  description:
    "Learn why floods, earthquakes, cyclones, heatwaves, landslides and wildfires happen — and how to resist them. NDMA safety drills, flip cards + quiz.",
};

export default function LearnPage() {
  return (
    <>
      <AlertTicker />
      <StudyZone />

      {/* ============ NDMA SAFETY DRILLS ============ */}
      <section id="ndma-drills" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16">
          <Reveal>
            <Kicker>Official protocol · ndma.gov.in</Kicker>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight text-slate-ink sm:text-4xl">
              NDMA safety drills, step by step.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-body">
              Condensed from the National Disaster Management
              Authority&rsquo;s official Do&rsquo;s &amp; Don&rsquo;ts.
              Open a drill, walk the steps, and pack the kit — each card
              links back to its source on ndma.gov.in for verification.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8">
              <NdmaDrills />
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-8 border-t border-line pt-5 text-center font-mono text-[11px] tracking-wide text-slate-body">
              Escalation guide — L1 District (DDMA) · L2 State (SDRF) · L3
              National (NDRF) · Helplines{" "}
              <a href="tel:112" className="font-semibold text-slate-ink underline underline-offset-4">
                112
              </a>{" "}
              · NDMA{" "}
              <a href="tel:1078" className="font-semibold text-slate-ink underline underline-offset-4">
                1078
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
