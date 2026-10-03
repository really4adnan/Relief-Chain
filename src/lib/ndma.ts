import type { Disaster } from "./data";

/* ------------------------------------------------------------------ */
/* NDMA escalation levels — who commands the response.
   L1 District → DDMA handles it locally.
   L2 State    → SDRF + state assistance deployed.
   L3 National → NDRF + inter-state relief mobilized.                */
/* ------------------------------------------------------------------ */

export type NdmaLevel = "L1" | "L2" | "L3";

export const NDMA_LEVELS: Record<
  NdmaLevel,
  { code: NdmaLevel; scope: string; responder: string; detail: string }
> = {
  L1: {
    code: "L1",
    scope: "District",
    responder: "DDMA",
    detail: "Managed locally by the District Disaster Management Authority",
  },
  L2: {
    code: "L2",
    scope: "State",
    responder: "SDRF",
    detail: "SDRF & state assistance deployed",
  },
  L3: {
    code: "L3",
    scope: "National",
    responder: "NDRF",
    detail: "NDRF & inter-state relief mobilized",
  },
};

/**
 * Derive the NDMA escalation level for a register entry.
 * Critical severity or ≥50,000 affected → national (L3).
 * High severity or ≥10,000 affected → state (L2).
 * Everything else stays a district-level (L1) response.
 */
export function ndmaLevelFor(
  d: Pick<Disaster, "severity" | "affected">,
): NdmaLevel {
  if (d.severity === "critical" || d.affected >= 50000) return "L3";
  if (d.severity === "high" || d.affected >= 10000) return "L2";
  return "L1";
}

/* ------------------------------------------------------------------ */
/* NDMA safety drills — step-by-step protocols adapted from the
   official NDMA Do's & Don'ts (ndma.gov.in). Each drill keeps its
   source URL so readers can verify against the original.           */
/* ------------------------------------------------------------------ */

export interface NdmaDrillStep {
  title: string;
  detail: string;
}

export interface NdmaDrill {
  slug: "flood" | "earthquake" | "cyclone";
  title: string;
  tagline: string;
  duration: string;
  sourceLabel: string;
  sourceUrl: string;
  steps: NdmaDrillStep[];
  checklistTitle?: string;
  checklist?: string[];
  donts: string[];
}

export const NDMA_DRILLS: NdmaDrill[] = [
  {
    slug: "flood",
    title: "Flood Protocol · The Ankle Rule",
    tagline: "Higher ground, clean water, live current — in that order.",
    duration: "5-minute drill",
    sourceLabel: "NDMA Flood Do's & Don'ts",
    sourceUrl: "https://ndma.gov.in/index.php/floods-dos-donts",
    steps: [
      {
        title: "Track official warnings first",
        detail:
          "Listen to radio, TV and IMD bulletins. Flash floods can strike streams and drainage channels with no rain clouds overhead — never wait for instructions to move.",
      },
      {
        title: "Respect the Ankle Rule",
        detail:
          "Never walk through moving water: NDMA warns six inches of moving water can knock you down. Test still ground ahead with a stick, and keep children strictly away from flood water.",
      },
      {
        title: "Move to higher ground early",
        detail:
          "At the first sign of flash flooding, shift family and essentials to an upper floor or high ground. Do not drive into flooded areas — abandon a stalling car and climb.",
      },
      {
        title: "Cut the current",
        detail:
          "Switch off the mains, disconnect appliances, and never touch electrical equipment while wet or standing in water. Stay clear of electric poles and fallen power lines.",
      },
      {
        title: "Purify every drop",
        detail:
          "Drink only boiled or chlorinated water. Discard contaminated food, avoid damaged electrical goods, and get inoculated if health workers advise it.",
      },
    ],
    donts: [
      "Don't walk through moving water",
      "Don't drive into flooded areas",
      "Don't let children play in flood water",
      "Don't touch electricals while wet",
    ],
  },
  {
    slug: "earthquake",
    title: "Drop · Cover · Hold — the 10-second drill",
    tagline: "NDMA's Jhuko, Dhako, Pakdo — practice until it's reflex.",
    duration: "10-second drill",
    sourceLabel: "NDMA Earthquake Dos & Don'ts",
    sourceUrl: "https://ndma.gov.in/index.php/earthquake-dos-donts",
    steps: [
      {
        title: "Drop — Jhuko",
        detail:
          "The instant shaking starts, drop to your hands and knees before the quake knocks you down.",
      },
      {
        title: "Cover — Dhako",
        detail:
          "Shelter under a sturdy table or desk, and shield your head and neck with your arms.",
      },
      {
        title: "Hold — Pakdo",
        detail:
          "Grip the table leg and stay put until the shaking fully stops — about ten seconds in most drills.",
      },
      {
        title: "After the shaking",
        detail:
          "Check yourself and others, expect aftershocks, and never light a match — ruptured gas lines can ignite.",
      },
      {
        title: "Quake-proof the room",
        detail:
          "Anchor overhead lighting, repair deep plaster cracks with expert advice, and build to BIS codes for your zone.",
      },
    ],
    donts: [
      "Don't move mid-shaking — Drop, Cover, Hold instead",
      "Don't light a match — gas lines may be ruptured",
    ],
  },
  {
    slug: "cyclone",
    title: "Cyclone Warning · Shelter & Kit Check",
    tagline: "Board up, pack up, and respect the eye.",
    duration: "15-minute drill",
    sourceLabel: "NDMA Cyclone Do's & Don'ts",
    sourceUrl: "https://ndma.gov.in/index.php/cyclone-dos-donts",
    steps: [
      {
        title: "Harden the house",
        detail:
          "Secure loose tiles, repair doors and windows. Board glass panes with wooden boards — or paste paper strips to stop splinters.",
      },
      {
        title: "Pack the emergency kit",
        detail:
          "Tick off the kit checklist below: light, water, dry food and medicines go in the bag before the warning upgrades.",
      },
      {
        title: "Heed the warning, ignore rumours",
        detail:
          "Monitor radio warnings round the clock and pass official information on. A cyclone alert means danger within 24 hours — leave low-lying coasts early.",
      },
      {
        title: "Respect the eye",
        detail:
          "When winds suddenly calm, the cyclone's eye is passing — do NOT venture out. Stay inside with the mains switched off until the official all-clear.",
      },
      {
        title: "Return only when told",
        detail:
          "Remain in the shelter until informed. Avoid dangling wires, clear debris, drive carefully, and report losses to the authorities.",
      },
    ],
    checklistTitle: "Emergency kit checklist",
    checklist: [
      "Battery torch + extra dry cells",
      "Hurricane lantern filled with kerosene",
      "Drinking water in covered vessels",
      "Dry, non-perishable food",
      "Medicines + special food for babies & elders",
      "Valuables & documents moved upstairs",
    ],
    donts: [
      "Don't venture out when winds calm — the eye is passing",
      "Don't delay evacuation and risk being marooned",
      "Don't spread rumours — follow official bulletins",
    ],
  },
];
