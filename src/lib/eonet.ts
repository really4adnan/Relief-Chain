/**
 * Live disaster feed — NASA Earth Observatory of Natural Events (EONET) v3.
 * Free, keyless API. We pull open+recent events inside the India region bbox
 * (68–98°E, 6–37°N) and cache for 1 hour to be polite to NASA's servers.
 */

const EONET_URL =
  "https://eonet.gsfc.nasa.gov/api/v3/events?status=all&bbox=68,6,98,37&limit=300";

export interface LiveEvent {
  id: string;
  title: string;
  category: string;
  status: string;
  date: string;
  lat?: number;
  lon?: number;
  sourceTitle?: string;
  sourceUrl?: string;
}

interface EonetGeometry {
  date?: string;
  coordinates?: [number, number];
}

interface EonetEvent {
  id?: string;
  title?: string;
  status?: string;
  categories?: { title?: string }[];
  geometry?: EonetGeometry[];
  sources?: { title?: string; url?: string }[];
}

export async function getIndiaRegionEvents(limit = 12): Promise<LiveEvent[]> {
  try {
    const res = await fetch(EONET_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const json = (await res.json()) as { events?: EonetEvent[] };
    const mapped: LiveEvent[] = [];

    for (const ev of json.events ?? []) {
      const geometries = ev.geometry ?? [];
      const last = geometries
        .filter((g) => Boolean(g.date))
        .sort((a, b) => +new Date(b.date!) - +new Date(a.date!))[0];

      if (!last?.date || !ev.title) continue;

      mapped.push({
        id: ev.id ?? ev.title,
        title: ev.title,
        category: ev.categories?.[0]?.title ?? "Event",
        status: ev.status === "open" ? "active" : "monitoring",
        date: last.date!,
        lat: last.coordinates?.[1],
        lon: last.coordinates?.[0],
        sourceTitle: ev.sources?.[0]?.title,
        sourceUrl: ev.sources?.[0]?.url,
      });
    }

    return mapped
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, limit);
  } catch {
    // Offline / API down — pages fall back gracefully.
    return [];
  }
}
