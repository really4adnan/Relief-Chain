export type Severity = "critical" | "high" | "moderate";
export type DisasterStatus = "active" | "contained" | "resolved";

export interface Disaster {
  id: string;
  title: string;
  type: "Flood" | "Earthquake" | "Cyclone" | "Wildfire" | "Landslide" | "Heatwave";
  severity: Severity;
  status: DisasterStatus;
  region: string;
  state: string;
  affected: number;
  reportedAt: string;
  summary: string;
}

export interface Organisation {
  id: string;
  name: string;
  kind: "NGO" | "PWD Company" | "Government Body" | "Volunteer Group";
  focus: string;
  region: string;
  verified: boolean;
  responders: number;
  fundsRaised: number;
}

export interface Tender {
  id: string;
  ref: string;
  title: string;
  disasterId: string;
  region: string;
  budget: number;
  status: "Open" | "Claimed" | "In Progress" | "Completed";
  closesAt: string;
  skills: string[];
  claimedByName?: string;
  claimedByEmail?: string;
}

export const disasters: Disaster[] = [
  {
    id: "d1",
    title: "Brahmaputra Floods — Dibrugarh",
    type: "Flood",
    severity: "critical",
    status: "active",
    region: "Dibrugarh",
    state: "Assam",
    affected: 41200,
    reportedAt: "2026-10-09T14:20:00+05:30",
    summary:
      "Bramhaputra breached 3 embankments. 62 villages cut off, 14 relief camps operational, boat rescue teams needed.",
  },
  {
    id: "d2",
    title: "Cyclone 'Nilaya' Landfall Warning",
    type: "Cyclone",
    severity: "high",
    status: "active",
    region: "Puri–Konark coast",
    state: "Odisha",
    affected: 96000,
    reportedAt: "2026-10-09T09:05:00+05:30",
    summary:
      "IMD red warning, sustained winds 145 km/h. 800k people in evacuation zone; food + tarpaulin tenders open.",
  },
  {
    id: "d3",
    title: "Landslide — Wayanad slopes",
    type: "Landslide",
    severity: "high",
    status: "contained",
    region: "Wayanad",
    state: "Kerala",
    affected: 5400,
    reportedAt: "2026-10-07T22:40:00+05:30",
    summary:
      "Debris flow after 210mm rainfall. Search operations complete; rehabilitation housing tenders open.",
  },
  {
    id: "d4",
    title: "Urban Flooding — Chennai North",
    type: "Flood",
    severity: "moderate",
    status: "active",
    region: "Chennai",
    state: "Tamil Nadu",
    affected: 21000,
    reportedAt: "2026-10-08T18:10:00+05:30",
    summary:
      "Overflowing Coutrallam canal, 38 submerged roads. Pumping + drinking water distribution pending.",
  },
  {
    id: "d5",
    title: "Earthquake M6.1 — Kutch",
    type: "Earthquake",
    severity: "moderate",
    status: "resolved",
    region: "Kutch",
    state: "Gujarat",
    affected: 8900,
    reportedAt: "2026-09-28T06:55:00+05:30",
    summary:
      "Structural damage to 214 buildings. All rescue ops closed; reconstruction monitoring ongoing.",
  },
];

export const organisations: Organisation[] = [
  {
    id: "o1",
    name: "Aarohan Relief Trust",
    kind: "NGO",
    focus: "Flood rescue & relief camps",
    region: "Assam",
    verified: true,
    responders: 240,
    fundsRaised: 4820000,
  },
  {
    id: "o2",
    name: "Bharat Buildcon Pvt. Ltd.",
    kind: "PWD Company",
    focus: "Temporary shelter, road clearing",
    region: "Nationwide",
    verified: true,
    responders: 610,
    fundsRaised: 12500000,
  },
  {
    id: "o3",
    name: "Coastal Guardians Collective",
    kind: "Volunteer Group",
    focus: "Cyclone evacuation drills",
    region: "Odisha",
    verified: true,
    responders: 180,
    fundsRaised: 1930000,
  },
  {
    id: "o4",
    name: "Seva Annadanam Society",
    kind: "NGO",
    focus: "Mass kitchens & food packets",
    region: "Nationwide",
    verified: false,
    responders: 95,
    fundsRaised: 860000,
  },
  {
    id: "o5",
    name: "Kutch District Disaster Authority",
    kind: "Government Body",
    focus: "Coordination & verified ops",
    region: "Gujarat",
    verified: true,
    responders: 420,
    fundsRaised: 0,
  },
];

export const tenders: Tender[] = [
  {
    id: "t1",
    ref: "RC-2026-0412",
    title: "10,000 food packets — Dibrugarh camps (daily, 7 days)",
    disasterId: "d1",
    region: "Dibrugarh, Assam",
    budget: 850000,
    status: "Open",
    closesAt: "2026-10-11",
    skills: ["Mass kitchen", "Cold chain"],
  },
  {
    id: "t2",
    ref: "RC-2026-0413",
    title: "Rescue boats + trained crews (8 boats, 5 days)",
    disasterId: "d1",
    region: "Dibrugarh, Assam",
    budget: 1200000,
    status: "Claimed",
    closesAt: "2026-10-10",
    skills: ["Water rescue", "Boats"],
  },
  {
    id: "t3",
    ref: "RC-2026-0415",
    title: "Tarpaulin & ORS kits for evacuation centres",
    disasterId: "d2",
    region: "Puri, Odisha",
    budget: 2400000,
    status: "Open",
    closesAt: "2026-10-10",
    skills: ["Logistics", "Procurement"],
  },
  {
    id: "t4",
    ref: "RC-2026-0417",
    title: "300 temporary shelter units — Wayanad",
    disasterId: "d3",
    region: "Wayanad, Kerala",
    budget: 6800000,
    status: "In Progress",
    closesAt: "2026-10-14",
    skills: ["Civil works", "PWD"],
  },
  {
    id: "t5",
    ref: "RC-2026-0418",
    title: "Portable water purifiers + tanker support",
    disasterId: "d4",
    region: "Chennai, Tamil Nadu",
    budget: 940000,
    status: "Open",
    closesAt: "2026-10-12",
    skills: ["WASH", "Logistics"],
  },
];

export interface LedgerRow {
  date: string;
  ref: string;
  note: string;
  amount: number;
  kind: "in" | "out";
  state?: string;
}

export const fundsLedger: LedgerRow[] = [
  { date: "2026-10-09", ref: "TXN-8841", note: "Donation escrow — Assam floods", amount: 450000, kind: "in", state: "Assam" },
  { date: "2026-10-09", ref: "TXN-8840", note: "Tender milestone 1 — boats", amount: -600000, kind: "out", state: "Assam" },
  { date: "2026-10-08", ref: "TXN-8837", note: "Donation escrow — Odisha cyclone", amount: 1200000, kind: "in", state: "Odisha" },
  { date: "2026-10-07", ref: "TXN-8832", note: "Logistics purchase — ORS kits", amount: -184500, kind: "out" },
];

export const stats = {
  activeDisasters: disasters.filter((d) => d.status === "active").length,
  verifiedOrgs: organisations.filter((o) => o.verified).length,
  openTenders: tenders.filter((t) => t.status === "Open").length,
  peopleAffected: disasters
    .filter((d) => d.status !== "resolved")
    .reduce((sum, d) => sum + d.affected, 0),
  dispatched: 1462,
  avgDispatchTimeSec: 38,
};

export function inr(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
