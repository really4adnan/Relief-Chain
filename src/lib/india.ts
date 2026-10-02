import { indiaStatePaths } from "./india-map-data";

const alias: Record<string, string> = {
  orissa: "or",
  uttaranchal: "ut",
  ladakh: "jk",
  "jammu & kashmir": "jk",
  "j&k": "jk",
  "dadra and nagar haveli and daman and diu": "dn",
  "dadra & nagar haveli and daman & diu": "dn",
  "daman & diu": "dd",
  "andaman & nicobar": "an",
  "andaman & nicobar islands": "an",
  nct: "dl",
  "nct of delhi": "dl",
  pondicherry: "py",
};

const byName = new Map<string, string>();
for (const s of indiaStatePaths) byName.set(s.name.toLowerCase(), s.id);

/** Resolve a free-text Indian state/UT name to the map's 2-letter id. */
export function stateIdFromName(name: string): string | null {
  const key = name.trim().toLowerCase();
  if (alias[key]) return alias[key];
  if (byName.has(key)) return byName.get(key)!;
  // tolerate "District" / parenthetical suffixes: "Kachchh (Kutch)" -> "kachchh"
  const head = key.split(/[(/,]/)[0].trim();
  if (byName.has(head)) return byName.get(head)!;
  for (const [n, id] of byName) if (n.startsWith(head) || head.startsWith(n)) return id;
  return null;
}

export function stateNameFromId(id: string): string | null {
  return indiaStatePaths.find((s) => s.id === id)?.name ?? null;
}

export type StateRollup = {
  /** state id → affected people (choropleth value) */
  metrics: Record<string, number>;
  /** state ids with at least one critical active disaster */
  critical: string[];
  /** state id → number of active disasters */
  counts: Record<string, number>;
};

export function rollupByState<
  T extends { state: string; affected: number; severity: string; status: string },
>(items: T[]): StateRollup {
  const metrics: Record<string, number> = {};
  const counts: Record<string, number> = {};
  const critical = new Set<string>();

  for (const item of items) {
    const id = stateIdFromName(item.state);
    if (!id) continue;
    metrics[id] = (metrics[id] ?? 0) + item.affected;
    counts[id] = (counts[id] ?? 0) + 1;
    if (item.severity === "critical" && item.status !== "resolved") critical.add(id);
  }
  return { metrics, counts, critical: [...critical] };
}
